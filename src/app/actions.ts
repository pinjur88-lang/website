'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function checkApprovedRequest(email: string) {
    if (!email) return { error: "Email is required" };

    const cleanEmail = email.trim();

    try {
        // Use ilike for case-insensitive matching
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('status, name')
            .ilike('email', cleanEmail)
            .single();

        if (error || !data) {
            return { error: 'Not found' };
        }

        return { data };
    } catch (e) {
        console.error("Action error:", e);
        return { error: 'Internal Server Error' };
    }
}
