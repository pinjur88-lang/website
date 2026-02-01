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

    const loadImages = async () => {
        setLoading(true);
        const { data, error } = await getGalleryImages(album.id);
        if (data) setImages(data);
        setLoading(false);
    };

    useEffect(() => {
        loadImages();
    }, [album.id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${album.id}/${fileName}`; // Organize by album ID in storage if possible, or just flat

        try {
            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            // 3. Save reference to Database
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
        else loadImages();
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
                    {images.map(img => (
                        <div key={img.id} className="group relative aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                            <Image
                                src={img.url}
                                alt={img.caption || 'Image'}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            {/* Delete Overlay */}
                            {(user?.id === img.uploaded_by || user?.role === 'admin' || user?.id === album.created_by) && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(img.id)}
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
        </div>
    );
}
