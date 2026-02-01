"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createCommunityPost, getCommunityPosts } from '@/actions/community';
import { MessageSquare, User, Send, Shield } from 'lucide-react';

type Post = {
    id: string;
    content: string;
    created_at: string;
    author_name: string;
};

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadPosts = async () => {
        const { data } = await getCommunityPosts();
        if (data) setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        setSubmitting(true);
        const { error } = await createCommunityPost(content, user.id, isAnonymous);

        if (error) {
            alert('Greška pri objavi: ' + error);
        } else {
            setContent('');
            setIsAnonymous(false);
            loadPosts();
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-stone-200 pb-4">
                <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                    <MessageSquare className="text-stone-700" />
                    Zid Zajednice
                </h1>
                <p className="text-stone-600 text-sm mt-1">
                    Podijelite svoja razmišljanja, ideje ili pitanja s ostalim članovima.
                </p>
            </div>

            {/* Input Box */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Napišite nešto..."
                        className="w-full p-3 border border-stone-200 rounded-md focus:ring-1 focus:ring-stone-400 focus:border-stone-400 min-h-[100px] text-sm resize-none"
                        required
                    />

                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                            />
                            <span className="flex items-center gap-1">
                                {isAnonymous ? <Shield size={14} className="text-stone-500" /> : <User size={14} className="text-stone-400" />}
                                {isAnonymous ? 'Objavljujem Anonimno' : `Objavi kao ${user?.name}`}
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
                        >
                            <Send size={14} />
                            {submitting ? 'Slanje...' : 'Objavi'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-stone-400 text-sm">Učitavanje objava...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                        <p className="text-stone-500 font-medium">Još nema objava.</p>
                        <p className="text-stone-400 text-xs mt-1">Budite prvi koji će nešto napisati!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
                            <p className="text-stone-800 text-sm whitespace-pre-wrap leading-relaxed mb-3">
                                {post.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-stone-400 border-t border-stone-100 pt-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${post.author_name === 'Anonimni Član' ? 'bg-stone-200 text-stone-500' : 'bg-green-100 text-green-700'}`}>
                                    {post.author_name.charAt(0)}
                                </div>
                                <span className="font-medium text-stone-500">{post.author_name}</span>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleString('hr-HR')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
