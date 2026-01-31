
import { supabase } from '@/lib/supabase';

// CLIENT-SIDE HELPERS (Protected by RLS)

export async function createCommunityPost(content: string, authorId: string, isAnonymous: boolean) {
    if (!content) {
        return { error: "Content cannot be empty" };
    }

    try {
        const { data, error } = await supabase
            .from('community_posts')
            .insert([{
                content,
                author_id: authorId,
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
                author:profiles(display_name)
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
