'use server';

import { supabaseAdmin } from '@/lib/supabase-admin'; // Using admin to ensure we can join tables easily, RLS checked via user_id matching if needed, but for public read it's fine.
// Actually, better to use standard supabase client if possible for RLS, but for "Join" queries sometimes admin is easier.
// Let's stick to supabaseAdmin for consistency with other actions if valid, OR better: use consistent read patterns.
import { revalidatePath } from 'next/cache';
import { verifyUser } from '@/lib/auth-admin';

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
        // 1. Fetch posts without joining profiles
        const { data: posts, error: postsError } = await supabaseAdmin
            .from('community_posts')
            .select('id, content, created_at, user_id, author_id, is_anonymous')
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        if (!posts || posts.length === 0) {
            return { data: [] };
        }

        // 2. Fetch profiles for these users
        // Get unique user IDs, excluding anonymous posts if needed (but currently we show them just don't map name)
        const userIds = Array.from(new Set(posts.map(p => p.user_id).filter(Boolean)));

        let profilesMap: Record<string, string> = {};
        if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabaseAdmin
                .from('profiles')
                .select('id, display_name')
                .in('id', userIds);

            if (!profilesError && profiles) {
                profilesMap = profiles.reduce((acc, profile) => {
                    acc[profile.id] = profile.display_name;
                    return acc;
                }, {} as Record<string, string>);
            }
        }

        // 3. Map together
        const topics: Topic[] = posts.map((post: any) => {
            const isAnon = post.is_anonymous === true;
            const displayName = isAnon ? 'Anonymous' : (profilesMap[post.user_id] || 'Član Udruge');

            return {
                id: post.id,
                title: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
                content: post.content,
                author_name: displayName,
                created_at: post.created_at,
                created_by: post.user_id
            };
        });

        return { data: topics };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getTopicDetail(topicId: string) {
    try {
        // 1. Fetch Topic
        const { data: topic, error: topicError } = await supabaseAdmin
            .from('community_posts')
            .select('id, content, created_at, user_id, author_id, is_anonymous')
            .eq('id', topicId)
            .single();

        if (topicError) throw topicError;
        if (!topic) throw new Error("Topic not found");

        // 2. Fetch Comments
        const { data: comments, error: commentsError } = await supabaseAdmin
            .from('community_comments')
            .select('id, content, created_at, user_id, author_id')
            .eq('post_id', topicId)
            .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        // 3. Fetch Profiles for both topic and comments
        const userIds = new Set<string>();
        if (topic.user_id) userIds.add(topic.user_id);
        if (comments) {
            comments.forEach(c => {
                if (c.user_id) userIds.add(c.user_id);
            });
        }

        let profilesMap: Record<string, string> = {};
        if (userIds.size > 0) {
            const { data: profiles, error: profilesError } = await supabaseAdmin
                .from('profiles')
                .select('id, display_name')
                .in('id', Array.from(userIds));

            if (!profilesError && profiles) {
                profilesMap = profiles.reduce((acc, profile) => {
                    acc[profile.id] = profile.display_name;
                    return acc;
                }, {} as Record<string, string>);
            }
        }

        // 4. Format Output
        const isTopicAnon = topic.is_anonymous === true;
        const topicDisplayName = isTopicAnon ? 'Anonymous' : (profilesMap[topic.user_id] || 'Član Udruge');

        const formattedTopic: Topic = {
            id: topic.id,
            title: topic.content,
            content: topic.content,
            author_name: topicDisplayName,
            created_at: topic.created_at,
            created_by: topic.user_id
        };

        const formattedComments: Comment[] = (comments || []).map((c: any) => {
            return {
                id: c.id,
                content: c.content,
                author_name: profilesMap[c.user_id] || 'Član Udruge',
                created_at: c.created_at,
                created_by: c.user_id
            };
        });

        return { topic: formattedTopic, comments: formattedComments };

    } catch (error: any) {
        return { error: error.message };
    }
}

// NOTE: addComment is better handled client-side like addVisit to avoid auth issues!
// We will only use server actions for fetching data here.

export async function createTopic(content: string, authorId: string, isAnonymous: boolean) {
    try {
        const user = await verifyUser();
        if (!user || user.id !== authorId) {
            throw new Error("Unauthorized");
        }

        if (!content) throw new Error("Sadržaj ne može biti prazan");
        if (!authorId) throw new Error("Nedostaje ID autora");

        const { data, error } = await supabaseAdmin
            .from('community_posts')
            .insert([{
                content,
                user_id: authorId,
                author_id: authorId,
                is_anonymous: isAnonymous
            }])
            .select()
            .single();

        if (error) {
            console.error("DEBUG: Insert topic error:", error);
            throw error;
        }

        console.log("DEBUG: Post created successfully:", data.id);

        revalidatePath('/dashboard/community');
        return { data };
    } catch (error: any) {
        console.error("Create topic error:", error);
        return { error: error.message };
    }
}
