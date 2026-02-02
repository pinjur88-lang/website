"use client";

import { useState } from 'react';
import { Trash2, Phone, Mail, MapPin, Download, ExternalLink, FileText, CheckCircle, AlertCircle, Calendar, Truck, Droplets } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { translations } from '@/lib/translations';

export default function UtilitiesPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const [activeTab, setActiveTab] = useState<'garbage' | 'septic' | 'water'>('garbage');

    const providerInfo = {
        name: t.providerName,
        dept: "Komunalni odjel",
        email: "komunalni.odjel@gradskacistoca-drnis.hr",
        phone: "+385 (0)99 306-2510",
        address: "Ulica Stjepana Radića 2, 22320 Drniš",
        website: "https://gradskacistoca-drnis.hr/obrasci-i-zahtjevi/"
    };

    const handleCopyEmail = () => {
        const emailBody = `Poštovani,\n\nJavljam se kao novi korisnik u naselju Baljci.\nMolim vas informaciju o proceduri za dodjelu spremnika za otpad.\n\nHvala unaprijed.`;
        navigator.clipboard.writeText(emailBody);
        alert("Email tekst kopiran!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className={`bg-gradient-to-br ${activeTab === 'garbage' ? 'from-green-50 to-emerald-50 border-green-100 text-emerald-600' : activeTab === 'septic' ? 'from-blue-50 to-indigo-50 border-blue-100 text-indigo-600' : 'from-cyan-50 to-sky-50 border-cyan-100 text-cyan-600'} border rounded-2xl p-8 shadow-sm relative overflow-hidden transition-all duration-300`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    {activeTab === 'garbage' ? <Trash2 size={120} /> : activeTab === 'septic' ? <Droplets size={120} /> : <Truck size={120} />}
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                        {activeTab === 'garbage' ? t.utilTitle : activeTab === 'septic' ? t.septicTitle : t.waterTitle}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        {activeTab === 'garbage' ? t.utilHero : activeTab === 'septic' ? t.septicHero : t.waterHero}
                    </p>
                </div>
            </div>

            {/* Tab Selection */}
            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                    onClick={() => setActiveTab('garbage')}
                    className={`flex-1 py-3 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition ${activeTab === 'garbage' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Trash2 size={16} /> {t.garbageTab}
                </button>
                <button
                    onClick={() => setActiveTab('septic')}
                    className={`flex-1 py-3 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition ${activeTab === 'septic' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Droplets size={16} /> {t.septicTab}
                </button>
                <button
                    onClick={() => setActiveTab('water')}
                    className={`flex-1 py-3 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition ${activeTab === 'water' ? 'bg-white shadow-sm text-cyan-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Truck size={16} /> {t.waterTab}
                </button>
            </div>

            {activeTab === 'garbage' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Flow */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Provider */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                {t.stepProvider}
                            </h2>
                            <div className="bg-white border border-slate-200 rounded-xl p-6 ml-3 md:ml-12 shadow-sm">
                                <h3 className="font-bold text-lg text-green-700 mb-4">{providerInfo.name}</h3>
                                <div className="space-y-3 text-slate-700">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-slate-400" />
                                        <span>{providerInfo.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-slate-400" />
                                        <span>{providerInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-slate-400" />
                                        <a href={`mailto:${providerInfo.email}`} className="text-blue-600 hover:underline break-all">{providerInfo.email}</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Step 2 & 3: Forms & Documents */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                {t.stepForms}
                            </h2>
                            <div className="ml-3 md:ml-12 space-y-6">
                                <p className="text-slate-600 text-sm">{t.stepFormsDesc}</p>

                                <div className="flex flex-wrap gap-3">
                                    <a href={providerInfo.website} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg border border-slate-300 transition font-bold text-sm">
                                        <Download size={16} /> {t.downloadForms}
                                    </a>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                    <h4 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wide">{t.reqAttachments}</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-sm text-amber-900">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0" /> {t.attID}
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-amber-900">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0" /> {t.attOIB}
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-amber-900">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0" /> {t.attProof}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Step 4: Email Template */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                {t.emailTemplate}
                            </h2>
                            <div className="ml-3 md:ml-12">
                                <p className="text-slate-500 text-sm mb-3">{t.emailDesc}</p>
                                <div className="relative">
                                    <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-sm leading-relaxed">
                                        Poštovani,<br /><br />
                                        Javljam se kao novi korisnik u naselju Baljci.<br />
                                        Molim vas informaciju o proceduri za dodjelu spremnika za otpad.<br />
                                        U privitku dostavljam potrebnu dokumentaciju.<br /><br />
                                        Hvala unaprijed.
                                    </div>
                                    <button
                                        onClick={handleCopyEmail}
                                        className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white uppercase font-bold tracking-wider"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Schedule & Info */}
                    <div className="space-y-6">
                        {/* Pickup Schedule */}
                        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                            <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                                <Calendar size={18} /> {t.scheduleTitle}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-yellow-200 pb-2">
                                    <span className="text-yellow-900 font-bold">{t.binGen}</span>
                                    <span className="text-yellow-900">Petak / Friday</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-yellow-200 pb-2">
                                    <span className="text-blue-900 font-bold">{t.binRec}</span>
                                    <span className="text-blue-900">Alt. Petak / Fri</span>
                                </div>
                            </div>
                            <p className="text-xs text-yellow-700 mt-4 italic">
                                {t.scheduleNote}
                            </p>
                        </div>

                        {/* The Bins */}
                        <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
                            <Truck className="mx-auto mb-4 text-emerald-400" size={48} />
                            <h3 className="font-bold text-lg mb-2">{t.binsTitle}</h3>
                            <p className="text-slate-300 text-sm">
                                {t.binsDesc}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // SEPTIC TANK CONTENT
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-800 mb-4">{t.septicWho}</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                                    <Phone size={24} className="text-blue-600" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Call Center</p>
                                        <p className="font-bold text-lg text-slate-900">{t.septicPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-800 text-xl">{t.septicProtoTitle}</h3>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">1</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{t.septicStep1}</h4>
                                    <p className="text-slate-600 text-sm">{t.septicStep1Desc}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">2</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{t.septicStep2}</h4>
                                    <p className="text-slate-600 text-sm">{t.septicStep2Desc}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">3</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{t.septicStep3}</h4>
                                    <p className="text-slate-600 text-sm">{t.septicStep3Desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <AlertCircle className="text-slate-400 mb-4" size={32} />
                        <h4 className="font-bold text-slate-900 mb-2">Important Note</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Septic pumping services are in high demand during July and August. Please plan accordingly.
                            The trucks are large and require clear access roads.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
