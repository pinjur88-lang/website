"use client";

import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, Phone, Image as ImageIcon, Map as MapIcon, Scroll } from 'lucide-react';
import { getAnnouncements, getGalleryImages } from '@/actions/cms';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import TravelWidget from '@/components/dashboard/TravelWidget';

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
            <div className="flex justify-between items-end border-b border-sky-200/60 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t.dashboard}</h1>
                    <p className="text-slate-600">{t.title} - Member Area</p>
                </div>
            </div>

            <div className="grid px-0 lg:grid-cols-3 gap-8">
                {/* Main Content - News Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            📢 {t.community || "Novosti"}
                        </h2>
                        {news.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-sky-100 text-center text-slate-500 italic">
                                Nema novih obavijesti.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {news.map((item) => (
                                    <article key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow hover:border-sky-200">
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1 text-stone-400">
                                                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>

                                            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 border-t border-slate-50 mt-2">
                                                <span>Objavio: {item.author?.display_name || 'Admin'}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ImageIcon size={20} /> {t.gallery || "Galerija"}
                        </h2>
                        {images.length === 0 ? (
                            <p className="text-slate-500 italic">Nema slika u galeriji.</p>
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
                    {/* Map Widget */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-lg shadow-lg border border-indigo-500/30 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MapIcon size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <MapIcon className="text-indigo-400" />
                            {t.title === "Association Baljci" ? "Interactive Map" : "Interaktivna Karta"}
                        </h3>
                        <p className="text-indigo-200 text-sm mb-4 relative z-10 leading-relaxed">
                            {t.title === "Association Baljci"
                                ? "Explore the village, find ancestral homes, and see historical photos."
                                : "Istražite selo, pronađite djedovinu i pogledajte povijesne fotografije."}
                        </p>
                        <a href="/map" className="block w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-center rounded-md font-bold text-sm transition-colors relative z-10 shadow-md">
                            {t.title === "Association Baljci" ? "Open Map" : "Otvori Kartu"}
                        </a>
                    </div>

                    {/* Memorial Archive Widget */}
                    <div className="bg-gradient-to-br from-amber-900 to-stone-900 p-6 rounded-lg shadow-lg border border-amber-500/30 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scroll size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <Scroll className="text-amber-400" />
                            {t.title === "Association Baljci" ? "Memorial Archive" : "Memorijalni Arhiv"}
                        </h3>
                        <p className="text-amber-200 text-sm mb-4 relative z-10 leading-relaxed">
                            {t.title === "Association Baljci"
                                ? "Discover family origins, clan distributions, and historical records."
                                : "Istražite porijeklo obitelji, rasprostranjenost klanova i povijesne zapise."}
                        </p>
                        <a href="/dashboard/memorial" className="block w-full py-2 bg-amber-600 hover:bg-amber-500 text-center rounded-md font-bold text-sm transition-colors relative z-10 shadow-md">
                            {t.title === "Association Baljci" ? "Open Archive" : "Otvori Arhiv"}
                        </a>
                    </div>

                    {/* Weather Widget */}
                    <WeatherWidget />

                    {/* Visitor Calendar */}
                    <TravelWidget />

                    {/* Social Groups Card */}
                    {/* Social Groups Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-sky-100 sticky top-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{t.socialTitle}</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
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
