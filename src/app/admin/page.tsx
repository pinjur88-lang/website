"use client";

import { useEffect, useState } from 'react';
import { db, MembershipRequest } from '@/lib/db';
import { Mail, Phone, MapPin, Calendar, FileText, Check, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminMembersPage() {
    const [requests, setRequests] = useState<MembershipRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadRequests = async () => {
            const data = await db.getRequests();
            setRequests(data);
            setLoading(false);
        };
        loadRequests();
    }, []);

    const handleApprove = async (req: MembershipRequest) => {
        if (!confirm(`Odobriti pristup za ${req.name}? Ovim će se poslati pozivnica na email.`)) return;

        // Optimistic update
        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));

        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: req.email,
                    requestId: req.id,
                    name: req.name
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error);
            }
            alert('Korisnik odobren i pozivnica poslana!');
        } catch (error: any) {
            alert('Greška: ' + error.message);
            // Revert optimistic update
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'pending' } : r));
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Učitavanje zahtjeva...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                <h1 className="text-2xl font-bold text-zinc-800 mb-2">Zahtjevi za Članstvo</h1>
                <p className="text-zinc-500 text-sm">Pregled svih zahtjeva pristiglih putem web stranice (GDPR Compliant).</p>
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
                                    <th className="px-6 py-4">Kandidat</th>
                                    <th className="px-6 py-4">Osobni Podaci</th>
                                    <th className="px-6 py-4">Kontakt & Metoda</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Akcija</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50 align-top">
                                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{req.date}</td>

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900">{req.name}</div>
                                            {req.oib && <div className="text-xs text-zinc-500">OIB: {req.oib}</div>}
                                            {req.accepted_statute && (
                                                <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                                                    <FileText size={10} /> Statut Prihvaćen
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-600 mb-1">
                                                <MapPin size={14} className="text-zinc-400" /> {req.address}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <Calendar size={14} className="text-zinc-400" /> {req.dob}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-900 font-medium mb-1">
                                                <Mail size={14} className="text-zinc-400" /> {req.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-600 mb-1">
                                                <Phone size={14} className="text-zinc-400" /> {req.phone}
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1">
                                                Preferira: <span className="font-semibold">{req.contact_method || 'Sve'}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full border ${req.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApprove(req)}
                                                        className="md:px-3 px-2 py-1.5 bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                                        title="Odobri Pristup"
                                                    >
                                                        <Check size={14} /> <span className="hidden md:inline">Odobri</span>
                                                    </button>
                                                )}
                                                {req.status === 'approved' && (
                                                    <span className="text-green-600 flex items-center gap-1 text-xs font-bold">
                                                        <Check size={16} /> Poslano
                                                    </span>
                                                )}
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
