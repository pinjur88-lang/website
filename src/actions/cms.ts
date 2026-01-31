
import { supabase } from '@/lib/supabase';

// CLIENT-SIDE HELPERS (Protected by RLS)
// These run in the browser and use the authenticated user's session.

export async function createAnnouncement(title: string, content: string, authorId: string) {
    if (!title || !content) {
        return { error: "Title and content are required" };
    }

    try {
        const { data, error } = await supabase
            .from('announcements')
            .insert([{ title, content, author_id: authorId }])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        console.error("Create announcement error:", error);
        return { error: error.message };
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getAnnouncements() {
    const { data, error } = await supabase
        .from('announcements')
        .select(`
            *,
            author:profiles(display_name)
        `)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function deleteGalleryImage(id: string) {
    try {
        const { error } = await supabase
            .from('gallery_images')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

// For Upload, it's easier to do it client-side to Storage, then save URL to DB.
export async function saveGalleryImageRef(url: string, caption?: string) {
    try {
        const { data, error } = await supabase
            .from('gallery_images')
            .insert([{ url, caption }])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getGalleryImages() {
    const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}
