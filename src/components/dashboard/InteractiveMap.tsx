"use client";

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Search, Home, User, MapPin } from 'lucide-react';

// Fix for default marker icons in Next.js/Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type Location = {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    image_url: string;
};

// Component to handle map movement
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 1.5
        });
    }, [center, zoom, map]);
    return null;
}

export default function InteractiveMap() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    // Default: Sv. Jovan Church, Baljci
    const defaultCenter: [number, number] = [43.82438, 16.30856];
    const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
    const [mapZoom, setMapZoom] = useState(16);

    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await supabase.from('map_locations').select('*');
            if (data) setLocations(data);
        };
        fetchLocations();
    }, []);

    // Filter locations based on search
    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return locations.filter(loc =>
            loc.title.toLowerCase().includes(query) ||
            loc.description.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to top 5 results for dropdown
    }, [searchQuery, locations]);

    const handleSelectLocation = (loc: Location) => {
        setSelectedLocation(loc);
        setMapCenter([loc.lat, loc.lng]);
        setMapZoom(19); // Zoom in close to the house
        setSearchQuery(''); // Clear search after selection
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Search Bar UI */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 text-stone-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Traži po prezimenu ili broju čestice (npr. Genda ili 1044)..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-stone-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Search Results Dropdown */}
                {filteredResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 rounded-xl shadow-xl z-[1000] overflow-hidden">
                        {filteredResults.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => handleSelectLocation(loc)}
                                className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-start gap-3 border-b border-stone-50 last:border-0"
                            >
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <MapPin className="w-4 h-4 text-amber-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-stone-900">{loc.title}</div>
                                    <div className="text-xs text-stone-500 line-clamp-1">{loc.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-stone-200 shadow-lg z-0 relative">
                <MapContainer
                    center={defaultCenter}
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController center={mapCenter} zoom={mapZoom} />

                    {locations.map((loc) => (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="min-w-[200px] p-1">
                                    <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                                        <Home className="w-4 h-4 text-amber-600" />
                                        {loc.title}
                                    </h3>
                                    {loc.image_url && (
                                        <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-stone-100">
                                            <img
                                                src={loc.image_url}
                                                alt={loc.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-100 text-sm text-stone-600 flex items-start gap-2">
                                        <User className="w-4 h-4 text-stone-400 mt-0.5" />
                                        <p className="whitespace-pre-line">{loc.description}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 text-sm text-amber-800 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                    <Home className="w-4 h-4" />
                </div>
                <p>Pronađite svoje ognjište pretragom čestice ili prezimena predaka. Mapa prikazuje točne lokacije kuća u Baljcima.</p>
            </div>
        </div>
    );
}
