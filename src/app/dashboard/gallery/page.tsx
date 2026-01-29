"use client";

import { Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
    // Using placehold.co for generic images as placeholders
    // In a real app, these would come from Supabase Storage
    const PHOTOS = [
        { id: 1, src: "https://placehold.co/600x400/EEE/31343C?text=Crkva+Sv.+Ivana", caption: "Obnova fasade crkve" },
        { id: 2, src: "https://placehold.co/600x400/EEE/31343C?text=Godi%C5%A1nja+Skup%C5%A1tina", caption: "Okupljanje članova 2025." },
        { id: 3, src: "https://placehold.co/600x400/EEE/31343C?text=Eko+Akcija", caption: "Čišćenje okoliša izvora" },
        { id: 4, src: "https://placehold.co/600x400/EEE/31343C?text=Stara+%C5%A0kola", caption: "Trenutno stanje krovišta" },
        { id: 5, src: "https://placehold.co/600x400/EEE/31343C?text=Suhozid", caption: "Radna akcija obnove suhozida" },
        { id: 6, src: "https://placehold.co/600x400/EEE/31343C?text=Dru%C5%BEenje", caption: "Zajednički ručak nakon akcije" },
    ];

    return (
        <div className="space-y-6">
            <div className="border-b border-amber-200 pb-4">
                <h1 className="text-2xl font-bold text-amber-900">Galerija</h1>
                <p className="text-stone-600">Fotografije s naših akcija i druženja.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PHOTOS.map((photo) => (
                    <div key={photo.id} className="group bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-all">
                        <div className="aspect-video bg-stone-100 rounded overflow-hidden relative">
                            {/* Placeholder for actual image component */}
                            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                <img
                                    src={photo.src}
                                    alt={photo.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-medium text-stone-700 text-center">{photo.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
