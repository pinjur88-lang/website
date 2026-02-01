'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

// SERVER ACTIONS
// These run on the server. We use the Admin client to bypass RLS for CMS operations.
// This ensures the "Backdoor Admin" and regular admins can manage content without RLS issues.

import { verifyAdmin, verifyUser } from '@/lib/auth-admin';

// SERVER ACTIONS
// These run on the server. We use the Admin client to bypass RLS for CMS operations.
// This ensures the "Backdoor Admin" and regular admins can manage content without RLS issues.

export async function createAnnouncement(title: string, content: string, authorId: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    if (!title || !content) {
        return { error: "Title and content are required" };
    }

    try {
        const payload: any = { title, content };
        // Only attach author_id if it's a valid UUID (not "admin-master")
        // This relies on the DB column being nullable for system posts.
        if (authorId && authorId !== 'admin-master') {
            payload.author_id = authorId;
        }

        const { data, error } = await supabaseAdmin
            .from('announcements')
            .insert([payload])
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
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
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
    // Public read is fine, or restricted to members?
    // Announcements are usually public or member-only. 
    // Since we use this on dashboard it implies member-only but the fetching itself isn't dangerous.
    const { data, error } = await supabaseAdmin
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
    const isAdmin = await verifyAdmin();
    const user = await verifyUser();

    if (!user) return { error: "Unauthorized" };

    try {
        // If not admin, check ownership
        if (!isAdmin) {
            const { data: img } = await supabaseAdmin.from('gallery_images').select('uploaded_by, album_id').eq('id', id).single();
            // Check if user uploaded image OR created the album
            if (!img) return { error: "Image not found" };

            const { data: album } = await supabaseAdmin.from('albums').select('created_by').eq('id', img.album_id).single();

            if (img.uploaded_by !== user.id && album?.created_by !== user.id) {
                return { error: "Unauthorized" };
            }
        }

        const { error } = await supabaseAdmin
            .from('gallery_images')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateGalleryImageCaption(id: string, caption: string) {
    const isAdmin = await verifyAdmin();
    const user = await verifyUser();
    if (!user) return { error: "Unauthorized" };

    try {
        if (!isAdmin) {
            const { data: img } = await supabaseAdmin.from('gallery_images').select('uploaded_by, album_id').eq('id', id).single();
            if (!img) return { error: "Image not found" };
            const { data: album } = await supabaseAdmin.from('albums').select('created_by').eq('id', img.album_id).single();

            if (img.uploaded_by !== user.id && album?.created_by !== user.id) {
                return { error: "Unauthorized" };
            }
        }

        const { error } = await supabaseAdmin
            .from('gallery_images')
            .update({ caption })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}


// For Upload, it's easier to do it client-side to Storage, then save URL to DB.
export async function saveGalleryImageRef(url: string, caption?: string) {
    const user = await verifyUser();
    if (!user) return { error: "Unauthorized" };

    try {
        const { data, error } = await supabaseAdmin
            .from('gallery_images')
            .insert([{ url, caption }]) // This function seems deprecated or unused in new flow? New flow uses saveAlbumImageRef
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getGalleryImages(albumId?: string) {
    let query = supabaseAdmin
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

    if (albumId) {
        query = query.eq('album_id', albumId);
    }

    const { data, error } = await query;

    if (error) return { error: error.message };
    return { data };
}

// ALBUM ACTIONS

export async function createAlbum(title: string, userId: string) {
    if (!title) return { error: "Title is required" };
    const user = await verifyUser();
    if (!user) return { error: "Unauthorized" };

    try {
        const payload: any = { title };
        if (userId && userId !== 'admin-master') {
            payload.created_by = userId;
        }

        const { data, error } = await supabaseAdmin
            .from('albums')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getAlbums() {
    const { data, error } = await supabaseAdmin
        .from('albums')
        .select(`
            *,
            creator:profiles(display_name),
            image_count:gallery_images(count)
        `)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };

    // Transform count from array to number if needed, usually supbase returns weird format for counts
    return { data };
}

export async function deleteAlbum(id: string) {
    const isAdmin = await verifyAdmin();
    // Allow album owner to delete?
    const user = await verifyUser();

    if (!user) return { error: "Unauthorized" };

    try {
        if (!isAdmin) {
            const { data: album } = await supabaseAdmin.from('albums').select('created_by').eq('id', id).single();
            if (!album || album.created_by !== user.id) return { error: "Unauthorized" };
        }

        const { error } = await supabaseAdmin
            .from('albums')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveAlbumImageRef(url: string, albumId: string, userId: string, caption?: string) {
    const user = await verifyUser();
    if (!user) return { error: "Unauthorized" };

    try {
        const payload: any = { url, caption, album_id: albumId };
        if (userId && userId !== 'admin-master') {
            payload.uploaded_by = userId;
        }

        const { data, error } = await supabaseAdmin
            .from('gallery_images')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}
