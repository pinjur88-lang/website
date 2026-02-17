"use client";

import { FileText, MapPin, Clock, Briefcase, Globe, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { translations } from '@/lib/translations';

export default function OIBPage() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText size={180} />
                </div>
                <div className="relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 uppercase tracking-wider">
                        Official Guide
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                        {t.oibTitle}
                    </h1>
                    <p className="text-xl text-blue-50 max-w-2xl leading-relaxed opacity-90">
                        {t.oibHero}
                    </p>
                </div>
            </div>

            {/* Three Paths Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Path A: Online */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                        <Globe size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.oibOptionOnline}</h2>
                    <p className="text-slate-600 mb-6 flex-grow">{t.oibOptionOnlineDesc}</p>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{t.oibOnlineInstructions}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-700">
                            <FileText size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold block">{t.oibForm}</span>
                                <a href="https://www.porezna-uprava.hr/en/EN_obrazac/Documents/PinRequest.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1 font-medium">
                                    <Download size={14} /> {t.oibDownload}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Path B: In Croatia */}
                <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 shadow-lg md:-mt-4 md:mb-4 relative flex flex-col group">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                        Recommended
                    </div>
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <MapPin size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.oibOptionCroatia}</h2>
                    <p className="text-slate-600 mb-6 flex-grow">{t.oibOptionCroatiaDesc}</p>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-3 text-sm text-slate-800 font-medium">
                            <Briefcase size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="block">{t.oibOffice}</span>
                                <span className="text-slate-500 text-xs font-normal">{t.oibAddress}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-800">
                            <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <span>{t.oibBring}</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                            <Clock size={18} className="text-blue-600 shrink-0" />
                            <span className="text-blue-900 text-xs font-bold">{t.oibTime}</span>
                        </div>
                    </div>
                </div>

                {/* Path C: Consulate */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col group">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                        <Briefcase size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.oibOptionConsulate}</h2>
                    <p className="text-slate-600 mb-6 flex-grow">{t.oibOptionConsulateDesc}</p>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-amber-900 text-xs font-medium leading-relaxed">
                            Only use this if you cannot do it online and are not planning a visit to Croatia soon.
                        </span>
                    </div>
                </div>
            </div>

            {/* Why section */}
            <div className="bg-slate-900 text-white rounded-3xl p-10 overflow-hidden relative shadow-2xl">
                <div className="absolute bottom-0 right-0 p-10 opacity-20 transform translate-x-10 translate-y-10 group-hover:scale-110 transition-transform">
                    <AlertCircle size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-amber-500 p-4 rounded-2xl shadow-xl shadow-amber-500/20">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Why do I need an OIB?</h3>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-3xl font-light">
                            The <span className="text-amber-400 font-bold italic">Osobni identifikacijski broj</span> is required for <strong className="text-white">everything</strong> in Croatia. It is your permanent ID for all official registries including Land Registry (ownership), the Grimunt portal, Tax Administration, and Utility contracts.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
