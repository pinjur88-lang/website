'use client';

import { useState, useEffect } from 'react';
import { createAnnouncement, deleteAnnouncement, getAnnouncements } from '@/actions/cms';
import { Trash2, Plus, MessageSquare } from 'lucide-react';

type Announcement = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    author?: {
        display_name: string;
    };
};

export default function AnnouncementManager({ profileId }: { profileId: string }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadAnnouncements = async () => {
        setLoading(true);
        const { data, error } = await getAnnouncements();
        if (data) setAnnouncements(data);
        if (error) console.error(error);
        setLoading(false);
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const { data, error } = await createAnnouncement(title, content, profileId);

        if (error) {
            setError(error);
        } else {
            setTitle('');
            setContent('');
            setIsCreating(false);
            loadAnnouncements();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        // Optimistic update
        setAnnouncements(prev => prev.filter(a => a.id !== id));

        const { error } = await deleteAnnouncement(id);
        if (error) {
            alert('Failed to delete: ' + error);
            loadAnnouncements(); // Revert on fail
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-zinc-800">Announcements</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-sm hover:bg-zinc-700 transition-colors"
                >
                    <Plus size={16} /> {isCreating ? 'Cancel' : 'New Post'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-white p-6 border border-zinc-200 shadow-sm rounded-sm space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="News Headline"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase">Content</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Write your announcement here..."
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-zinc-900 text-white rounded-sm text-sm hover:bg-zinc-800 disabled:opacity-50"
                        >
                            {submitting ? 'Posting...' : 'Post Announcement'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-zinc-400 text-sm">Loading announcements...</p>
            ) : announcements.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 border border-zinc-100 rounded-sm">
                    <MessageSquare className="mx-auto text-zinc-300 mb-2" size={32} />
                    <p className="text-zinc-500 text-sm">No announcements yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(item => (
                        <div key={item.id} className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm relative group">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-4 right-4 text-zinc-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                            <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h3>
                            <p className="text-zinc-600 text-sm mb-4 whitespace-pre-wrap">{item.content}</p>
                            <div className="text-xs text-zinc-400 flex gap-2">
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                {item.author?.display_name && <span>• Posted by {item.author.display_name}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
