"use client";

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { db, NewsItem } from '@/lib/db'; // Import from new async db
import { useLanguage } from '@/lib/language-context';

export default function DashboardHome() {
    const { t } = useLanguage();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            const data = await db.getNews();
            setNews(data);
            setLoading(false);
        };
        loadNews();
    }, []);

    if (loading) {
        return <div className="p-4 text-center text-stone-500">Učitavanje novosti...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">{t.dashboard} / Novosti</h1>
                    <p className="text-stone-600">Najnovije obavijesti i događanja u udruzi.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {news.length === 0 ? (
                    <p className="text-stone-500 italic">Nema novih obavijesti.</p>
                ) : (
                    news.map((item) => (
                        <article key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                                        {item.tags && item.tags[0] && (
                                            <span className="bg-stone-100 px-2 py-1 rounded-full border border-stone-200">{item.tags[0]}</span>
                                        )}
                                        <span className="flex items-center gap-1 text-stone-400">
                                            <Calendar size={12} /> {item.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-stone-800">{item.title}</h3>
                                    <p className="text-stone-600 leading-relaxed whitespace-pre-line">{item.content}</p>

                                    <div className="flex items-center gap-2 pt-2 text-xs text-stone-500">
                                        <div className="w-5 h-5 bg-stone-200 rounded-full flex items-center justify-center font-serif text-stone-600">
                                            {item.author.charAt(0)}
                                        </div>
                                        <span>Objavio: {item.author}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
