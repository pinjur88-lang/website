'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

interface AccessRequestData {
    name: string;
    email: string;
    phone: string;
    contact_method: string;
    oib?: string;
    dob?: string;
    address: string;
    accepted_statute: boolean;
    reason: string;
}

export async function submitAccessRequest(data: AccessRequestData) {
    try {
        console.log("Submitting access request for:", data.email);

        // Basic Validation
        if (!data.name || !data.email || !data.phone || !data.address || !data.reason) {
            return { error: "Molimo ispunite sva obavezna polja." };
        }

        if (!data.accepted_statute) {
            return { error: "Morate prihvatiti statut." };
        }

        // Check if email already exists in requests (optional, to prevent duplicates)
        const { data: existing } = await supabaseAdmin
            .from('requests')
            .select('id, status')
            .eq('email', data.email)
            .single();

        if (existing) {
            if (existing.status === 'pending') {
                return { error: "Već imate zahtjev na čekanju." };
            }
            if (existing.status === 'approved') {
                return { error: "Već ste registrirani član." };
            }
            // If rejected, maybe allow re-submission? Let's allow insert for now.
        }

        // Insert using Admin Client (Bypasses RLS)
        const { error } = await supabaseAdmin
            .from('requests')
            .insert([{
                name: data.name,
                email: data.email,
                phone: data.phone,
                contact_method: data.contact_method,
                oib: data.oib,
                dob: data.dob, // Ensure format is YYYY-MM-DD
                address: data.address,
                accepted_statute: data.accepted_statute,
                reason: data.reason,
                status: 'pending'
            }]);

        if (error) {
            console.error("Supabase Write Error:", error);
            return { error: "Greška prilikom spremanja u bazu. Pokušajte ponovno." };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { error: "Dogodila se neočekivana greška." };
    }
}
