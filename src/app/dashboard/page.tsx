"use client";

import { MessageSquare, Calendar } from 'lucide-react';

const NEWS_ITEMS = [
    {
        id: 1,
        title: "Godišnja skupština Udruge",
        date: "28.01.2026.",
        author: "Predsjednik",
        content: "Pozivamo sve članove na redovnu godišnju skupštinu koja će se održati u društvenom domu. Dnevni red uključuje izvješće o radu i plan za tekuću godinu.",
        tags: ["Obavijest", "Sastanak"]
    },
    {
        id: 2,
        title: "Početak radova na sanaciji puta",
        date: "15.01.2026.",
        author: "Odbor za infrastrukturu",
        content: "Zahvaljujući donacijama članova, prikupljena su sredstva za početak sanacije pristupnog puta prema crkvi. Radovi počinju sljedeći tjedan.",
        tags: ["Projekt", "Infrastruktura"]
    },
    {
        id: 3,
        title: "Obnova suhozida - Poziv volonterima",
        date: "05.01.2026.",
        author: "Tajnik",
        content: "Organiziramo akciju obnove urušenih suhozida oko stare škole. Svi voljni pomoći su dobrodošli. Osiguran je alat i marenda.",
        tags: ["Akcija", "Baština"]
    }
];

export default function DashboardHome() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-amber-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-amber-900">Novosti</h1>
                    <p className="text-stone-600">Najnovije obavijesti i događanja u udruzi.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {NEWS_ITEMS.map((item) => (
                    <article key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                                    <span className="bg-amber-50 px-2 py-1 rounded-full border border-amber-100">{item.tags[0]}</span>
                                    <span className="flex items-center gap-1 text-stone-400">
                                        <Calendar size={12} /> {item.date}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-stone-800">{item.title}</h3>
                                <p className="text-stone-600 leading-relaxed">{item.content}</p>

                                <div className="flex items-center gap-2 pt-2 text-xs text-stone-500">
                                    <div className="w-5 h-5 bg-stone-200 rounded-full flex items-center justify-center font-serif text-stone-600">
                                        {item.author.charAt(0)}
                                    </div>
                                    <span>Objavio: {item.author}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
