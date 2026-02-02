"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Home, X, Image as ImageIcon, CheckCircle, Lock, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocation {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    image_url: string;
    claimed_by: string | null;
}

export default function MapComponent({ initialLocations }: { initialLocations: MapLocation[] }) {
    const { user } = useAuth();
    const [locations, setLocations] = useState<MapLocation[]>(initialLocations);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const center: [number, number] = [43.8243, 16.3085];

    const handleMarkerClick = (location: MapLocation) => {
        setSelectedLocation(location);
        setIsSidebarOpen(true);
    };

    const handleClaim = async () => {
        if (!user || !selectedLocation || selectedLocation.claimed_by) return;

        setIsClaiming(true);
        try {
            const { error } = await supabase
                .from('map_locations')
                .update({ claimed_by: user.id })
                .eq('id', selectedLocation.id);

            if (error) throw error;

            // Update local state
            const updatedLocations = locations.map(loc =>
                loc.id === selectedLocation.id ? { ...loc, claimed_by: user.id } : loc
            );
            setLocations(updatedLocations);
            setSelectedLocation({ ...selectedLocation, claimed_by: user.id });

            alert('Kuća je uspješno povezana s vašim profilom!');
        } catch (err: any) {
            alert('Greška pri povezivanju: ' + err.message);
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
            {/* Map Area */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-0' : ''}`}>
                <MapContainer
                    center={center}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((loc) => (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            eventHandlers={{
                                click: () => handleMarkerClick(loc),
                            }}
                        />
                    ))}
                </MapContainer>
            </div>

            {/* Sidebar / Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-zinc-100`}>
                {selectedLocation && (
                    <div className="h-full flex flex-col pt-16">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors mt-12 sm:mt-0"
                        >
                            <X size={24} className="text-zinc-500" />
                        </button>

                        <div className="relative h-64 w-full overflow-hidden bg-zinc-200">
                            {selectedLocation.image_url ? (
                                <img
                                    src={selectedLocation.image_url}
                                    alt={selectedLocation.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={48} className="text-zinc-400" />
                                </div>
                            )}
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">
                                    {selectedLocation.title}
                                </h2>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full w-fit">
                                    <Home size={12} />
                                    <span>Baljci, Drniš</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-sans font-bold text-zinc-800 uppercase text-xs tracking-widest border-b border-zinc-100 pb-2">
                                    Povijest Lokacije
                                </h3>
                                <p className="text-zinc-600 leading-relaxed text-sm">
                                    {selectedLocation.description || 'Nema dostupnog opisa za ovu lokaciju.'}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-zinc-100">
                                {selectedLocation.claimed_by ? (
                                    <div className="flex items-center gap-3 text-emerald-600 font-medium">
                                        <CheckCircle size={20} />
                                        <span>Ovu lokaciju je podijelio član zajednice.</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleClaim}
                                        disabled={isClaiming || !user}
                                        className="w-full py-4 bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
                                    >
                                        {isClaiming ? 'Povezivanje...' : 'Potvrdi Pripadnost Obitelji'}
                                        <Send size={16} />
                                    </button>
                                )}
                                {!user && (
                                    <p className="mt-2 text-xs text-center text-zinc-400 italic">
                                        Morate biti prijavljeni da biste potvrdili vlasništvo.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Info Toggle */}
            {!isSidebarOpen && selectedLocation && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute bottom-8 right-8 bg-white p-4 rounded-full shadow-2xl z-[900] text-zinc-900 hover:scale-110 transition-transform"
                >
                    <Home size={24} />
                </button>
            )}
        </div>
    );
}

// Lucid Send icon fix (importing Send from lucide-react above)
