"use client";

import { FileText, MapPin, Clock, Briefcase, Globe, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { translations } from '@/lib/translations';

export default function OIBPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-600">
                    <FileText size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                        {t.oibTitle}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        {t.oibHero}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Option A: Consulate */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm opacity-75 hover:opacity-100 transition">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700">{t.oibOptionA}</h2>
                    </div>
                    <p className="text-slate-600 mb-4 h-12">{t.oibOptionADesc}</p>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-500">
                        Recommended only if you are not planning to visit Croatia soon.
                    </div>
                </div>

                {/* Option B: Drniš (Recommended) */}
                <div className="bg-white border-2 border-blue-500 rounded-xl p-6 shadow-lg relative transform md:scale-105">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Recommended
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{t.oibOptionB}</h2>
                    </div>
                    <p className="text-slate-600 mb-6">{t.oibOptionBDesc}</p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 text-slate-700">
                            <Briefcase size={18} className="mt-1 text-blue-500" />
                            <div>
                                <span className="font-bold block">{t.oibOffice}</span>
                                <span className="text-sm">{t.oibAddress}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700">
                            <CheckCircle size={18} className="mt-1 text-blue-500" />
                            <div>
                                <span className="font-bold block">{t.oibBring}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700">
                            <FileText size={18} className="mt-1 text-blue-500" />
                            <div>
                                <span className="font-bold block">{t.oibForm}</span>
                                <a href="https://www.porezna-uprava.hr/en/EN_obrazac/Documents/PinRequest.pdf" target="_blank" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1">
                                    <Download size={14} /> {t.oibDownload}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-slate-700 bg-blue-50 p-3 rounded-lg">
                            <Clock size={18} className="mt-1 text-blue-600" />
                            <span className="text-blue-900 font-medium text-sm">{t.oibTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                <div>
                    <h3 className="font-bold text-amber-900 mb-1">Why do I need an OIB?</h3>
                    <p className="text-amber-800 text-sm">
                        The OIB (Osobni identifikacijski broj) is required for <strong>everything</strong> in Croatia. It is your permanent ID for all official registries (Land Registry, Grimunt, Tax, Utilities).
                    </p>
                </div>
            </div>
        </div>
    );
}
