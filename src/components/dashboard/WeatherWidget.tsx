'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning, Loader2, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

// Coordinates for Baljci, Croatia
const LAT = 43.84;
const LON = 16.22;

export default function WeatherWidget() {
    const { t } = useLanguage();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                // Open-Meteo API (Free, No Key)
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error("Weather fetch failed", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, []);

    // WMO Weather Codes interpretation
    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun className="text-yellow-500" size={32} />;
        if (code === 2 || code === 3) return <Cloud className="text-stone-400" size={32} />;
        if (code >= 45 && code <= 48) return <Wind className="text-stone-400" size={32} />;
        if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={32} />;
        if (code >= 71 && code <= 77) return <Snowflake className="text-cyan-300" size={32} />;
        if (code >= 80 && code <= 82) return <CloudRain className="text-blue-500" size={32} />;
        if (code >= 95) return <CloudLightning className="text-purple-500" size={32} />;
        return <Sun className="text-yellow-500" size={32} />;
    };

    const getConditionText = (code: number) => {
        if (code === 0) return t.weatherClear || "Vedro";
        if (code === 1 || code === 2 || code === 3) return t.weatherPartlyCloudy || "Djelomično oblačno";
        if (code >= 51 && code <= 67) return t.weatherRain || "Kiša";
        if (code >= 71 && code <= 77) return t.weatherSnow || "Snijeg";
        if (code >= 80) return t.weatherRain || "Kiša";
        return t.weatherClear || "Sunčano";
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm flex items-center justify-center h-48">
                <Loader2 className="animate-spin text-stone-300" />
            </div>
        );
    }

    if (!weather) return null;

    const current = weather.current;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-stone-900 text-lg">Baljci</h3>
                    <p className="text-xs text-stone-500">{t.weatherTitle || "Trenutno Vrijeme"}</p>
                </div>
                {getWeatherIcon(current.weather_code)}
            </div>

            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-stone-800">{Math.round(current.temperature_2m)}°</span>
                <span className="text-stone-500 font-medium">{getConditionText(current.weather_code)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-stone-600 bg-white/50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                    <Wind size={14} />
                    <span>{t.weatherWind || "Vjetar"}: {current.wind_speed_10m} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                    <Droplets size={14} />
                    <span>{t.weatherHumidity || "Vlaga"}: {current.relative_humidity_2m}%</span>
                </div>
            </div>
        </div>
    );
}
