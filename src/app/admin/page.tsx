"use client";

import { useEffect, useState } from 'react';
import { db, MembershipRequest } from '@/lib/store';
import { Check, X, Mail } from 'lucide-react';

export default function AdminMembersPage() {
    const [requests, setRequests] = useState<MembershipRequest[]>([]);

    useEffect(() => {
        // Load requests from DB
        setRequests(db.getRequests());
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                <h1 className="text-2xl font-bold text-zinc-800 mb-2">Zahtjevi za Članstvo</h1>
                <p className="text-zinc-500 text-sm">Pregled svih zahtjeva pristiglih putem web stranice.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                        Nema novih zahtjeva za članstvo.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 text-zinc-700 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Datum</th>
                                    <th className="px-6 py-4">Ime i Prezime</th>
                                    <th className="px-6 py-4">E-mail</th>
                                    <th className="px-6 py-4">Razlog</th>
                                    <th className="px-6 py-4 text-right">Akcija</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50">
                                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{req.date}</td>
                                        <td className="px-6 py-4 font-medium text-zinc-900">{req.name}</td>
                                        <td className="px-6 py-4 text-zinc-600 font-mono text-xs">{req.email}</td>
                                        <td className="px-6 py-4 text-zinc-600 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`mailto:${req.email}`}
                                                    className="p-1 text-zinc-400 hover:text-blue-600 transition-colors"
                                                    title="Pošalji E-mail"
                                                >
                                                    <Mail size={18} />
                                                </a>
                                                {/* In a real app we would have Approve/Reject buttons that update status */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
