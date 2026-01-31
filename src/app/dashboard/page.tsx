"use client";

import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, Phone, Image as ImageIcon } from 'lucide-react';
import { getAnnouncements, getGalleryImages } from '@/actions/cms';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

type Announcement = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author: { display_name: string };
};

type GalleryImage = {
    id: string;
    url: string;
    caption?: string;
};

export default function DashboardHome() {
    const { t } = useLanguage();
    const [news, setNews] = useState<Announcement[]>([]);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [newsRes, galleryRes] = await Promise.all([
                getAnnouncements(),
                getGalleryImages()
            ]);

            if (newsRes.data) setNews(newsRes.data);
            if (galleryRes.data) setImages(galleryRes.data);

            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-stone-500">{t.checking || "Učitavanje..."}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">{t.dashboard}</h1>
                    <p className="text-stone-600">{t.title} - Member Area</p>
                </div>
            </div>

            <div className="grid px-0 lg:grid-cols-3 gap-8">
                {/* Main Content - News Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                            📢 {t.community || "Novosti"}
                        </h2>
                        {news.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 text-center text-stone-500 italic">
                                Nema novih obavijesti.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {news.map((item) => (
                                    <article key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                                                <span className="flex items-center gap-1 text-stone-400">
                                                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-stone-800">{item.title}</h3>
                                            <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>

                                            <div className="flex items-center gap-2 pt-2 text-xs text-stone-500 border-t border-stone-100 mt-2">
                                                <span>Objavio: {item.author?.display_name || 'Admin'}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <ImageIcon size={20} /> {t.gallery || "Galerija"}
                        </h2>
                        {images.length === 0 ? (
                            <p className="text-stone-500 italic">Nema slika u galeriji.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.slice(0, 6).map(img => (
                                    <div key={img.id} className="relative aspect-square bg-stone-100 rounded-sm overflow-hidden border border-stone-200 group">
                                        <Image
                                            src={img.url}
                                            alt={img.caption || 'Gallery Image'}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {images.length > 6 && (
                            <div className="text-center mt-4">
                                <a href="/dashboard/gallery" className="text-sm font-bold text-stone-600 hover:text-stone-900 underline">
                                    Pogledaj sve slike
                                </a>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar - Quick Actions */}
                <div className="space-y-6">
                    {/* Social Groups Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 sticky top-4">
                        <h3 className="text-lg font-bold text-stone-800 mb-2">{t.socialTitle}</h3>
                        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                            {t.socialDesc}
                        </p>

                        <div className="space-y-3">
                            <a
                                href="https://chat.whatsapp.com/placeholder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full p-3 rounded-md bg-[#25D366]/10 text-[#075e54] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20 group"
                            >
                                <div className="bg-[#25D366] text-white p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <MessageCircle size={18} />
                                </div>
                                <span className="font-semibold text-sm">{t.joinWhatsapp}</span>
                            </a>

                            <a
                                href="https://invite.viber.com/placeholder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full p-3 rounded-md bg-[#7360f2]/10 text-[#7360f2] hover:bg-[#7360f2]/20 transition-colors border border-[#7360f2]/20 group"
                            >
                                <div className="bg-[#7360f2] text-white p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <Phone size={18} />
                                </div>
                                <span className="font-semibold text-sm">{t.joinViber}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
