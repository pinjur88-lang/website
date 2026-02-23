'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin, verifyUser } from '@/lib/auth-admin';

export async function submitReport(type: 'dumping' | 'suggestion', content: string, location?: string) {
    try {
        const user = await verifyUser();
        const userId = user?.id || null;
        const userEmail = user?.email || null;
        const userName = (user as any)?.display_name || null;

        const { error } = await supabaseAdmin.from('user_submissions').insert([{
            type,
            content,
            location: location || null,
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            status: 'pending'
        }]);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("DEBUG: Insert submission error:", error);
        return { error: error.message };
    }
}

export async function getSubmissions(status: 'pending' | 'resolved') {
    try {
        const admin = await verifyAdmin();
        if (!admin) throw new Error("Unauthorized");

        const { data, error } = await supabaseAdmin
            .from('user_submissions')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateSubmissionStatus(id: string, status: 'pending' | 'resolved', adminNotes?: string) {
    try {
        const admin = await verifyAdmin();
        if (!admin) throw new Error("Unauthorized");

        const updates: any = { status };
        if (adminNotes !== undefined) updates.admin_notes = adminNotes;
        if (status === 'resolved') updates.resolved_at = new Date().toISOString();
        else updates.resolved_at = null;

        const { error } = await supabaseAdmin
            .from('user_submissions')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteSubmission(id: string) {
    try {
        const admin = await verifyAdmin();
        if (!admin) throw new Error("Unauthorized");

        const { error } = await supabaseAdmin
            .from('user_submissions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
