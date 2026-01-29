"use client";

import { CheckCircle2, CircleDashed } from 'lucide-react';

const PROJECTS = [
    {
        id: 1,
        title: "Sanacija pristupnog puta",
        description: "Popravak makadamskog puta od glavne ceste do crkve sv. Ivana. Uključuje nasipavanje i ravnanje.",
        status: "U Tijeku",
        raised: 4500,
        goal: 5000,
        donors: 24,
        deadline: "Veljača 2026."
    },
    {
        id: 2,
        title: "Obnova krovišta stare škole",
        description: "Kompletna zamjena crijepa i greda na zgradi stare škole koja će služiti kao društveni dom.",
        status: "Planiranje",
        raised: 1200,
        goal: 15000,
        donors: 8,
        deadline: "Lipanj 2026."
    },
    {
        id: 3,
        title: "Uređenje izvora 'Vrelo'",
        description: "Čišćenje okoliša i postavljanje klupa uz izvor pitke vode.",
        status: "Završeno",
        raised: 500,
        goal: 500,
        donors: 12,
        deadline: "Prosinac 2025."
    }
];

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-amber-200 pb-4">
                <h1 className="text-2xl font-bold text-amber-900">Projekti</h1>
                <p className="text-stone-600">Pregled aktivnih inicijativa i status prikupljanja sredstava.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((project) => {
                    const progress = Math.min((project.raised / project.goal) * 100, 100);
                    const isCompleted = project.status === "Završeno";

                    return (
                        <div key={project.id} className="bg-white rounded-lg shadow-sm border border-amber-100 flex flex-col overflow-hidden">
                            <div className={`h-2 ${isCompleted ? 'bg-green-500' : 'bg-amber-400'}`} />

                            <div className="p-6 flex-1 flex flex-col space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${isCompleted
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-stone-900">{project.title}</h3>
                                <p className="text-sm text-stone-600 flex-1">{project.description}</p>

                                <div className="pt-4 space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-stone-500">
                                        <span>Prikupljeno: {project.raised}€</span>
                                        <span>Cilj: {project.goal}€</span>
                                    </div>
                                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-stone-400 pt-1">
                                        <span>{project.donors} donatora</span>
                                        <span>Rok: {project.deadline}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-stone-50 px-6 py-3 border-t border-stone-100">
                                <button className="w-full text-center text-sm font-medium text-amber-700 hover:text-amber-900">
                                    Vidi Detalje & Doniraj &rarr;
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
