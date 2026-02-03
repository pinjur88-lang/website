"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';

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

export default function InteractiveMap() {
    const [locations, setLocations] = useState<Location[]>([]);
    // Baljci coordinates (approximate center)
    const center: [number, number] = [43.945, 16.205];

    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await supabase.from('map_locations').select('*');
            if (data) setLocations(data);
        };
        fetchLocations();
    }, []);

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-stone-200 shadow-sm z-0 relative">
            <MapContainer
                center={center}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-stone-900 mb-1">{loc.title}</h3>
                                {loc.image_url && (
                                    <img
                                        src={loc.image_url}
                                        alt={loc.title}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                )}
                                <p className="text-sm text-stone-600">{loc.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
