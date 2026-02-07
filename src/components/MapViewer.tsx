"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Marker {
    text: string;
    suggested_modern_name: string | null;
    type: string;
    box_2d: [number, number, number, number]; // ymin, xmin, ymax, xmax (0-1000)
}

const MAP_FILES = [
    "Baljke-I.jpg", "Baljke-II.jpg", "Baljke-III.jpg", "Baljke-IV.jpg",
    "Baljke-V.jpg", "Baljke-VI.jpg", "Baljke-VII.jpg", "Baljke-VIII.jpg",
    "Baljke-IX.jpg", "Baljke-X.jpg", "Baljke-XI.jpg", "Baljke-XII.jpg",
    "Baljke-XIII.jpg", "Baljke-XIV.jpg", "Baljke-XV.jpg", "Baljke-XVI.jpg",
    "Baljke-XVII.jpg", "Baljke-XVIII.jpg", "Baljke-uvećanje.jpg"
];

export default function MapViewer() {
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const [markersMap, setMarkersMap] = useState<Record<string, Marker[]>>({});
    const router = useRouter();

    useEffect(() => {
        fetch("/archive/maps/Baljke/markers.json")
            .then((res) => res.json())
            .then((data) => setMarkersMap(data))
            .catch((err) => console.error("Failed to load markers", err));
    }, []);

    const handleMarkerClick = (marker: Marker) => {
        if (marker.suggested_modern_name) {
            router.push(`/archive/search?q=${marker.suggested_modern_name}`);
        }
    };

    const currentMarkers = selectedMap && markersMap[selectedMap] ? markersMap[selectedMap] : [];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Cadastral Maps (1830s)
            </h2>

            {/* Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {MAP_FILES.map((file) => (
                    <div
                        key={file}
                        className="group relative aspect-[3/4] cursor-pointer bg-slate-100 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors"
                        onClick={() => setSelectedMap(file)}
                    >
                        <Image
                            src={`/archive/maps/Baljke/${file}`}
                            alt={file}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {file.replace("Baljke-", "").replace(".jpg", "")}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedMap && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedMap(null)}
                >
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image
                            src={`/archive/maps/Baljke/${selectedMap}`}
                            alt={selectedMap}
                            fill
                            className="object-contain"
                        />
                        {/* Markers Overlay - Dynamic for Selected Map */}
                        {selectedMap && currentMarkers.map((m, i) => {
                            // box_2d is [ymin, xmin, ymax, xmax] on 0-1000 scale
                            // CSS properties: top, left, height, width as percentages
                            const top = (m.box_2d[0] / 1000) * 100;
                            const left = (m.box_2d[1] / 1000) * 100;
                            const height = ((m.box_2d[2] - m.box_2d[0]) / 1000) * 100;
                            const width = ((m.box_2d[3] - m.box_2d[1]) / 1000) * 100;

                            return (
                                <div
                                    key={i}
                                    // CHANGED: Subtle visibility (user request) - faint yellow tint/border
                                    className="absolute border border-yellow-600/30 bg-yellow-500/10 hover:border-yellow-600 hover:bg-yellow-500/30 cursor-pointer group/marker hover:z-10 transition-colors duration-200"
                                    style={{ top: `${top}%`, left: `${left}%`, width: `${width}%`, height: `${height}%` }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkerClick(m);
                                    }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/marker:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                                        <span className="font-bold">{m.suggested_modern_name || m.text}</span>
                                        {m.type === "SURNAME" && <span className="block text-[10px] text-gray-300">Click to Search Family</span>}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                            onClick={() => setSelectedMap(null)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white font-mono">
                            {selectedMap} - K.O. Baljke
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
