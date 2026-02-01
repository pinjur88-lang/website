"use client";

import { useState } from 'react';
import { MembershipRequest, Donation } from '@/lib/db';
import { X, Save, Plus, Trash2, Calendar, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MemberDetailModalProps {
    request: MembershipRequest;
    onClose: () => void;
    onUpdate: (updatedRequest: MembershipRequest) => void;
}

export default function MemberDetailModal({ request, onClose, onUpdate }: MemberDetailModalProps) {
    const [notes, setNotes] = useState(request.admin_notes || '');
    const [savingNotes, setSavingNotes] = useState(false);

    // Donation form state
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [addingDonation, setAddingDonation] = useState(false);
    const [localDonations, setLocalDonations] = useState<Donation[]>(request.donations || []);

    const getAuthHeader = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Niste prijavljeni");
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        };
    };

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        try {
            const headers = await getAuthHeader();
            const res = await fetch('/api/admin/notes', {
                method: 'POST',
                headers,
                body: JSON.stringify({ requestId: request.id, notes })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            // Update local state parent
            onUpdate({ ...request, admin_notes: notes });
        } catch (error: any) {
            alert('Error saving notes: ' + error.message);
        }
        setSavingNotes(false);
    };

    const handleAddDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingDonation(true);

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid amount');
            setAddingDonation(false);
            return;
        }

        try {
            const headers = await getAuthHeader();
            const res = await fetch('/api/admin/donations', {
                method: 'POST',
                headers,
                body: JSON.stringify({ requestId: request.id, amount: numAmount, description })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            const { data: newDonation } = await res.json();
            const updatedDonations = [newDonation, ...localDonations];
            setLocalDonations(updatedDonations);
            onUpdate({ ...request, donations: updatedDonations });
            setAmount('');
            setDescription('');

        } catch (error: any) {
            alert('Error adding donation: ' + error.message);
        }
        setAddingDonation(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">{request.name}</h2>
                        <div className="text-sm text-zinc-500 flex gap-2">
                            <span>{request.email}</span>
                            <span>•</span>
                            <span className={`uppercase font-bold ${request.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {request.status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Info & CRM */}
                    <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 space-y-3">
                            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                                <FileText size={16} /> Osobni Podaci
                            </h3>
                            <div className="text-sm grid grid-cols-[100px_1fr] gap-2">
                                <span className="text-zinc-500">Adresa:</span>
                                <span className="text-zinc-800">{request.address || '-'}</span>

                                <span className="text-zinc-500">Datum rođ.:</span>
                                <span className="text-zinc-800">{request.dob || '-'}</span>

                                <span className="text-zinc-500">OIB:</span>
                                <span className="text-zinc-800">{request.oib || '-'}</span>

                                <span className="text-zinc-500">Tel:</span>
                                <span className="text-zinc-800">{request.phone || '-'}</span>

                                <span className="text-zinc-500">Kontakt:</span>
                                <span className="text-zinc-800">{request.contact_method || '-'}</span>

                                <span className="text-zinc-500">Statut:</span>
                                <span className="text-zinc-800">{request.accepted_statute ? 'Prihvaćen' : 'Nije prihvaćen'}</span>
                            </div>

                            <div className="pt-2 border-t border-zinc-200 mt-2">
                                <span className="text-zinc-500 text-xs block mb-1">Razlog pristupanja:</span>
                                <p className="text-zinc-800 text-sm italic">"{request.reason}"</p>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
                            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                                <FileText size={16} /> Interne Bilješke (Admin Samo)
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full text-sm p-3 border border-zinc-200 rounded-md focus:ring-2 focus:ring-zinc-900 focus:outline-none min-h-[120px]"
                                placeholder="Upiši interne napomene o članu..."
                            />
                            <div className="mt-2 flex justify-end">
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={savingNotes}
                                    className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-700 transition-colors flex items-center gap-1"
                                >
                                    <Save size={12} /> {savingNotes ? 'Spremanje...' : 'Spremi Bilješke'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Donations */}
                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col h-full">
                            <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between items-center">
                                <h3 className="font-semibold text-zinc-900">Donacije / Članarine</h3>
                                <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                                    Ukupno: {localDonations.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)} €
                                </div>
                            </div>

                            {/* Donation List */}
                            <div className="flex-1 overflow-y-auto max-h-[300px] p-0">
                                {localDonations.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-400 text-sm">
                                        Nema zabilježenih donacija.
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-zinc-50 text-xs text-zinc-500 border-b border-zinc-100 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 font-medium">Datum</th>
                                                <th className="px-4 py-2 font-medium">Opis</th>
                                                <th className="px-4 py-2 font-medium text-right">Iznos</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50">
                                            {localDonations.map((d) => (
                                                <tr key={d.id} className="hover:bg-zinc-50">
                                                    <td className="px-4 py-2 text-zinc-500 whitespace-nowrap">
                                                        {new Date(d.date).toLocaleDateString('hr-HR')}
                                                    </td>
                                                    <td className="px-4 py-2 text-zinc-800">{d.description}</td>
                                                    <td className="px-4 py-2 text-right font-medium text-zinc-900">
                                                        {d.amount.toFixed(2)} €
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Add Donation Form */}
                            <div className="p-4 bg-zinc-50 border-t border-zinc-200">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Dodaj Novu Uplatu</h4>
                                <form onSubmit={handleAddDonation} className="space-y-3">
                                    <div className="grid grid-cols-[1fr_120px] gap-3">
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Opis (npr. Članarina 2024)"
                                            className="text-sm px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-500"
                                            required
                                        />
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full text-sm pl-3 pr-8 py-2 border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-500 text-right"
                                                required
                                            />
                                            <span className="absolute right-3 top-2 text-zinc-400 text-sm">€</span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={addingDonation}
                                        className="w-full bg-zinc-900 text-white text-sm font-medium py-2 rounded-md hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Zabilježi Uplatu
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
