'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages, saveAlbumImageRef, deleteGalleryImage } from '@/actions/cms';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

type Album = {
    id: string;
    title: string;
    created_by: string;
};

type GalleryImage = {
    id: string;
    url: string;
    caption?: string;
    uploaded_by?: string;
};

interface AlbumViewProps {
    album: Album;
    onBack: () => void;
}

export default function AlbumView({ album, onBack }: AlbumViewProps) {
    const { user } = useAuth();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const loadImages = async () => {
        setLoading(true);
        const { data, error } = await getGalleryImages(album.id);
        if (data) setImages(data);
        setLoading(false);
    };

    useEffect(() => {
        loadImages();
    }, [album.id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowRight') setSelectedIndex(i => (i !== null && i < images.length - 1 ? i + 1 : i));
            if (e.key === 'ArrowLeft') setSelectedIndex(i => (i !== null && i > 0 ? i - 1 : i));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, images.length]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${album.id}/${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            const { error: dbError } = await saveAlbumImageRef(publicUrl, album.id, user.id, file.name);
            if (dbError) throw dbError;

            loadImages();
        } catch (error: any) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this image?')) return;
        const { error } = await deleteGalleryImage(id);
        if (error) alert('Failed to delete');
        else {
            loadImages();
            if (selectedIndex !== null) setSelectedIndex(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-stone-900">{album.title}</h2>
                    <p className="text-xs text-stone-500">Folder</p>
                </div>

                <div className="ml-auto">
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-800 transition-colors disabled:opacity-70"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                            {uploading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="text-stone-400 text-sm">Loading photos...</p>
            ) : images.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 border border-stone-100 rounded-lg">
                    <ImageIcon className="mx-auto text-stone-300 mb-2" size={32} />
                    <p className="text-stone-500 text-sm">This folder is empty. Upload a photo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={img.id}
                            onClick={() => setSelectedIndex(idx)}
                            className="group relative aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200 cursor-zoom-in"
                        >
                            <Image
                                src={img.url}
                                alt={img.caption || 'Image'}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            {(user?.id === img.uploaded_by || user?.role === 'admin' || user?.id === album.created_by) && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {selectedIndex !== null && images[selectedIndex] && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>

                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <ArrowLeft size={32} /> {/* Using ArrowLeft as 'Back' or could use X */}
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img
                            src={images[selectedIndex].url}
                            alt={images[selectedIndex].caption}
                            className="max-h-full max-w-full object-contain rounded-sm shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        />

                        {/* Prev Button */}
                        {selectedIndex > 0 && (
                            <button
                                className="absolute left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
                            >
                                <ArrowLeft size={32} />
                            </button>
                        )}

                        {/* Next Button */}
                        {selectedIndex < images.length - 1 && (
                            <button
                                className="absolute right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
                            >
                                <ArrowLeft size={32} className="rotate-180" />
                            </button>
                        )}

                        {/* Caption */}
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 pointer-events-none">
                            <p>{images[selectedIndex].caption || `Image ${selectedIndex + 1} of ${images.length}`}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
