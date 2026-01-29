"use client";

import { useState } from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

const MOCK_REQUESTS = [
    { id: 1, name: "Ana Marić", email: "ana.m@example.com", reason: "Živim u Baljcima i želim pomoći u obnovi.", date: "29.01.2026." },
    { id: 2, name: "Marko Kovač", email: "marko.k@example.com", reason: "Otac mi je iz Baljaka, dolazim ljeti.", date: "28.01.2026." },
    { id: 3, name: "Petar Perić", email: "petar@unknown.com", reason: "Znatiželja.", date: "27.01.2026." },
];

export default function AdminDashboard() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    const handleApprove = (id: number) => {
        // In real app: call API to approve
        setRequests(requests.filter(r => r.id !== id));
    };

    const handleDeny = (id: number) => {
        // In real app: call API to deny
        setRequests(requests.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                <h1 className="text-2xl font-bold text-zinc-800 mb-2">Zahtjevi za Članstvom</h1>
                <p className="text-zinc-500 text-sm">Pregled i odobravanje novih zahtjeva za pristup platformi.</p>
            </div>

            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded border border-zinc-200 text-zinc-400">
                        Nema novih zahtjeva na čekanju.
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg text-zinc-900">{req.name}</span>
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">Na čekanju</span>
                                </div>
                                <p className="text-sm text-zinc-500 mb-2 font-mono">{req.email} • {req.date}</p>
                                <div className="bg-zinc-50 p-3 rounded text-sm text-zinc-700 italic border border-zinc-100">
                                    "{req.reason}"
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => handleDeny(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                                >
                                    <X size={16} /> Odbij
                                </button>
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    <Check size={16} /> Odobri
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800 flex items-start gap-3">
                <ShieldAlert size={20} className="shrink-0" />
                <div>
                    <strong>Sigurnosna Napomena:</strong> Odobravanjem zahtjeva korisnik dobiva pristup svim internim dokumentima i galeriji. Provjerite identitet prije odobrenja.
                </div>
            </div>
        </div>
    );
}
