
import { supabase } from '@/lib/supabase';

// CLIENT-SIDE HELPERS (Protected by RLS)

export async function updateAdminNotes(requestId: string, notes: string) {
    const { error } = await supabase
        .from('requests')
        .update({ admin_notes: notes })
        .eq('id', requestId);

    if (error) return { error: error.message };
    return { success: true };
}

export async function addDonation(email: string, amount: number, description: string) {
    // Get current user (admin) ID for 'recorded_by'
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const { data, error } = await supabase
        .from('donations')
        .insert([{
            email,
            amount,
            description,
            recorded_by: user.id
        }])
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function getMemberDonations(email: string) {
    const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function getMemberStats(email: string) {
    // Calculate total donations
    const { data, error } = await supabase
        .from('donations')
        .select('amount')
        .eq('email', email);

    if (error) return { error: error.message };

    const total = data.reduce((sum, d) => sum + Number(d.amount), 0);
    const count = data.length;

    return { total, count };
}
