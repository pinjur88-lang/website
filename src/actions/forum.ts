'use server';

import { supabaseAdmin } from '@/lib/supabase-admin'; // Using admin to ensure we can join tables easily, RLS checked via user_id matching if needed, but for public read it's fine.
// Actually, better to use standard supabase client if possible for RLS, but for "Join" queries sometimes admin is easier.
// Let's stick to supabaseAdmin for consistency with other actions if valid, OR better: use consistent read patterns.
// For comments, we want everyone to read.
import { revalidatePath } from 'next/cache';

// Re-using simplified types for the frontend
export type Topic = {
    id: string;
    title: string;
    content: string;
    author_name: string;
    created_at: string;
    created_by: string;
    comment_count?: number;
};

export type Comment = {
    id: string;
    content: string;
    author_name: string;
    created_at: string;
    created_by: string;
};

export async function getTopics() {
    try {
        // Fetch posts (topics) and join profiles
        // Also we want comment counts. Supabase requires a separate RPC or subquery for counts usually,
        // or we fetch all and count. For MVP, fetching all comments is heavy.
        // Let's just fetch posts for now.
        const { data, error } = await supabaseAdmin
            .from('community_posts')
            .select(`
                id,
                content,
                created_at,
                created_by,
                profiles(display_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Note: community_posts content is used as the "Thread Title/Content" combined.
        // In a full forum, we might have separate Title. We will treat the first few words as title.

        const topics: Topic[] = data.map((post: any) => ({
            id: post.id,
            title: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
            content: post.content,
            author_name: post.profiles?.display_name || 'Nepoznato',
            created_at: post.created_at,
            created_by: post.created_by
        }));

        return { data: topics };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getTopicDetail(topicId: string) {
    try {
        const { data: topic, error: topicError } = await supabaseAdmin
            .from('community_posts')
            .select(`
                id,
                content,
                created_at,
                created_by,
                profiles(display_name)
            `)
            .eq('id', topicId)
            .single();

        if (topicError) throw topicError;

        const { data: comments, error: commentsError } = await supabaseAdmin
            .from('community_comments')
            .select(`
                id,
                content,
                created_at,
                user_id,
                profiles(display_name)
            `)
            .eq('post_id', topicId)
            .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        const formattedTopic: Topic = {
            id: topic.id,
            title: topic.content,
            content: topic.content,
            author_name: Array.isArray(topic.profiles) ? (topic.profiles[0] as any)?.display_name : (topic.profiles as any)?.display_name || 'Nepoznato',
            created_at: topic.created_at,
            created_by: topic.created_by
        };

        const formattedComments: Comment[] = comments.map((c: any) => ({
            id: c.id,
            content: c.content,
            author_name: Array.isArray(c.profiles) ? (c.profiles[0] as any)?.display_name : (c.profiles as any)?.display_name || 'Nepoznato',
            created_at: c.created_at,
            created_by: c.user_id
        }));

        return { topic: formattedTopic, comments: formattedComments };

    } catch (error: any) {
        return { error: error.message };
    }
}

// NOTE: addComment is better handled client-side like addVisit to avoid auth issues!
// We will only use server actions for fetching data here.
