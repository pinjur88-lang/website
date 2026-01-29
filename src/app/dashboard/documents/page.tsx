"use client";

import { FileText, Download, Shield } from 'lucide-react';

const DOCUMENTS = [
    {
        id: 1,
        title: "Statut Udruge",
        type: "PDF",
        size: "2.4 MB",
        date: "12.03.2024.",
        category: "Pravni akti"
    },
    {
        id: 2,
        title: "Financijsko Izvješće 2025.",
        type: "PDF",
        size: "1.1 MB",
        date: "15.01.2026.",
        category: "Financije"
    },
    {
        id: 3,
        title: "Zapisnik sa Godišnje Skupštine 2025.",
        type: "PDF",
        size: "0.8 MB",
        date: "28.12.2025.",
        category: "Zapisnici"
    },
    {
        id: 4,
        title: "Plan Rada za 2026. godinu",
        type: "PDF",
        size: "1.5 MB",
        date: "05.01.2026.",
        category: "Planiranje"
    }
];

export default function DocumentsPage() {
    return (
        <div className="space-y-6">
            <div className="border-b border-amber-200 pb-4">
                <h1 className="text-2xl font-bold text-amber-900">Dokumenti</h1>
                <p className="text-stone-600">Arhiva službenih dokumenata, izvješća i zapisnika.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-amber-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-amber-50 text-amber-900 border-b border-amber-100 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Naziv Dokumenta</th>
                            <th className="px-6 py-4 hidden sm:table-cell">Kategorija</th>
                            <th className="px-6 py-4 hidden md:table-cell">Datum</th>
                            <th className="px-6 py-4 text-right">Preuzimanje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                        {DOCUMENTS.map((doc) => (
                            <tr key={doc.id} className="hover:bg-amber-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-stone-100 rounded text-stone-600 group-hover:bg-white group-hover:text-amber-600 transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">{doc.title}</p>
                                            <p className="text-xs text-stone-500 sm:hidden">{doc.size} • {doc.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell">
                                    <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-medium border border-stone-200">
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell text-sm text-stone-600">
                                    {doc.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center justify-end gap-2 ml-auto">
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Preuzmi</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bg-stone-50 p-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
                    <Shield size={12} />
                    <span>Dokumenti su povjerljivi i namijenjeni isključivo članovima udruge.</span>
                </div>
            </div>
        </div>
    );
}
