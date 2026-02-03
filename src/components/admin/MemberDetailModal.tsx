"use client";

import { useState, useEffect } from 'react';
import { MembershipRequest, Donation } from '@/lib/db';
import { X, Save, Plus, Trash2, Calendar, MapPin, Mail, Phone, FileText, Award, ShieldCheck, Star } from 'lucide-react';
import { saveAdminNotes, addAdminDonation, updateMemberTier } from '@/actions/admin';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

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

    // Tier state
    const [tier, setTier] = useState<'free' | 'silver' | 'gold'>('free');
    const [updatingTier, setUpdatingTier] = useState(false);

    useEffect(() => {
        const fetchTier = async () => {
            const { data: userData } = await supabase.auth.admin.listUsers();
            const user = userData?.users.find(u => u.email === request.email);
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('membership_tier')
                    .eq('id', user.id)
                    .single();
                if (profile?.membership_tier) {
                    setTier(profile.membership_tier);
                }
            }
        };
        fetchTier();
    }, [request.email]);

    const handleSaveNotes = async () => {
        setSavingNotes(true);
        const res = await saveAdminNotes(request.id, notes);
        if (res.success) {
            onUpdate({ ...request, admin_notes: notes });
        } else {
            alert(res.error);
        }
        setSavingNotes(false);
    };

    const handleAddDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingDonation(true);

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Unesite ispravan iznos');
            setAddingDonation(false);
            return;
        }

        const res = await addAdminDonation(request.id, numAmount, description);
        if (res.success && res.data) {
            const updatedDonations = [res.data, ...localDonations];
            setLocalDonations(updatedDonations);
            onUpdate({ ...request, donations: updatedDonations });
            setAmount('');
            setDescription('');
        } else {
            alert(res.error);
        }
        setAddingDonation(false);
    };

    const handleUpdateTier = async (newTier: 'free' | 'silver' | 'gold') => {
        setUpdatingTier(true);
        const res = await updateMemberTier(request.email, newTier);
        if (res.success) {
            setTier(newTier);
        } else {
            alert(res.error);
        }
        setUpdatingTier(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
                    <div>
                        <h2 className="text-2xl font-serif text-zinc-900">{request.name}</h2>
                        <p className="text-sm text-zinc-500">{request.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <X size={24} className="text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: INFO & TIER */}
                        <div className="space-y-6">
                            {/* Personal Info */}
                            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4">
                                <h3 className="font-bold text-zinc-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <FileText size={18} className="text-zinc-400" /> Osobni Podaci
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                                        <span className="text-zinc-500">Adresa:</span>
                                        <span className="text-zinc-900 font-medium">{request.address || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                                        <span className="text-zinc-500">Datum rođ.:</span>
                                        <span className="text-zinc-900 font-medium">{request.dob || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                                        <span className="text-zinc-500">OIB:</span>
                                        <span className="text-zinc-900 font-medium">{request.oib || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                                        <span className="text-zinc-500">Tel:</span>
                                        <span className="text-zinc-900 font-medium">{request.phone || '-'}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-zinc-500 text-xs block mb-1 uppercase tracking-tight">Razlog:</span>
                                        <p className="text-zinc-700 italic text-xs leading-relaxed">"{request.reason}"</p>
                                    </div>
                                </div>
                            </div>

                            {/* Membership Tier */}
                            <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 shadow-sm">
                                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Award size={18} className="text-sky-600" /> Članski Status (Tier)
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['free', 'silver', 'gold'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => handleUpdateTier(t)}
                                            disabled={updatingTier}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${tier === t
                                                    ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                                                    : 'bg-white border-sky-200 text-zinc-600 hover:border-sky-400'
                                                }`}
                                        >
                                            {t === 'free' && <ShieldCheck size={18} />}
                                            {t === 'silver' && <Star size={18} />}
                                            {t === 'gold' && <Award size={18} />}
                                            <span className="text-[10px] uppercase font-bold tracking-widest">{t}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-white/50 rounded-lg border border-sky-100/50">
                                    <p className="text-[10px] text-sky-800 leading-tight flex items-start gap-2">
                                        <CircleInfo size={12} className="mt-0.5 flex-shrink-0" />
                                        <span>Silver i Gold članovi imaju pravo glasa u Dvorani za Glasovanje te pristup ekskluzivnim izvještajima.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: NOTES & DONATIONS */}
                        <div className="space-y-6">
                            {/* Admin Notes */}
                            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 space-y-4">
                                <h3 className="font-bold text-zinc-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <FileText size={18} className="text-amber-600" /> Interne Bilješke
                                </h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full text-sm p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[100px] bg-white"
                                    placeholder="Upiši interne napomene o članu..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveNotes}
                                        disabled={savingNotes}
                                        className="text-xs bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-sm font-bold uppercase tracking-wider"
                                    >
                                        <Save size={14} /> {savingNotes ? 'Spremanje...' : 'Spremi Bilješke'}
                                    </button>
                                </div>
                            </div>

                            {/* Donations History */}
                            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-4">
                                <h3 className="font-bold text-zinc-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Plus size={18} className="text-emerald-600" /> Povijest Donacija
                                </h3>

                                {/* Add Donation Form */}
                                <form onSubmit={handleAddDonation} className="space-y-3 bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                                    <div className="grid grid-cols-[100px_1fr] gap-2">
                                        <input
                                            type="number"
                                            placeholder="€"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="px-3 py-2 text-sm border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Opis (npr. Članarina 2024)"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="px-3 py-2 text-sm border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={addingDonation}
                                        className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {addingDonation ? 'Dodavanje...' : 'Dodaj Donaciju'}
                                    </button>
                                </form>

                                {/* List */}
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                    {localDonations.length === 0 ? (
                                        <p className="text-xs text-zinc-400 text-center py-4">Nema evidentiranih donacija.</p>
                                    ) : (
                                        localDonations.map((d) => (
                                            <div key={d.id} className="bg-white p-3 rounded-lg border border-emerald-100 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-800">{d.amount} €</p>
                                                    <p className="text-[10px] text-zinc-500">{d.description || 'Bez opisa'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-zinc-400 font-mono">
                                                        {new Date(d.date).toLocaleDateString('hr-HR')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CircleInfo({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    )
}
