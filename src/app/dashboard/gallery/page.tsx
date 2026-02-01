'use client';

import { useState } from 'react';
import AlbumList from '@/components/dashboard/AlbumList';
import AlbumView from '@/components/dashboard/AlbumView';
import { useLanguage } from '@/lib/language-context';

export default function GalleryPage() {
    const { t } = useLanguage();
    const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-stone-900">{t.gallery || 'Galerija'}</h1>

            {!selectedAlbum ? (
                <AlbumList onSelectAlbum={setSelectedAlbum} />
            ) : (
                <AlbumView
                    album={selectedAlbum}
                    onBack={() => setSelectedAlbum(null)}
                />
            )}
        </div>
    );
}
