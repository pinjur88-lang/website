
import { supabase } from '@/lib/supabase';

// CLIENT-SIDE HELPERS (Protected by RLS)

export async function createCommunityPost(content: string, authorId: string, isAnonymous: boolean) {
    if (!content) {
        return { error: "Content cannot be empty" };
    }

    if (!authorId) {
        console.error("createCommunityPost called without authorId!");
        return { error: "Author ID is missing" };
    }

    console.log(`Creating post for author: ${authorId}, content: ${content.substring(0, 20)}...`);

    try {
        const { data, error } = await supabase
            .from('community_posts')
            .insert([{
                content,
                user_id: authorId,   // Keep for compatibility if needed
                author_id: authorId, // Fix: Error says this is required
                is_anonymous: isAnonymous
            }])
            .select()
            .single();

        if (error) throw error;
        return { data };
    } catch (error: any) {
        console.error("Create post error:", error);
        return { error: error.message };
    }
}

export async function getCommunityPosts() {
    try {
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                id,
                content,
                is_anonymous,
                created_at,
                user_id,
                author:profiles!user_id(display_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Process anonymity
        const posts = data.map((post: any) => ({
            id: post.id,
            content: post.content,
            created_at: post.created_at,
            author_name: post.is_anonymous ? 'Anonimni Član' : (post.author?.display_name || 'Nepoznato')
        }));

        return { data: posts };
    } catch (error: any) {
        console.error("Fetch posts error:", error);
        return { error: error.message };
    }
}
