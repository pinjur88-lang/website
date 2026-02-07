'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

type GalleryImage = {
    id: string;
    url: string;
    caption?: string;
};

interface GalleryCarouselProps {
    images: GalleryImage[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-advance
    useEffect(() => {
        if (!isHovered && images.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 5000); // 5 seconds
            return () => clearInterval(timer);
        }
    }, [isHovered, images.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="bg-stone-100 rounded-xl p-8 text-center text-stone-500 border border-stone-200">
                <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                <p>No images in the gallery yet.</p>
                <Link href="/dashboard/gallery" className="mt-4 inline-block text-sm font-bold text-sky-600 hover:underline">
                    Upload Photos
                </Link>
            </div>
        );
    }

    return (
        <div
            className="group relative w-full aspect-video md:aspect-[2/1] bg-stone-900 rounded-xl overflow-hidden shadow-md border border-stone-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Image */}
            <div className="relative w-full h-full">
                <Image
                    src={images[currentIndex].url}
                    alt={images[currentIndex].caption || 'Gallery Image'}
                    fill
                    priority
                    className="object-cover transition-all duration-700"
                />

                {/* Gradient Overlay for Text */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                    <p className="font-medium text-lg drop-shadow-md truncate">
                        {images[currentIndex].caption || 'Untitled Photo'}
                    </p>
                    <p className="text-xs text-white/70">
                        {currentIndex + 1} / {images.length}
                    </p>
                </div>
            </div>

            {/* Controls - Show on Hover for User but always on Mobile potentially */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* View All Button */}
            <Link
                href="/dashboard/gallery"
                className="absolute top-4 left-4 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md border border-white/20 transition-colors"
            >
                View Gallery
            </Link>
        </div>
    );
}
