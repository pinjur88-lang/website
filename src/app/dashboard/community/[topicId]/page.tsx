'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTopicDetail, Topic, Comment } from '@/actions/forum';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft, MessageSquare, Send, User, Calendar, Shield, Crown, Heart, Star, Award } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { t, language } = useLanguage();

    const topicId = params?.topicId as string;

    const [topic, setTopic] = useState<Topic | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const renderDonorBadge = (tier?: string) => {
        if (!tier || tier === 'none') return null;
        switch (tier) {
            case 'donor_plus':
                return <span className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-200" title="Premium Donor"><Heart size={10} className="fill-indigo-500" /> Donator +</span>;
            case 'vip':
                return <span className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-fuchsia-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-fuchsia-200" title="VIP Donor"><Star size={10} className="fill-fuchsia-500" /> VIP Donator</span>;
            case 'gold':
                return <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-amber-200" title="Gold Donor"><Crown size={10} className="text-amber-500" /> Gold Donator</span>;
            default:
                return null;
        }
    };

    const renderMembershipBadge = (tier?: string) => {
        if (!tier || tier === 'free') return null;
        switch (tier) {
            case 'supporter':
                return <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200" title="Supporter Member"><Award size={10} /> Podupiratelj</span>;
            case 'voting':
                return <span className="flex items-center gap-1 bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-sky-200" title="Voting Member"><Shield size={10} /> Punopravni Član</span>;
            default:
                return null;
        }
    };

    const loadData = async () => {
        if (!topicId) return;
        const { topic, comments, error } = await getTopicDetail(topicId);
        if (error) {
            console.error(error);
            alert((t.errorPrefix || 'Error: ') + error);
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
                content: replyContent,
                is_anonymous: isAnonymous
            });

        if (error) {
            alert((t.errorPrefix || 'Error: ') + error.message);
        } else {
            setReplyContent('');
            setIsAnonymous(false);
            loadData(); // Reload comments
        }
        setSubmitting(false);
    };

    const [editingTopic, setEditingTopic] = useState(false);
    const [editTopicContent, setEditTopicContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState('');

    if (loading) return <div className="p-8 text-center text-slate-400">{t.checking || 'Loading...'}</div>;
    if (!topic) return <div className="p-8 text-center text-red-500">{t.topicNotFound || 'Topic not found.'}</div>;

    const handleDeleteTopic = async () => {
        if (!confirm(t.areYouSureDeleteTopic || 'Are you sure you want to delete this topic and all comments?')) return;

        const { deleteTopic } = await import('@/actions/admin');
        const res = await deleteTopic(topicId);
        if (res.error) {
            alert((t.forumErrorDeletion || 'Error during deletion: ') + res.error);
        } else {
            router.push('/dashboard/community');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm(t.deleteCommentConfirm || 'Delete this comment?')) return;
        const { deleteComment } = await import('@/actions/admin');
        const res = await deleteComment(commentId);
        if (res.error) {
            alert((t.errorPrefix || 'Error: ') + res.error);
        } else {
            loadData();
        }
    };

    const handleUpdateTopic = async () => {
        if (!editTopicContent.trim()) return;
        const { updateTopic } = await import('@/actions/admin');
        const res = await updateTopic(topicId, editTopicContent);
        if (res.error) alert((t.errorPrefix || 'Error: ') + res.error);
        else {
            setEditingTopic(false);
            loadData();
        }
    };

    const handleUpdateComment = async (commentId: string) => {
        if (!editCommentContent.trim()) return;
        const { updateComment } = await import('@/actions/admin');
        const res = await updateComment(commentId, editCommentContent);
        if (res.error) alert((t.errorPrefix || 'Error: ') + res.error);
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
                    {t.backToForum || 'Back to Forum'}
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
                            {editingTopic ? (t.cancelAction || 'Cancel') : (t.editAction || 'Edit')}
                        </button>
                        <button
                            onClick={handleDeleteTopic}
                            className="text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1 bg-red-50 px-3 py-1 rounded"
                        >
                            {t.deleteAction || 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {/* Original View (The "Topic") */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-sky-100">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border ${topic.author_role === 'admin' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-sky-100 text-sky-700 border-sky-200'}`}>
                        {topic.author_role === 'admin' ? <Shield size={20} /> : String(topic.author_name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h1 className={`text-xl font-bold flex items-center gap-2 ${topic.author_role === 'admin' ? 'text-amber-700' : 'text-slate-900'}`}>
                                {topic.author_name}
                                {topic.author_role === 'admin' && (
                                    <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                                        Admin
                                    </span>
                                )}
                            </h1>
                            {renderMembershipBadge(topic.author_membership_tier)}
                            {renderDonorBadge(topic.author_donor_tier)}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={12} />
                            {new Date(topic.created_at).toLocaleString(language === 'en' ? 'en-US' : 'hr-HR')}
                        </p>
                    </div>
                </div>

                {editingTopic ? (
                    <div className="space-y-3">
                        <textarea
                            value={editTopicContent}
                            onChange={(e) => setEditTopicContent(e.target.value)}
                            className="w-full p-2 border border-sky-300 rounded-md text-slate-800 min-h-[150px]"
                            title={t.forumEditTopic || "Edit topic"}
                            placeholder={t.forumContentPlaceholder || "Content..."}
                        />
                        <button
                            onClick={handleUpdateTopic}
                            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-bold hover:bg-sky-700"
                        >
                            {t.saveChanges || 'Save Changes'}
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
                    {t.repliesTitle || 'Replies'} ({comments.length})
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
                                    title={t.editAction || "Edit"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-slate-400 hover:text-red-600 p-2"
                                    title={t.deleteAction || "Delete"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        )}

                        <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center font-bold text-xs ${comment.author_role === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                                {comment.author_role === 'admin' ? <Shield size={14} /> : String(comment.author_name || '?').charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`font-bold text-sm flex items-center gap-1.5 ${comment.author_role === 'admin' ? 'text-amber-700' : 'text-slate-700'}`}>
                                        {comment.is_anonymous ? (t.anonymous || 'Anonymous') : comment.author_name}
                                        {comment.author_role === 'admin' && <Shield size={12} className="text-amber-500" />}
                                    </span>
                                    {renderMembershipBadge(comment.author_membership_tier)}
                                    {renderDonorBadge(comment.author_donor_tier)}
                                </div>
                                <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString(language === 'en' ? 'en-US' : 'hr-HR')}</span>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded text-sm"
                                        title={t.forumEditComment || "Edit comment"}
                                        placeholder={t.forumContentPlaceholder || "Content..."}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateComment(comment.id)}
                                            className="px-3 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-700"
                                        >
                                            {t.saveChanges || 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => setEditingCommentId(null)}
                                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
                                        >
                                            {t.cancelAction || 'Cancel'}
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
                            placeholder={t.writeReply || 'Write a reply...'}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[60px] resize-none"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                            <span className="flex items-center gap-1">
                                {isAnonymous ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        {t.anonymous || 'Anonymous'}
                                    </>
                                ) : (
                                    <>
                                        <User size={14} className="text-slate-400" />
                                        {user?.name || 'Ja'}
                                    </>
                                )}
                            </span>
                        </label>
                        <button
                            type="submit"
                            disabled={submitting || !replyContent.trim()}
                            className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 transition-colors shadow-md"
                        >
                            <Send size={20} />
                            <span className="sr-only">{t.sendReply || 'Send Reply'}</span>
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
