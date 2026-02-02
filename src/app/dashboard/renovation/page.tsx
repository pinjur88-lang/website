"use client";

import { useState } from 'react';
import { Search, FileText, Router as Gavel, CheckSquare, Printer, Download, ChevronDown, ChevronUp, MapPin, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

import { translations } from '@/lib/translations';

export default function RenovationGuidePage() {
    const { language } = useLanguage();
    const t = translations[language];
    const [openStep, setOpenStep] = useState<number>(1);
    const [showPunomoc, setShowPunomoc] = useState(false);

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? 0 : step);
    };

    const steps = [
        {
            id: 1,
            title: t.step1Title,
            icon: Search,
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        {t.step1Content}
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                        <p className="font-bold text-amber-800 text-sm">Tip:</p>
                        <p className="text-amber-700 text-sm">{t.step1Tip}</p>
                    </div>
                    <a
                        href="https://oss.uredjenazemlja.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        <Search size={16} /> {t.stepLink}
                    </a>
                </div>
            )
        },
        {
            id: 2,
            title: t.step2Title,
            icon: FileText,
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600">
                        {t.step2Content}
                    </p>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <CheckSquare size={16} className="text-green-600" /> {t.stepChecklist}
                        </h4>
                        <ul className="space-y-2">
                            {[t.docDeath, t.docBirth, t.docMarriage].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                            <MapPin size={16} className="text-slate-500" /> {t.locationRegistry}
                        </h4>
                        <p className="text-slate-600 text-sm pl-6">Address: Trg kralja Tomislava 1, Drniš.</p>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: t.step3Title,
            icon: Gavel,
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600">
                        {t.step3Content}
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                            <MapPin size={16} className="text-slate-500" /> {t.locationCourt}
                        </h4>
                        <p className="text-slate-600 text-sm pl-6">Address: Stalna služba u Drnišu.</p>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: t.step4Title,
            icon: CheckSquare, // Using CheckSquare as visual placeholder for list
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600">
                        {t.step4Content}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Drniš Lawyer */}
                        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
                            <h4 className="font-bold text-slate-800">Maja Ćurić</h4>
                            <p className="text-xs text-amber-600 font-bold uppercase tracking-wide mb-2">{t.lawyerDrnis}</p>
                            <div className="space-y-1 text-sm text-slate-600">
                                <p>📍 Bana Nehorića 24, Drniš</p>
                                <p>📞 022 642 518</p>
                            </div>
                        </div>

                        {/* Knin Lawyer (Often used for Drniš) */}
                        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
                            <h4 className="font-bold text-slate-800">Robert Grgić</h4>
                            <p className="text-xs text-sky-600 font-bold uppercase tracking-wide mb-2">{t.lawyerKnin}</p>
                            <div className="space-y-1 text-sm text-slate-600">
                                <p>📍 Kralja Tomislava 14, Knin</p>
                                <p>📞 022 663 997</p>
                            </div>
                        </div>

                        {/* Knin Lawyer 2 */}
                        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
                            <h4 className="font-bold text-slate-800">Ivan Močić</h4>
                            <p className="text-xs text-sky-600 font-bold uppercase tracking-wide mb-2">{t.lawyerKnin}</p>
                            <div className="space-y-1 text-sm text-slate-600">
                                <p>📍 4. Gbr 2, Knin</p>
                                <p>📞 022 660 635</p>
                                <p className="text-xs text-slate-400 mt-1">*Known for property disputes</p>
                            </div>
                        </div>

                        {/* Notary Public */}
                        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
                            <h4 className="font-bold text-slate-800">Javni Bilježnik</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-2">{t.notary}</p>
                            <div className="space-y-1 text-sm text-slate-600">
                                <p>📍 Trg kralja Tomislava 2, Drniš</p>
                                <p className="text-xs text-slate-400 mt-1">For verifying documents locally.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex gap-3 items-start">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-red-700 leading-relaxed">
                            <strong>Disclaimer:</strong> Udruga Građana Baljci provides this list for information purposes only. We do not endorse these lawyers and are not responsible for their services.
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const PunomoTemplate = () => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-lg font-bold text-slate-900">{t.punomocTitle}</h3>
                    <button onClick={() => setShowPunomoc(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="p-8 font-serif text-sm leading-relaxed space-y-6 bg-slate-50">
                    <div className="text-center font-bold text-xl mb-8 uppercase">Punomoć / Power of Attorney</div>

                    <p>
                        Ja, ___________________________________ (Ime i prezime / Full Name),<br />
                        rođen/a ___________________ (Datum rođenja / DOB),<br />
                        s prebivalištem na adresi __________________________________________________ (Adresa / Address),
                    </p>

                    <p>
                        <strong>OVLAŠĆUJEM / HEREBY AUTHORIZE</strong>
                    </p>

                    <p>
                        ___________________________________ (Ime punomoćnika / Attorney Name),<br />
                        OIB: ___________________,<br />
                        da me zastupa pred svim nadležnim tijelima, sudovima i upravnim organima u Republici Hrvatskoj radi ishodovanja dokumenata i reguliranja imovinsko-pravnih odnosa za nekretnine u K.O. Baljci.
                    </p>

                    <p className="italic text-slate-500 mt-4 border-t border-slate-200 pt-4">
                        (To represent me before all competent authorities, courts, and administrative bodies in the Republic of Croatia for the purpose of obtaining documents and regulating property relations for real estate in C.M. Baljci.)
                    </p>

                    <div className="mt-12 flex justify-end gap-12">
                        <div className="border-t border-slate-900 pt-2 w-48 text-center">Potpis / Signature</div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white sticky bottom-0">
                    <button onClick={() => setShowPunomoc(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md">Close</button>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 text-white rounded-md flex items-center gap-2 hover:bg-slate-800">
                        <Printer size={16} /> Print
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t.renovationTitle}</h1>
                    <p className="text-slate-500 mt-1">{t.renovationDesc}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 text-sm font-bold">
                        <Printer size={16} /> {t.printGuide}
                    </button>
                    <button
                        onClick={() => setShowPunomoc(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm font-bold shadow-sm"
                    >
                        <Download size={16} /> {t.downloadPunomoc}
                    </button>
                </div>
            </div>

            {/* Vertical Stepper */}
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const isOpen = openStep === step.id;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-slate-300 bg-white ring-1 ring-slate-200 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                            <button
                                onClick={() => toggleStep(step.id)}
                                className="w-full flex items-center gap-4 p-5 text-left"
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {isOpen ? <Icon size={20} /> : <span className="font-bold text-sm">{step.id}</span>}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg ${isOpen ? 'text-blue-900' : 'text-slate-700'}`}>
                                        {step.title}
                                    </h3>
                                </div>
                                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-6 pl-[4.5rem] animate-in slide-in-from-top-2 duration-200">
                                    {step.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showPunomoc && <PunomoTemplate />}
        </div>
    );
}
