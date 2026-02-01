'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

import { verifyAdmin } from '@/lib/auth-admin';

// MEMBERSHIP REQUESTS
export async function getAdminRequests() {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Simplify Date Mapping
        return {
            data: data.map((item: any) => ({
                ...item,
                date: new Date(item.created_at).toLocaleDateString('hr-HR')
            }))
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function approveRequest(requestId: string, email: string, name: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        // 1. Update Request Status
        const { error: updateError } = await supabaseAdmin
            .from('requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

        if (updateError) throw updateError;

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

// FORUM MODERATION
export async function deleteTopic(topicId: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_posts')
            .delete()
            .eq('id', topicId);
        if (error) throw error;
        revalidatePath('/dashboard/community');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteComment(commentId: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_comments')
            .delete()
            .eq('id', commentId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateTopic(topicId: string, content: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_posts')
            .update({ content })
            .eq('id', topicId);
        if (error) throw error;
        revalidatePath(`/dashboard/community/${topicId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateComment(commentId: string, content: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_comments')
            .update({ content })
            .eq('id', commentId);
        if (error) throw error;
        // No path to revalidate easily for dynamic comments, client reload handles it
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
