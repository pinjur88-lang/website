'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages, saveGalleryImageRef, deleteGalleryImage } from '@/actions/cms';
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type GalleryImage = {
    id: string;
    url: string;
    caption?: string;
    created_at: string;
};

export default function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadImages = async () => {
        setLoading(true);
        const { data, error } = await getGalleryImages();
        if (data) setImages(data);
        if (error) console.error(error);
        setLoading(false);
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

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
            const { error: dbError } = await saveGalleryImageRef(publicUrl, file.name); // Using filename as default caption
            if (dbError) throw dbError;

            loadImages();
        } catch (error: any) {
            alert('Upload failed: ' + error.message);
            console.error(error);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        // Optimistic UI
        setImages(prev => prev.filter(img => img.id !== id));

        // Delete from DB (The Storage file deletion is harder to sync perfectly without Trigger, 
        // but typically we should delete the file too. For now let's just delete the DB ref 
        // to hide it from UI. To make it clean, we'd delete storage too).
        // Let's rely on cleaning storage separately or implementing full delete logic if critical.

        // Attempt DB delete
        const { error } = await deleteGalleryImage(id);
        if (error) {
            alert('Failed to delete image reference.');
            loadImages();
        }

        // Optional: Try to delete from storage if we can extract path
        // const path = url.split('/').pop(); 
        // if(path) await supabase.storage.from('gallery').remove([path]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-zinc-800">Photo Gallery</h2>
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
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-zinc-400 text-sm">Loading gallery...</p>
            ) : images.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 border border-zinc-100 rounded-sm">
                    <ImageIcon className="mx-auto text-zinc-300 mb-2" size={32} />
                    <p className="text-zinc-500 text-sm">No images yet. Upload some!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="group relative aspect-square bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200">
                            <Image
                                src={img.url}
                                alt={img.caption || 'Gallery Image'}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(img.id, img.url)}
                                    className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete Image"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
