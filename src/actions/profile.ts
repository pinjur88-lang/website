'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyUser, verifyAdmin } from '@/lib/auth-admin';
import { revalidatePath } from 'next/cache';

export async function getProfile(userId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, display_name, role, membership_tier, donor_tier, avatar_url, bio')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateProfile(userId: string, updates: { bio?: string, avatar_url?: string, display_name?: string }) {
    try {
        const user = await verifyUser();
        if (!user) throw new Error("Unauthorized");

        const isAdmin = await verifyAdmin();

        // Ensure user can only update their own profile unless they are admin
        if (user.id !== userId && !isAdmin) {
            throw new Error("Forbidden: You can only update your own profile.");
        }

        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                bio: updates.bio,
                avatar_url: updates.avatar_url,
                display_name: updates.display_name,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) throw error;

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/community');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
