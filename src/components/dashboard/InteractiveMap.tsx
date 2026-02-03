"use client";

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Search, Home, User, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { updateMapLocationOwner } from '@/actions/map';

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
    owner_name?: string;
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

// Subcomponent for Popup to handle state cleanly
function MapPopup({ location }: { location: Location }) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [isEditing, setIsEditing] = useState(false);
    const [ownerInput, setOwnerInput] = useState(location.owner_name || '');
    const [isSaving, setIsSaving] = useState(false);

    // Update local state if prop changes (e.g. initial load)
    useEffect(() => {
        setOwnerInput(location.owner_name || '');
    }, [location.owner_name]);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateMapLocationOwner(location.id, ownerInput);
        if (res.success) {
            location.owner_name = ownerInput; // Optimistic update
            setIsEditing(false);
        } else {
            alert("Greška: " + res.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="min-w-[220px] p-1">
            <h3 className="font-bold text-stone-900 mb-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-600" />
                    {location.title}
                </span>
                {isAdmin && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-stone-400 hover:text-amber-600 transition-colors"
                        title="Uredi vlasnika"
                    >
                        <Edit2 size={14} />
                    </button>
                )}
            </h3>

            {location.image_url && (
                <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-stone-100">
                    <img
                        src={location.image_url}
                        alt={location.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-sm text-stone-600 space-y-2">
                {/* Standard Description (Area/Use) */}
                <p className="whitespace-pre-line text-xs">{location.description}</p>

                {/* Owner Section */}
                <div className="pt-2 border-t border-stone-200 mt-2">
                    <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-stone-400 mb-1">
                        <User size={12} />
                        <span>Vlasnik / Posjednik</span>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95">
                            <input
                                value={ownerInput}
                                onChange={(e) => setOwnerInput(e.target.value)}
                                className="w-full text-sm p-1.5 border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="Upiši ime i prezime..."
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-amber-600 text-white text-xs py-1.5 rounded hover:bg-amber-700 transition-colors flex items-center justify-center gap-1 font-bold"
                                >
                                    {isSaving ? '...' : <><Save size={12} /> Spremi</>}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-2 bg-stone-200 text-stone-600 rounded hover:bg-stone-300 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className={`font-medium ${location.owner_name ? 'text-stone-900' : 'text-stone-400 italic'}`}>
                            {location.owner_name || "Nema podataka (Klikni za unos)"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
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
            loc.description.toLowerCase().includes(query) ||
            (loc.owner_name && loc.owner_name.toLowerCase().includes(query))
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
                                    <div className="text-xs text-stone-500 line-clamp-1">
                                        {loc.owner_name ? `Vlasnik: ${loc.owner_name}` : loc.description}
                                    </div>
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
                                <MapPopup location={loc} />
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
