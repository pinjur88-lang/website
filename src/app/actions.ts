'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function checkApprovedRequest(email: string) {
    if (!email) return { error: "Email is required" };

    const cleanEmail = email.trim();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("SERVER ERROR: Missing SUPABASE_SERVICE_ROLE_KEY");
        return { error: 'Configuration Error: Missing Admin Key' };
    }

    try {
        console.log(`Checking approval for: ${cleanEmail}`);
        // Use ilike for case-insensitive matching
        // We order by created_at desc to get the latest request if there are duplicates
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('status, name')
            .ilike('email', cleanEmail)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Supabase Admin Query Error:", error);
            // Distinguish between not found and other errors
            if (error.code === 'PGRST116') { // PostgREST code for "The result contains 0 rows"
                return { error: 'Not found' };
            }
            return { error: `Database Error: ${error.message}` };
        }

        if (!data) {
            return { error: 'Not found' };
        }

        console.log("Found request:", data);
        return { data };
    } catch (e: any) {
        console.error("Action exception:", e);
        return { error: `Internal Server Error: ${e.message}` };
    }
}
