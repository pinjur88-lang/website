'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTopicDetail, Topic, Comment } from '@/actions/forum';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, MessageSquare, Send, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const topicId = params?.topicId as string;

    const [topic, setTopic] = useState<Topic | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        if (!topicId) return;
        const { topic, comments, error } = await getTopicDetail(topicId);
        if (error) {
            console.error(error);
            alert('Greška: ' + error);
        } else {
            setTopic(topic || null);
            setComments(comments || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [topicId]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !user || !topicId) return;

        setSubmitting(true);
        // Using Client-side Supabase to bypass Auth complexity
        const { error } = await supabase
            .from('community_comments')
            .insert({
                post_id: topicId,
                user_id: user.id,
                author_id: user.id,
                content: replyContent
            });

        if (error) {
            alert('Greška: ' + error.message);
        } else {
            setReplyContent('');
            loadData(); // Reload comments
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Učitavanje...</div>;
    if (!topic) return <div className="p-8 text-center text-red-500">Tema nije pronađena.</div>;

    const handleDeleteTopic = async () => {
        if (!confirm('Jeste li sigurni da želite obrisati ovu temu i sve komentare?')) return;

        // Import dynamically to avoid client-side clutter, though Next.js handles server actions imports fine usually
        const { deleteTopic } = await import('@/actions/admin');
        const res = await deleteTopic(topicId);
        if (res.error) {
            alert('Greška pri brisanju: ' + res.error);
        } else {
            router.push('/dashboard/community');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Obrisati ovaj komentar?')) return;
        const { deleteComment } = await import('@/actions/admin'); // Using existing server action
        const res = await deleteComment(commentId);
        if (res.error) {
            alert('Greška: ' + res.error);
        } else {
            loadData();
        }
    };

    const [editingTopic, setEditingTopic] = useState(false);
    const [editTopicContent, setEditTopicContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState('');

    const handleUpdateTopic = async () => {
        if (!editTopicContent.trim()) return;
        const { updateTopic } = await import('@/actions/admin');
        const res = await updateTopic(topicId, editTopicContent);
        if (res.error) alert('Greška: ' + res.error);
        else {
            setEditingTopic(false);
            loadData();
        }
    };

    const handleUpdateComment = async (commentId: string) => {
        if (!editCommentContent.trim()) return;
        const { updateComment } = await import('@/actions/admin');
        const res = await updateComment(commentId, editCommentContent);
        if (res.error) alert('Greška: ' + res.error);
        else {
            setEditingCommentId(null);
            loadData();
        }
    };

    const isAdmin = user?.role === 'admin' || user?.email === 'udrugabaljci@gmail.com';

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Header / Back */}
            <div className="flex justify-between items-center">
                <Link href="/dashboard/community" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-2">
                    <ArrowLeft size={16} />
                    Natrag na Forum
                </Link>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingTopic(!editingTopic);
                                setEditTopicContent(topic?.content || '');
                            }}
                            className="text-sky-600 hover:text-sky-800 text-xs font-bold uppercase flex items-center gap-1 bg-sky-50 px-3 py-1 rounded"
                        >
                            {editingTopic ? 'Odustani' : 'Uredi'}
                        </button>
                        <button
                            onClick={handleDeleteTopic}
                            className="text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1 bg-red-50 px-3 py-1 rounded"
                        >
                            Obriši
                        </button>
                    </div>
                )}
            </div>

            {/* Original View (The "Topic") */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-sky-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-lg">
                        {topic.author_name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{topic.author_name}</h1>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(topic.created_at).toLocaleString('hr-HR')}
                        </p>
                    </div>
                </div>

                {editingTopic ? (
                    <div className="space-y-3">
                        <textarea
                            value={editTopicContent}
                            onChange={(e) => setEditTopicContent(e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-md text-slate-800 min-h-[150px]"
                            title="Uredi temu"
                            placeholder="Sadržaj teme..."
                        />
                        <button
                            onClick={handleUpdateTopic}
                            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-bold hover:bg-sky-700"
                        >
                            Spremi Promjene
                        </button>
                    </div>
                ) : (
                    <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-lg">
                        {topic.content}
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">
                    Odgovori ({comments.length})
                </h3>

                {comments.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex gap-4 group relative">
                        {/* Admin Comment Controls */}
                        {(isAdmin || user?.id === comment.created_by) && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditCommentContent(comment.content);
                                    }}
                                    className="text-slate-400 hover:text-sky-600 p-2"
                                    title="Uredi"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-slate-400 hover:text-red-600 p-2"
                                    title="Obriši"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        )}

                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {comment.author_name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-bold text-slate-700 text-sm">{comment.author_name}</span>
                                <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString('hr-HR')}</span>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded text-sm"
                                        title="Uredi komentar"
                                        placeholder="Sadržaj komentara..."
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateComment(comment.id)}
                                            className="px-3 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-700"
                                        >
                                            Spremi
                                        </button>
                                        <button
                                            onClick={() => setEditingCommentId(null)}
                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
                                        >
                                            Odustani
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Input (Sticky Bottom or Inline) */}
            <div className="bg-white p-4 rounded-xl shadow-lg border border-sky-100 sticky bottom-6">
                <form onSubmit={handleReply} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Napiši odgovor..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[60px] resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !replyContent.trim()}
                        className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 transition-colors shadow-md"
                    >
                        <Send size={20} />
                        <span className="sr-only">Pošalji odgovor</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
