"use client";

import { useState } from 'react';
import { AlertTriangle, Camera, MapPin, Shield, Send, ExternalLink, Siren } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { translations } from '@/lib/translations';

export default function DumpingPage() {
    const { language } = useLanguage();
    const { user } = useAuth();
    const t = translations[language];

    // Form State
    const [wasteType, setWasteType] = useState('');
    const [location, setLocation] = useState('');
    const [reportMode, setReportMode] = useState<'direct' | 'udruga'>('udruga'); // Default to "Watchdog" mode

    const handleReport = () => {
        const subject = `Prijava nepropisno odbačenog otpada - Baljci`;

        let recipient = '';
        let body = '';
        let cc = '';

        if (reportMode === 'direct') {
            recipient = 'opcina-ruzic@si.t-com.hr';
            cc = 'procelnik@opcina-ruzic.hr';
            body = `Poštovani,\n\nPrijavljujem nelegalno odlagalište otpada na području naselja Baljci.\n\nLOKACIJA:\nKoordinate/Opis: ${location}\n\nOPIS OTPADA: ${wasteType}\n\nU privitku dostavljam fotografije zatečenog stanja.\n\nSukladno Zakonu o gospodarenju otpadom, molim Vas da izdate nalog za uklanjanje otpada te da me povratno obavijestite o poduzetim radnjama.\n\nS poštovanjem,\n${user?.email || '[Ime i Prezime]'}`;
        } else {
            // Watchdog Mode
            recipient = 'info@baljci.com'; // Placeholder for Udruga admin
            body = `[ZAHTJEV ZA ANONIMNU PRIJAVU]\n\nMolim Udrugu da u moje ime prijavi sljedeće odlagalište:\n\nLokacija: ${location}\nOtpad: ${wasteType}\n\nU privitku su slike.\n\nČlan: ${user?.email}`;
        }

        const mailtoLink = `mailto:${recipient}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-red-600">
                    <AlertTriangle size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                        {t.dumpTitle}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        {t.dumpHero}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Steps / Guide */}
                <div className="space-y-6">
                    <div className="relative pl-8 border-l-2 border-slate-200 space-y-8">
                        {/* Step 1 */}
                        <div className="relative">
                            <span className="absolute -left-[41px] bg-slate-100 border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600">1</span>
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Camera size={18} className="text-blue-500" /> {t.dumpStep1}</h3>
                            <p className="text-slate-600 text-sm mt-1">{t.dumpStep1Desc}</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <span className="absolute -left-[41px] bg-slate-100 border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600">2</span>
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Shield size={18} className="text-blue-500" /> {t.dumpStep2}</h3>
                            <p className="text-slate-600 text-sm mt-1">{t.dumpStep2Desc}</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <span className="absolute -left-[41px] bg-slate-100 border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600">3</span>
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Send size={18} className="text-blue-500" /> {t.dumpStep3}</h3>
                            <p className="text-slate-600 text-sm mt-1">{t.dumpStep3Desc}</p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                            <span className="absolute -left-[41px] bg-red-100 border-2 border-red-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-red-600">4</span>
                            <h3 className="font-bold text-lg text-red-800 flex items-center gap-2"><Siren size={18} className="text-red-500" /> {t.dumpStep4}</h3>
                            <p className="text-red-700 text-sm mt-1">{t.dumpStep4Desc}</p>
                            <a href="https://dirh.gov.hr/podnosenje-prijava/83" target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:underline mt-2">
                                <ExternalLink size={12} /> {t.elooLink}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Reporting Tool */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden h-fit sticky top-6">
                    <div className="bg-slate-900 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2"><AlertTriangle size={20} className="text-orange-400" /> Report Dumping</h2>
                        <p className="text-slate-400 text-sm mt-1">Generate an official complaint.</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Toggle Mode */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setReportMode('udruga')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition ${reportMode === 'udruga' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                🛡️ Watchdog (Udruga)
                            </button>
                            <button
                                onClick={() => setReportMode('direct')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition ${reportMode === 'direct' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                ⚡ Direct (Općina)
                            </button>
                        </div>

                        {reportMode === 'udruga' && (
                            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-md border border-blue-100">
                                {t.reportUdrugaDesc}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.dumpLabelType}</label>
                                <input
                                    type="text"
                                    value={wasteType}
                                    onChange={(e) => setWasteType(e.target.value)}
                                    placeholder="e.g. Tires, Construction debris..."
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.dumpLabelLoc}</label>
                                <textarea
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="GPS: 43.856, 16.201 (Near the old mill)"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none h-24"
                                />
                            </div>

                            <button
                                onClick={handleReport}
                                disabled={!wasteType || !location}
                                className={`w-full text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${reportMode === 'udruga' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                <Send size={18} /> {reportMode === 'udruga' ? t.dumpBtnUdruga : t.dumpBtnDirect}
                            </button>
                            <p className="text-xs text-center text-slate-400">Attach photos in the email app.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
