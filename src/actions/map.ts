'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/auth-admin';
import { revalidatePath } from 'next/cache';

export async function updateMapLocationOwner(locationId: string, ownerName: string) {
    // 1. Verify Admin
    if (!await verifyAdmin()) {
        return { error: "Unauthorized" };
    }

    try {
        // 2. Update Database
        const { error } = await supabaseAdmin
            .from('map_locations')
            .update({ owner_name: ownerName })
            .eq('id', locationId);

        if (error) throw error;

        // 3. Revalidate Map Page (optional, though map usually fetches client-side)
        revalidatePath('/dashboard/map');

        return { success: true };
    } catch (error: any) {
        console.error("Error updating owner:", error);
        return { error: error.message };
    }
}
