'use client';

import { useState, useEffect } from 'react';
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '@/actions/submissions';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';

export default function AdminInboxManager() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'resolved'>('pending');

    const loadData = async () => {
        setLoading(true);
        const { data, error } = await getSubmissions(filter);
        if (data) setSubmissions(data);
        if (error) alert("Greška pri učitavanju pretinca: " + error);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const handleResolve = async (id: string) => {
        if (!confirm('Označi ovu prijavu kao riješenu?')) return;
        const note = prompt('Dodaj napomenu (opcionalno):') || '';

        const res = await updateSubmissionStatus(id, 'resolved', note);
        if (res.error) alert(res.error);
        else loadData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Jeste li sigurni da želite obrisati ovu prijavu?')) return;
        const res = await deleteSubmission(id);
        if (res.error) alert(res.error);
        else loadData();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-800">
                    <MessageSquare size={20} /> Pretinac (Prijave i Prijedlozi)
                </h2>
                <div className="flex gap-2 bg-zinc-100 p-1 rounded-md">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 ${filter === 'pending' ? 'bg-white shadow text-yellow-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <Clock size={14} /> Na Čekanju
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 ${filter === 'resolved' ? 'bg-white shadow text-green-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        <CheckCircle size={14} /> Riješeno
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-8 text-center text-zinc-500">Učitavanje...</div>
            ) : submissions.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 border-2 border-dashed border-zinc-200 rounded-lg">
                    Nema prijava u ovom statusu.
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="border border-zinc-200 rounded-lg p-4 pb-5 shadow-sm bg-zinc-50 relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {sub.type === 'dumping' ? (
                                        <div className="bg-orange-100 text-orange-700 p-2 rounded-full">
                                            <AlertTriangle size={16} />
                                        </div>
                                    ) : (
                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                                            <MessageSquare size={16} />
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm font-bold text-zinc-800 uppercase tracking-wide">
                                            {sub.type === 'dumping' ? 'Prijava Otpada' : 'Prijedlog'}
                                        </span>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(sub.created_at).toLocaleString('hr-HR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${sub.status === 'pending' ? 'bg-yellow-100/50 text-yellow-700 border-yellow-200' : 'bg-green-100/50 text-green-700 border-green-200'}`}>
                                        {sub.status === 'pending' ? 'Na čekanju' : 'Riješeno'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded border border-zinc-100 text-sm text-zinc-700 whitespace-pre-wrap mb-4">
                                {sub.content}
                            </div>

                            {sub.type === 'dumping' && sub.location && (
                                <div className="bg-red-50 text-red-800 text-xs px-3 py-2 rounded font-mono mb-4 border border-red-100">
                                    📍 Lokacija: {sub.location}
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs border-t border-zinc-200 pt-3 mt-2">
                                <div className="text-zinc-500 flex items-center gap-1">
                                    Prijavio/la: <span className="font-semibold text-zinc-700">{sub.user_name || sub.user_email || 'Anonimno'}</span>
                                </div>
                                <div className="flex gap-2">
                                    {sub.status === 'pending' && (
                                        <button
                                            onClick={() => handleResolve(sub.id)}
                                            className="px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-700 rounded transition font-medium"
                                        >
                                            Označi Riješeno
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="p-1.5 text-zinc-400 hover:text-red-500 bg-zinc-200 hover:bg-red-50 rounded transition"
                                        title="Obriši"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
