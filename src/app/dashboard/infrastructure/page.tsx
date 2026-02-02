"use client";

import { useState } from 'react';
import { Lightbulb, Wrench, Phone, Mail, MapPin, Send, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { translations } from '@/lib/translations';

export default function InfrastructurePage() {
    const { language } = useLanguage();
    const { user } = useAuth();
    const t = translations[language];

    // Form State
    const [houseNumber, setHouseNumber] = useState('');
    const [surname, setSurname] = useState('');
    const [poleNumber, setPoleNumber] = useState('');
    const [description, setDescription] = useState('Žarulja ne radi / Lampa treperi');
    const [area, setArea] = useState('Gornji Baljci');

    const handleReport = () => {
        const subject = `Prijava kvara javne rasvjete - Baljci`;
        const body = `Poštovani,\n\nPrijavljujem kvar na javnoj rasvjeti u selu Baljci.\n\nLokacija: Ispred kućnog broja ${houseNumber} (Obitelj ${surname}).\nDio sela: ${area}\nBroj stupa (ako postoji): ${poleNumber || 'Nije vidljiv'}\n\nOpis kvara: ${description}.\n\nMolim vas da nalog proslijedite koncesionaru za održavanje.\n\nHvala,\n${user?.email || '[Ime i Prezime]'}`;

        const mailtoLink = `mailto:opcina-ruzic@si.t-com.hr?cc=procelnik@opcina-ruzic.hr&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(mailtoLink, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-amber-600">
                    <Lightbulb size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                        {t.infraTitle}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        {t.infraHero}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Easy Report Tool */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2"><Wrench size={20} className="text-amber-400" /> {t.reportTool}</h2>
                            <p className="text-slate-400 text-sm mt-1">{t.reportDesc}</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.labelHouse}</label>
                                <input
                                    type="text"
                                    value={houseNumber}
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                    placeholder="e.g. 14"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.labelSurname}</label>
                                <input
                                    type="text"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    placeholder="e.g. Genda"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.labelArea}</label>
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                            >
                                <option>Gornji Baljci</option>
                                <option>Donji Baljci</option>
                                <option>Centar / Kod Škole</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.labelPole}</label>
                            <input
                                type="text"
                                value={poleNumber}
                                onChange={(e) => setPoleNumber(e.target.value)}
                                placeholder="Metal tag number on pole"
                                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.labelDesc}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-amber-500 outline-none h-20"
                            />
                        </div>

                        <button
                            onClick={handleReport}
                            disabled={!houseNumber || !surname}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} /> {t.btnGenerate}
                        </button>
                        <p className="text-xs text-center text-slate-400">{t.btnNote}</p>
                    </div>
                </div>

                {/* Info & Guide */}
                <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4">{t.contactDirect}</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shrink-0">
                                    <span className="font-bold">A</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-900">{t.contactWarden}</p>
                                    <p className="text-slate-500 mb-1">{t.contactWardenDesc}</p>
                                    <p className="flex items-center gap-2 text-slate-700"><Phone size={14} /> 099 684 9059</p>
                                    <p className="flex items-center gap-2 text-slate-700"><Mail size={14} /> opcina-ruzic@si.t-com.hr</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                                    <span className="font-bold">B</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-900">{t.contactOffice}</p>
                                    <p className="text-slate-500 mb-1">If the warden doesn't answer.</p>
                                    <p className="flex items-center gap-2 text-slate-700"><Phone size={14} /> 022 872 811</p>
                                    <p className="flex items-center gap-2 text-slate-700"><Mail size={14} /> procelnik@opcina-ruzic.hr</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex gap-3 mb-2">
                            <AlertTriangle className="text-blue-600 shrink-0" size={20} />
                            <h3 className="font-bold text-blue-800">{t.processTitle}</h3>
                        </div>
                        <p className="text-sm text-blue-900 leading-relaxed">
                            {t.processSteps}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
