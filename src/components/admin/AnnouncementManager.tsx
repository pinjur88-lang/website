'use client';

import { useState, useEffect } from 'react';
import { createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from '@/actions/cms';
import { Trash2, Plus, MessageSquare, Pencil, Check, X as CloseIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

    // Form state for creation
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingImage(true);
        setError('');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `announcements/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            setContent(prev => prev + `\n\n[IMAGE:${publicUrl}]`);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError('Greška pri učitavanju slike: ' + err.message);
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = ''; // reset input
        }
    };

    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

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

    const handleUpdate = async (id: string) => {
        if (!editTitle.trim() || !editContent.trim()) return;
        setSubmitting(true);

        const { error } = await updateAnnouncement(id, editTitle, editContent);
        if (error) {
            alert('Greška pri ažuriranju: ' + error);
        } else {
            setEditingId(null);
            loadAnnouncements();
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Jeste li sigurni da želite obrisati ovu obavijest?')) return;

        // Optimistic update
        setAnnouncements(prev => prev.filter(a => a.id !== id));

        const { error } = await deleteAnnouncement(id);
        if (error) {
            alert('Greška pri brisanju: ' + error);
            loadAnnouncements(); // Revert on fail
        }
    };

    const startEditing = (item: Announcement) => {
        setEditingId(item.id);
        setEditTitle(item.title);
        setEditContent(item.content);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-800">Obavijesti</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-sm text-sm hover:bg-zinc-700 transition-colors shadow-sm"
                >
                    <Plus size={16} /> {isCreating ? 'Odustani' : 'Nova Obavijest'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-white p-6 border border-zinc-200 shadow-sm rounded-sm space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Naslov</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Naslov vijesti"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Sadržaj</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Napišite sadržaj obavijesti..."
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <div className="flex justify-between items-center mt-2">
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <button
                                type="button"
                                disabled={uploadingImage}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-md text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                            >
                                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                                {uploadingImage ? 'Učitavanje...' : 'Dodaj Sliku'}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-zinc-900 text-white rounded-md text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? 'Objavljivanje...' : 'Objavi Obavijest'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full mx-auto mb-4"></div>
                    <p className="text-zinc-400 text-sm">Učitavanje obavijesti...</p>
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 border border-zinc-100 rounded-sm">
                    <MessageSquare className="mx-auto text-zinc-200 mb-3" size={48} />
                    <p className="text-zinc-500 font-medium">Nema obavijesti.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(item => (
                        <div key={item.id} className="bg-white border border-zinc-200 p-6 rounded-lg shadow-sm relative group hover:border-zinc-300 transition-colors">
                            {editingId === item.id ? (
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-zinc-900"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            rows={4}
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-zinc-900"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded text-sm font-medium"
                                        >
                                            <CloseIcon size={14} /> Odustani
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(item.id)}
                                            disabled={submitting}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded text-sm font-medium"
                                        >
                                            <Check size={14} /> {submitting ? 'Spremanje...' : 'Spremi'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute top-4 right-4 flex gap-2 transition-opacity">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="text-stone-300 hover:text-sky-600 transition-colors p-1"
                                            title="Uredi"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-stone-300 hover:text-red-500 transition-colors p-1"
                                            title="Obriši"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2 pr-12">{item.title}</h3>
                                    <p className="text-zinc-600 text-sm mb-4 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                                        <span>{new Date(item.created_at).toLocaleDateString('hr-HR')}</span>
                                        {item.author?.display_name && (
                                            <>
                                                <span>•</span>
                                                <span className="font-medium text-zinc-500">Objavio {item.author.display_name}</span>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
