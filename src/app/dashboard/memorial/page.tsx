"use client";

import { useEffect, useState } from 'react';
import { Search, Scroll, ArrowLeft, ArrowRight } from 'lucide-react';
import { getClans, Clan } from '@/actions/memorial';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

const ALPHABET = "ABCČĆDĐEFGHIJKLMNOPRSŠTUVZŽ".split('');

export default function MemorialPage() {
    const { language } = useLanguage();
    const [clans, setClans] = useState<Clan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState('B'); // Default to B for Baljci common names
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadClans = async () => {
            const { data } = await getClans();
            if (data) setClans(data);
            setLoading(false);
        };
        loadClans();
    }, []);

    // Filter Logic: Search overrides Letter, otherwise use Letter
    const filteredClans = clans.filter(c => {
        if (search) return c.surname.toLowerCase().includes(search.toLowerCase());

        // Handle special chars normalization if needed, but strict startsWith is usually fine for index
        // We'll uppercase both to be safe
        const firstChar = c.surname.charAt(0).toUpperCase();
        return firstChar === selectedLetter;
    });

    const labels = {
        hr: {
            title: "Memorijalni Arhiv",
            subtitle: "Indeks prezimena obitelji Baljaka",
            search: "Traži prezime...",
            empty: "Nema prezimena za ovo slovo."
        },
        en: {
            title: "Memorial Archive",
            subtitle: "Index of Baljci family surnames",
            search: "Search surname...",
            empty: "No surnames for this letter."
        },
        de: {
            title: "Gedenkarchiv",
            subtitle: "Index der Baljci-Familiennamen",
            search: "Nachname suchen...",
            empty: "Keine Nachnamen für diesen Buchstaben."
        }
    };
    const txt = labels[language as keyof typeof labels] || labels.en;

    return (
        <div className="space-y-8 max-w-5xl mx-auto min-h-[60vh]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-6">
                <div>
                    <Link href="/dashboard" className="text-xs font-bold text-stone-400 hover:text-stone-900 flex items-center gap-1 mb-2 transition-colors">
                        <ArrowLeft size={12} />
                        DASHBOARD
                    </Link>
                    <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3 font-serif">
                        <Scroll className="text-amber-700" size={32} />
                        {txt.title}
                    </h1>
                    <p className="text-stone-500 text-lg mt-2 max-w-xl font-serif italic">
                        {txt.subtitle}
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input
                        type="text"
                        placeholder={txt.search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Alphabet Scroller */}
            {!search && (
                <div className="flex flex-wrap gap-2 justify-center bg-stone-50 p-6 rounded-xl border border-stone-100">
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            onClick={() => setSelectedLetter(letter)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${selectedLetter === letter
                                ? 'bg-amber-600 text-white shadow-md scale-110'
                                : 'bg-white text-stone-500 hover:bg-stone-200 hover:text-stone-900 border border-stone-200'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Grid */}
            {loading ? (
                <div className="text-center py-20 text-stone-400 animate-pulse">Loading index...</div>
            ) : filteredClans.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <p className="text-stone-500 text-lg">{txt.empty}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredClans.map(clan => (
                        <Link
                            key={clan.id}
                            href={`/dashboard/memorial/${clan.id}`}
                            className="group bg-white p-5 rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex justify-between items-center"
                        >
                            <span className="font-serif font-bold text-xl text-stone-800 group-hover:text-amber-800 transition-colors">
                                {clan.surname}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                <ArrowRight size={14} className="text-stone-400 group-hover:text-amber-700 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
