
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Globe, BookOpen, Shield } from 'lucide-react';
import { getClanById, Clan } from '@/actions/memorial';
import { useLanguage } from '@/lib/language-context';

export default function ClanDetailPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [clan, setClan] = useState<Clan | null>(null);
    const [loading, setLoading] = useState(true);

    const txt = {
        hr: { back: "Natrag na Arhiv", prev: "Rasprostranjenost", world: "Dijaspora", desc: "Povijest i Podrijetlo" },
        en: { back: "Back to Archive", prev: "Prevalence", world: "Diaspora", desc: "History & Origin" },
        de: { back: "Zurück zum Archiv", prev: "Verbreitung", world: "Diaspora", desc: "Geschichte" }
    }[language as 'hr' | 'en' | 'de'] || { back: "Back", prev: "Prev", world: "Dist", desc: "Desc" };

    useEffect(() => {
        const load = async () => {
            if (params.id) {
                const { data } = await getClanById(params.id as string);
                if (data) setClan(data);
            }
            setLoading(false);
        };
        load();
    }, [params.id]);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading...</div>;
    if (!clan) return <div className="p-10 text-center">Not found.</div>;

    // Helper to get field dynamically
    const langKey = (language === 'hr' || language === 'en' || language === 'de') ? language : 'en';

    // Parse Description into Sections
    const fullDescription = (
        clan?.[`description_${langKey}` as keyof Clan] ||
        clan?.description_en ||
        ''
    );

    // Regex to split: [IZVOR: ...] or [OPĆENITO] etc.
    // We want to capture the text BETWEEN these markers.
    // Marker 1: [IZVOR: POREKLO.RS - BALJCI]
    // Marker 2: [OPĆENITO]

    const parseDescription = (text: string) => {
        let localHistory = '';
        let generalHistory = '';

        // Poreklo marker often starts the text or comes after a newline
        // Poreklo marker - stop at next [...] tag
        const localMatch = text.match(/\[IZVOR: POREKLO\.RS - BALJCI\]\s*([\s\S]*?)(?=\[[^\]]+\]|$)/);
        if (localMatch) {
            localHistory = localMatch[1].trim();
        }

        // General marker - match [OPĆENITO] or [OPĆENITO O PREZIMENU]
        const generalMatch = text.match(/\[OPĆENITO.*?\]\s*([\s\S]*?)(?=\[[^\]]+\]|$)/);
        if (generalMatch) {
            generalHistory = generalMatch[1].trim();
        }

        // Fallback: If no markers found, treating the whole text as General if it doesn't look like Poreklo
        if (!localHistory && !generalHistory) {
            generalHistory = text;
        }

        return { localHistory, generalHistory };
    };

    const { localHistory, generalHistory } = parseDescription(fullDescription);

    const getField = (field: 'prevalence' | 'world_distribution') => {
        const key = `${field}_${langKey}` as keyof Clan;
        const fallbackKey = `${field}_en` as keyof Clan;
        return clan[key] || clan[fallbackKey] || '';
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Header / Navigation */}
            <div className="flex flex-col gap-6 border-b border-stone-200 pb-8">
                <Link href="/dashboard/memorial" className="text-sm font-bold text-stone-400 hover:text-stone-900 flex items-center gap-2 transition-colors w-fit">
                    <ArrowLeft size={16} />
                    {txt.back}
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight text-balance">
                            {clan.surname}
                        </h1>
                        <p className="text-stone-500 mt-2 font-serif italic text-lg opacity-80">
                            Baljci, Drniš — {language === 'hr' ? 'Dalmacija' : 'Dalmatia'}
                        </p>
                    </div>
                    <Shield className="text-stone-100 hidden md:block" size={120} strokeWidth={1} />
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid lg:grid-cols-12 gap-12">

                {/* LEFT: Primary History (Local & Distinct) */}
                <div className="lg:col-span-8 space-y-12">

                    {/* 1. Local History (Poreklo) - The "Meat" */}
                    {localHistory && (
                        <div className="prose prose-stone prose-lg max-w-none">
                            <h3 className="flex items-center gap-3 text-amber-700 font-bold uppercase text-sm tracking-widest mb-6 border-b border-amber-100 pb-2 w-fit">
                                <BookOpen size={18} />
                                {language === 'hr' ? 'Porodično Porijeklo (Baljci)' : 'Local Family Origins'}
                            </h3>
                            <div className="bg-amber-50/50 p-8 rounded-2xl border border-amber-100/50 shadow-sm">
                                <p className="whitespace-pre-wrap leading-relaxed text-stone-800 font-serif text-xl">
                                    {localHistory}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 2. General History - Secondary */}
                    {generalHistory && (
                        <div className="prose prose-stone max-w-none">
                            {!localHistory && (
                                // Only show header if we didn't show the Local one above, or just differentiate
                                <div className="flex items-center gap-2 text-stone-400 font-bold uppercase text-xs tracking-widest mb-4">
                                    <BookOpen size={16} /> {txt.desc}
                                </div>
                            )}
                            {localHistory && (
                                <h4 className="text-stone-400 font-bold uppercase text-xs tracking-widest mb-4 mt-8 flex items-center gap-2">
                                    <Globe size={14} /> {language === 'hr' ? 'Širi Kontekst' : 'General Context'}
                                </h4>
                            )}
                            <p className="whitespace-pre-wrap leading-loose text-stone-600">
                                {generalHistory}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Stats Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-10 space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                            <h3 className="text-stone-900 font-bold font-serif text-lg mb-6 pb-2 border-b border-stone-100">
                                {language === 'hr' ? 'Statistika' : 'Statistics'}
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-amber-600 font-bold uppercase text-[10px] tracking-widest mb-2">
                                        <Users size={12} /> {txt.prev}
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        {getField('prevalence')}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest mb-2">
                                        <Globe size={12} /> {txt.world}
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        {getField('world_distribution')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decoration / CTA */}
                        <div className="bg-stone-900 text-stone-400 p-6 rounded-xl text-xs leading-relaxed text-center">
                            {language === 'hr'
                                ? "Imate li više informacija ili fotografija o ovoj obitelji? Kontaktirajte nas."
                                : "Do you have more info or photos of this family? Contact us."}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
