
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin, verifyUser } from '@/lib/auth-admin';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
import MapWrapper from '@/components/public/MapWrapper';

export default async function MapPage() {
    // 1. Double check session (Server Side)
    const user = await verifyUser();

    if (!user) {
        redirect('/login');
    }

    // 2. Fetch locations from map_locations
    const { data: locations, error } = await supabaseAdmin
        .from('map_locations')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching map data:', error);
    }

    return (
        <main className="min-h-screen bg-white">
            <header className="h-16 border-b border-zinc-100 flex items-center px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[2000] justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="font-serif text-xl font-bold tracking-tight text-zinc-900">
                        Interaktivna Karta Sela
                    </h1>
                    <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-sans font-bold border-l border-zinc-200 pl-4">
                        Baljci, Croatia
                    </span>
                </div>
                <div className="flex items-center gap-6">

                    <a href="/dashboard" className="text-xs font-sans uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
                        Nadzorna ploča
                    </a>
                </div>
            </header>

            <MapWrapper initialLocations={locations || []} />
        </main>
    );
}
