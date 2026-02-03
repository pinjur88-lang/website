"use client";

import dynamic from 'next/dynamic';
import { Map } from 'lucide-react';

// Dynamically import the map to avoid SSR issues with Leaflet
const InteractiveMapOnly = dynamic(
    () => import('@/components/dashboard/InteractiveMap'),
    {
        loading: () => <div className="h-[600px] w-full bg-stone-100 animate-pulse rounded-xl flex items-center justify-center text-stone-400">Učitavanje karte...</div>,
        ssr: false
    }
);

export default function MapPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-6">
                <Map className="text-amber-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 font-serif">Karta Sela Baljci</h1>
                    <p className="text-stone-500">Istražite lokacije, stare kuće i znamenitosti.</p>
                </div>
            </div>

            <InteractiveMapOnly />

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                <p><strong>Napomena:</strong> Karta prikazuje označene lokacije. Kao član, uskoro ćete moći dodavati vlastite točke interesa.</p>
            </div>
        </div>
    );
}
