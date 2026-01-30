"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { MessageCircle, Send } from 'lucide-react';
import { db, CommunityPost } from '@/lib/store';

export default function CommunityPage() {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [content, setContent] = useState('');

    const refresh = () => setPosts(db.getCommunityPosts());

    useEffect(() => {
        refresh();
        // Optional: poll for changes
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        db.addCommunityPost(content);
        setContent('');
        refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-stone-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Zid Zajednice</h1>
                    <p className="text-stone-600 text-sm">Anonimne objave članova. Poštujte jedni druge.</p>
                </div>
            </div>

            {/* Post Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-800"
                        placeholder="Napišite nešto anonimno..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-stone-900 text-white px-4 py-2 rounded hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                        <Send size={16} /> <span className="hidden sm:inline">Objavi</span>
                    </button>
                </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-10 text-stone-400 italic">
                        Još nema objava. Budite prvi!
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded-lg border border-stone-100 shadow-sm flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                                    <MessageCircle size={20} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-stone-700 text-sm">{post.author}</span>
                                    <span className="text-xs text-stone-400">{post.date}</span>
                                </div>
                                <p className="text-stone-800 text-sm">{post.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
