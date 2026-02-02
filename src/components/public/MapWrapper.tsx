"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[calc(100vh-64px)] bg-zinc-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin w-12 h-12 border-t-2 border-zinc-900 rounded-full mx-auto"></div>
                <p className="text-zinc-500 font-serif italic text-lg tracking-wide">Učitavanje karte sela...</p>
            </div>
        </div>
    )
});

interface MapLocation {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    image_url: string;
    claimed_by: string | null;
}

export default function MapWrapper({ initialLocations }: { initialLocations: MapLocation[] }) {
    return <MapComponent initialLocations={initialLocations} />;
}
