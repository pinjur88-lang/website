"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getTopics, Topic, createTopic } from '@/actions/forum';
import { MessageSquare, User, Send, Shield, Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Helper to count comments (Client side fetch for now to avoid complex SQL joins in simplified setup)
const CommentCounter = ({ postId }: { postId: string }) => {
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        const fetchCount = async () => {
            const { count } = await supabase
                .from('community_comments')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId);
            setCount(count || 0);
        };
        fetchCount();
    }, [postId]);

    if (count === null) return <span className="text-xs text-stone-300">...</span>;
    return <span className="text-xs text-stone-500 font-medium">{count} odgovora</span>;
};

export default function CommunityPage() {
    const { user } = useAuth();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    // New Topic Form
    const [isCreating, setIsCreating] = useState(false);
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadTopics = async () => {
        setLoading(true);
        const { data } = await getTopics();
        if (data) setTopics(data);
        setLoading(false);
    };

    useEffect(() => {
        loadTopics();
    }, []);

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        if (!user.id) {
            alert("Greška: Nije moguće identificirati korisnika. Molimo osvježite stranicu ili se ponovno prijavite.");
            return;
        }

        setSubmitting(true);
        // Use the new server action "createTopic"
        const { error } = await createTopic(content, user.id, isAnonymous);

        if (error) {
            alert('Greška: ' + error);
        } else {
            setContent('');
            setIsAnonymous(false);
            setIsCreating(false);
            loadTopics();
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sky-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="text-sky-600" />
                        Forum (Teme)
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Diskusije, pitanja i razgovori o selu.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-sky-600 text-white px-4 py-2 rounded-md font-medium hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <PlusCircle size={18} />
                    {isCreating ? 'Zatvori' : 'Nova Tema'}
                </button>
            </div>

            {/* Create Topic Form */}
            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-sky-100 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-slate-800 mb-4">Pokreni novu raspravu</h3>
                    <form onSubmit={handleCreateTopic} className="space-y-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="O čemu želite razgovarati? (Naslov i tekst teme)"
                            className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[120px] resize-none"
                            required
                        />

                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                />
                                <span className="flex items-center gap-1">
                                    {isAnonymous ? <Shield size={14} className="text-slate-400" /> : <User size={14} className="text-slate-400" />}
                                    {isAnonymous ? 'Anonimno' : user?.name}
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={submitting || !content.trim()}
                                className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? 'Objavljivanje...' : 'Objavi Temu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Topics List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Učitavanje tema...</p>
                    </div>
                ) : topics.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                        <MessageSquare className="mx-auto text-slate-200 mb-3" size={48} />
                        <p className="text-slate-500 font-medium">Nema aktivnih tema.</p>
                        <p className="text-slate-400 text-sm mt-1">Budite prvi koji će pokrenuti razgovor!</p>
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            href={`/dashboard/community/${topic.id}`}
                            key={topic.id}
                            className="block bg-white p-6 rounded-xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all group"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-700 transition-colors mb-2 line-clamp-2">
                                        {topic.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                        {topic.content}
                                    </p>

                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                                            <User size={12} />
                                            <span className="font-medium text-slate-600">{topic.author_name}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(topic.created_at).toLocaleDateString('hr-HR')}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 text-right min-w-[80px]">
                                    <CommentCounter postId={topic.id} />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
