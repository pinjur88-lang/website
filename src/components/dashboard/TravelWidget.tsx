'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

type Visit = {
    id: string;
    userId: string;
    userName: string;
    startDate: string;
    endDate: string;
};

export default function TravelWidget() {
    const { user } = useAuth();
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadVisits = async () => {
        const { data, error } = await supabase
            .from('visits')
            .select(`
                id,
                start_date,
                end_date,
                user_id,
                user:profiles(display_name)
            `)
            .gte('end_date', new Date().toISOString().split('T')[0])
            .order('start_date', { ascending: true });

        if (error) {
            console.error('Error loading visits:', error);
            // Alert only on severe errors, or maybe just log?
            // If the relationship is missing, this will trigger.
            // alert('Greška pri učitavanju: ' + error.message); 
        } else if (data) {
            const mappedVisits = data.map((visit: any) => ({
                id: visit.id,
                userId: visit.user_id,
                userName: visit.user?.display_name || 'Nepoznato',
                startDate: visit.start_date,
                endDate: visit.end_date
            }));
            setVisits(mappedVisits);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadVisits();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !user) return;

        setSubmitting(true);

        const { error } = await supabase
            .from('visits')
            .insert({
                user_id: user.id,
                start_date: startDate,
                end_date: endDate
            });

        if (error) {
            alert('Greška: ' + error.message);
        } else {
            setStartDate('');
            setEndDate('');
            setIsAdding(false);
            loadVisits();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Obriši najavu dolaska?') || !user) return;

        const { error } = await supabase
            .from('visits')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            alert('Greška: ' + error.message);
        } else {
            loadVisits();
        }
    };

    // Date formatting helper
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric' });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-sky-100 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <MapPin className="text-sky-500" size={20} />
                Tko dolazi u Baljke?
            </h3>
            <p className="text-sm text-slate-500 mb-4">
                Najavi svoj dolazak i vidi tko će još biti u selu!
            </p>

            {/* List */}
            <div className="space-y-3 mb-4">
                {loading ? (
                    <div className="text-center text-xs text-slate-400">Učitavanje...</div>
                ) : visits.length === 0 ? (
                    <div className="text-center italic text-xs text-slate-400 py-2">
                        Nitko još nije najavio dolazak. Budi prvi!
                    </div>
                ) : (
                    visits.map(visit => (
                        <div key={visit.id} className="flex items-center justify-between text-sm bg-sky-50 p-2 rounded-md border border-sky-100">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">{visit.userName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600 text-xs bg-white px-2 py-1 rounded border border-sky-100">
                                    {formatDate(visit.startDate)} - {formatDate(visit.endDate)}
                                </span>
                                {user && user.id === visit.userId && (
                                    <button
                                        onClick={() => handleDelete(visit.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Button / Form */}
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-2 bg-slate-800 text-white text-sm font-bold rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Dolazim i ja!
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="bg-slate-50 p-3 rounded-md border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2 mb-3">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Dolazak</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full text-sm p-1 border border-slate-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Odlazak</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full text-sm p-1 border border-slate-300 rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="flex-1 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                            Odustani
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {submitting ? '...' : 'Spremi'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
