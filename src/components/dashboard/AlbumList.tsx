'use client';

import { useState, useEffect } from 'react';
import { createAlbum, getAlbums, deleteAlbum } from '@/actions/cms';
import { Folder, Plus, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Album = {
    id: string;
    title: string;
    created_at: string;
    created_by: string;
    creator?: { display_name: string };
    image_count?: [{ count: number }];
};

interface AlbumListProps {
    onSelectAlbum: (album: Album) => void;
}

export default function AlbumList({ onSelectAlbum }: AlbumListProps) {
    const { user } = useAuth();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const loadAlbums = async () => {
        setLoading(true);
        const { data, error } = await getAlbums();
        if (error) {
            console.error(error);
        } else if (data) {
            setAlbums(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAlbums();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !user) return;

        const { data, error } = await createAlbum(newTitle);
        if (error) {
            alert('Failed to create album');
        } else {
            setNewTitle('');
            setIsCreating(false);
            loadAlbums();
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure? This will delete the album and its images.')) return;

        const { error } = await deleteAlbum(id);
        if (error) {
            alert('Error deleting album');
        } else {
            loadAlbums();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                    <Folder className="text-stone-500" /> Photo Albums
                </h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors text-sm"
                >
                    <Plus size={16} /> New Folder
                </button>
            </div>

            {isCreating && (
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Folder Name"
                            className="flex-1 px-3 py-2 border border-stone-300 rounded-md text-sm"
                            autoFocus
                        />
                        <button type="submit" className="px-4 py-2 bg-stone-900 text-white rounded-md text-sm">Create</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-stone-600 text-sm">Cancel</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="text-stone-400 text-sm">Loading folders...</p>
            ) : albums.length === 0 ? (
                <div className="text-center py-12 bg-white border border-stone-100 rounded-lg">
                    <Folder className="mx-auto text-stone-300 mb-2" size={32} />
                    <p className="text-stone-500 text-sm">No albums yet. Create one to start!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {albums.map((album) => (
                        <div
                            key={album.id}
                            onClick={() => onSelectAlbum(album)}
                            className="group bg-white p-4 rounded-lg border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <Folder size={24} fill="currentColor" className="opacity-80" />
                                </div>
                                <div className="truncate">
                                    <h3 className="font-semibold text-stone-800 truncate">{album.title}</h3>
                                    <p className="text-xs text-stone-500">
                                        by {album.creator?.display_name || 'Unknown'}
                                        {/* • {album.image_count?.[0]?.count || 0} items */}
                                    </p>
                                </div>
                            </div>

                            {/* Allow deleting own albums or if admin */}
                            {(user?.id === album.created_by || user?.role === 'admin') && (
                                <button
                                    onClick={(e) => handleDelete(e, album.id)}
                                    className="p-2 text-stone-300 hover:text-red-500 hover:bg-stone-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
