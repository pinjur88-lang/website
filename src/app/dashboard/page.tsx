"use client";

import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, Phone, Image as ImageIcon, Map as MapIcon, Scroll, Mail, Vote } from 'lucide-react';
import { getAnnouncements, getGalleryImages } from '@/actions/cms';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import TravelWidget from '@/components/dashboard/TravelWidget';
import GalleryCarousel from '@/components/dashboard/GalleryCarousel';

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
                    <p className="text-slate-600">{t.title} - {t.dashboardMemberArea || "Member Area"}</p>
                </div>
            </div>

            <div className="grid px-0 lg:grid-cols-3 gap-8">
                {/* Main Content - News Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            📢 {t.newsFeed || "Novosti"}
                        </h2>
                        {news.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-sky-100 text-center text-slate-500 italic">
                                {t.noAnnouncements || "Nema novih obavijesti."}
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
                                                <span>{t.publishedBy || "Objavio"}: {item.author?.display_name || 'Admin'}</span>
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
                            <p className="text-slate-500 italic">{t.noImagesInGallery || "Nema slika u galeriji."}</p>
                        ) : (
                            <GalleryCarousel images={images.slice(0, 5)} />
                        )}
                    </section>
                </div>

                {/* Sidebar - Quick Actions */}
                <div className="space-y-6">

                    {/* Support the Vision Box */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-2">{t.supportVision || "Support the Vision"}</h3>
                        <p className="text-indigo-100 mb-6 text-sm">
                            {t.supportVisionDesc || "Your contributions help build the future of Baljci. Every stone counts."}
                        </p>
                        <a
                            href="https://buy.stripe.com/5kQbJ160x3l6g8Q6FK4ZG00"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-colors shadow-sm w-full text-center"
                        >
                            {t.donateButton || "Donate Now"}
                        </a>
                    </div>

                    {/* Weather Widget (Top) */}
                    <WeatherWidget />

                    {/* Visitor Calendar */}
                    <TravelWidget />

                    {/* Voting Hall Widget */}
                    <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-6 rounded-lg shadow-md text-white group hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Vote size={20} />
                            </div>
                            <h3 className="font-bold">{t.votingHall || 'Dvorana za Glasovanje'}</h3>
                        </div>
                        <p className="text-sky-100 text-xs mb-4 leading-relaxed">
                            {t.votingHallWidgetDesc || "Vaša odluka je važna! Sudjelujte u novom glasovanju o utrošku sredstava."}
                        </p>
                        <a href="/dashboard/voting" className="text-white text-xs font-bold hover:underline flex items-center gap-1">
                            {t.voteNow || 'Glasaj Sada'}
                            <span className="text-lg">→</span>
                        </a>
                    </div>

                    {/* Digitalni Spomenar Widget */}
                    <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 rounded-lg shadow-md text-white group hover:shadow-lg transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ImageIcon size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ImageIcon size={20} />
                                </div>
                                <h3 className="font-bold">{t.digitalSpomenar || "Digitalni Spomenar"}</h3>
                            </div>
                            <p className="text-orange-50 text-xs mb-4 leading-relaxed font-medium">
                                {t.spomenarDesc || "Imate stare fotografije u kutiji cipela? Gradimo trajnu povijest Baljaka."}
                            </p>
                            <p className="text-orange-100/80 text-[10px] mb-4 italic border-l-2 border-orange-400 pl-2">
                                {t.spomenarNote || '"Nagrada: Za svaku sliku, Admin će vam besplatno restaurirati jednu!"'}
                            </p>
                            <a href="/dashboard/spomenar" className="text-white text-xs font-bold hover:underline flex items-center gap-1">
                                {t.uploadPhotos || "Učitaj Fotografije"} <span className="text-lg">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Social Groups Card (Compact) */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-2">{t.socialTitle}</h3>
                        <div className="space-y-2">
                            <a
                                href="https://chat.whatsapp.com/EJ4lyzlugri05X0z0B801c?mode=gi_t"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 w-full p-2 rounded-md bg-[#25D366]/5 text-[#075e54] hover:bg-[#25D366]/10 transition-colors border border-[#25D366]/20 group"
                            >
                                <MessageCircle size={16} className="text-[#25D366]" />
                                <span className="font-semibold text-xs">{t.joinWhatsapp}</span>
                            </a>

                            <a
                                href="https://invite.viber.com/?g=aD_xKl7mA1bKZTm6fyYEono7H4h5GNRy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 w-full p-2 rounded-md bg-[#7360f2]/5 text-[#7360f2] hover:bg-[#7360f2]/10 transition-colors border border-[#7360f2]/20 group"
                            >
                                <Phone size={16} className="text-[#7360f2]" />
                                <span className="font-semibold text-xs">{t.joinViber}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
