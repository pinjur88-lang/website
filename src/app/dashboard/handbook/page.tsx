"use client";
import { translations } from '@/lib/translations';
import { useLanguage } from '@/lib/language-context';
import { Truck, ShoppingCart, Shield, Hammer, Pill, Banknote, AlertTriangle, MapPin, Phone, Info } from 'lucide-react';

export default function HandbookPage() {
    const { language } = useLanguage();
    const t = translations[language];

    const shortcuts = [
        {
            id: 'bread',
            icon: Truck,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            title: t.breadTitle,
            hero: t.breadHero,
            content: (
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-amber-600 font-bold shrink-0">1</div>
                        <p className="text-slate-700 text-sm"><span className="font-bold">{t.breadSchedule}</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-amber-600 font-bold shrink-0">2</div>
                        <p className="text-slate-700 text-sm">{t.breadAction}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg text-amber-800 text-sm flex items-center gap-2">
                        <Info size={16} /> {t.breadTip}
                    </div>
                </div>
            )
        },
        {
            id: 'sunday',
            icon: ShoppingCart,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            title: t.sundayTitle,
            hero: t.sundayHero,
            content: (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                        <h4 className="font-bold text-red-700 mb-1 flex items-center gap-2">
                            <AlertTriangle size={16} /> {t.sundayLoophole}
                        </h4>
                        <p className="text-slate-700 text-sm">{t.sundayWhere}</p>
                    </div>
                    <a
                        href="https://www.google.com/search?q=drnis+supermarket+radno+vrijeme"
                        target="_blank"
                        className="block w-full text-center py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition"
                    >
                        Check Working Hours (Google)
                    </a>
                </div>
            )
        },
        {
            id: 'police',
            icon: Shield,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            title: t.policeTitle,
            hero: t.policeHero,
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{t.policeMethod1}</h4>
                        <p className="text-slate-600 text-sm">{t.policeMethod1Desc}</p>
                        <div className="flex items-center gap-2 text-blue-600 text-xs font-mono bg-white p-2 rounded border border-blue-100">
                            <MapPin size={12} /> {t.policeAddress}
                        </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">{t.policeMethod2}</h4>
                        <p className="text-slate-600 text-sm">{t.policeMethod2Desc}</p>
                    </div>
                </div>
            )
        },
        {
            id: 'hardware',
            icon: Hammer,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            title: t.hardTitle,
            hero: t.hardHero,
            content: (
                <div className="space-y-4">
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            {t.hardSmall}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                            {t.hardBig}
                        </li>
                    </ul>
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-900 text-sm font-medium">
                        <span className="font-bold">Pro Tip:</span> {t.hardTip}
                    </div>
                </div>
            )
        },
        {
            id: 'pharmacy',
            icon: Pill,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            title: t.pharmaTitle,
            hero: t.pharmaHero,
            content: (
                <div className="space-y-4">
                    <p className="text-sm text-slate-700">{t.pharmaAction}</p>
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 flex items-center gap-3">
                        <Phone size={20} className="text-emerald-500" />
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Ambulance Info</p>
                            <p className="text-emerald-700 font-bold">{t.pharmaCall}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">{t.pharmaTip}</p>
                </div>
            )
        },

        {
            id: 'lamb',
            icon: Truck, // Use a filler for now, maybe Utensils if available
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            title: t.lambTitle,
            hero: t.lambHero,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <AlertTriangle size={16} className="text-red-500" /> {t.lambRule}
                    </div>
                    <p className="text-sm text-slate-600 bg-white p-2 rounded border">{t.lambMath}</p>
                    <div className="text-sm text-slate-600">
                        <span className="font-bold">Locals use:</span> {t.lambWhere}
                    </div>
                    <div className="bg-amber-100 p-2 rounded text-xs font-bold text-amber-900">
                        PRO: {t.lambPro}
                    </div>
                </div>
            )
        },
        {
            id: 'bosnia',
            icon: MapPin,
            color: 'text-indigo-700',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            title: t.bosniaTitle,
            hero: t.bosniaHero,
            content: (
                <div className="space-y-4">
                    <p className="text-xs font-bold uppercase text-slate-400">Traffic Light</p>
                    <div className="bg-red-100 border border-red-200 p-3 rounded-lg text-red-900 text-sm mb-2">
                        <span className="font-bold flex items-center gap-2"><AlertTriangle size={14} /> NO:</span> {t.bosniaWarn}
                    </div>
                    <div className="bg-green-100 border border-green-200 p-3 rounded-lg text-green-900 text-sm">
                        <span className="font-bold">YES:</span> {t.bosniaOk}
                    </div>
                </div>
            )
        },
        {
            id: 'harvest',
            icon: ShoppingCart,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            title: t.harvestShortTitle,
            hero: t.harvestShortHero,
            content: (
                <div className="space-y-4">
                    <p className="font-serif italic text-lg text-emerald-800">{t.harvestList}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Info size={14} /> {t.harvestWhy}
                    </div>
                    <p className="text-sm font-bold text-slate-700">{t.harvestEtiquette}</p>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                    {t.handbookTitle}
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                    {t.handbookHero}
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortcuts.map((item) => (
                    <div key={item.id} className={`bg-white border ${item.border} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col`}>
                        <div className={`p-6 ${item.bg} border-b ${item.border}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 bg-white rounded-lg ${item.color} shadow-sm`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className={`text-lg font-bold ${item.color} leading-tight`}>{item.title}</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">
                                {item.hero}
                            </p>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-end">
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
