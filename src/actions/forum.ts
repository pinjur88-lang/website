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
    author_role?: string;
    author_membership_tier?: string;
    author_donor_tier?: string;
    created_at: string;
    created_by: string;
    comment_count?: number;
    is_anonymous?: boolean;
};

export type Comment = {
    id: string;
    content: string;
    author_name: string;
    author_role?: string;
    author_membership_tier?: string;
    author_donor_tier?: string;
    created_at: string;
    created_by: string;
    is_anonymous?: boolean;
};

export async function getTopics() {
    try {
        // 1. Fetch posts with profile join for performance (if possible)
        const { data: posts, error: postsError } = await supabaseAdmin
            .from('community_posts')
            .select(`
                id,
                content,
                created_at,
                user_id,
                is_anonymous,
                profiles!user_id(full_name, role, membership_tier, donor_tier, display_name)
            `)
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        if (!posts || posts.length === 0) {
            return { data: [] };
        }

        // 3. Map together
        const topics: Topic[] = posts.map((post: any) => {
            const isAnon = post.is_anonymous === true;
            const profile = post.profiles; // From join
            const displayName = isAnon ? 'Anonimni Član' : (profile?.full_name || profile?.display_name || 'Član Udruge');
            const role = isAnon ? 'user' : (profile?.role || 'user');

            return {
                id: post.id,
                title: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
                content: post.content,
                author_name: displayName,
                author_role: role,
                author_membership_tier: isAnon ? undefined : profile?.membership_tier,
                author_donor_tier: isAnon ? undefined : profile?.donor_tier,
                created_at: post.created_at,
                created_by: post.user_id,
                is_anonymous: isAnon
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
            .select(`
                id,
                content,
                created_at,
                user_id,
                is_anonymous,
                profiles!user_id(full_name, role, membership_tier, donor_tier, display_name)
            `)
            .eq('id', topicId)
            .single();

        if (topicError) throw topicError;
        if (!topic) throw new Error("Topic not found");

        // 2. Fetch Comments
        const { data: comments, error: commentsError } = await supabaseAdmin
            .from('community_comments')
            .select(`
                id,
                content,
                created_at,
                user_id,
                is_anonymous,
                profiles!user_id(full_name, role, membership_tier, donor_tier, display_name)
            `)
            .eq('post_id', topicId)
            .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        // 3. Format Output
        const isTopicAnon = topic.is_anonymous === true;
        const topicProfile: any = Array.isArray(topic.profiles) ? topic.profiles[0] : topic.profiles;
        const topicDisplayName = isTopicAnon ? 'Anonimni Član' : (topicProfile?.full_name || topicProfile?.display_name || 'Član Udruge');

        const formattedTopic: Topic = {
            id: topic.id,
            title: topic.content,
            content: topic.content,
            author_name: topicDisplayName,
            author_role: isTopicAnon ? 'user' : (topicProfile?.role || 'user'),
            author_membership_tier: isTopicAnon ? undefined : topicProfile?.membership_tier,
            author_donor_tier: isTopicAnon ? undefined : topicProfile?.donor_tier,
            created_at: topic.created_at,
            created_by: topic.user_id,
            is_anonymous: isTopicAnon
        };

        const formattedComments: Comment[] = (comments || []).map((c: any) => {
            const isCommentAnon = c.is_anonymous === true;
            const commentProfile: any = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
            return {
                id: c.id,
                content: c.content,
                author_name: isCommentAnon ? 'Anonimni Član' : (commentProfile?.full_name || commentProfile?.display_name || 'Član Udruge'),
                author_role: isCommentAnon ? 'user' : (commentProfile?.role || 'user'),
                author_membership_tier: isCommentAnon ? undefined : commentProfile?.membership_tier,
                author_donor_tier: isCommentAnon ? undefined : commentProfile?.donor_tier,
                created_at: c.created_at,
                created_by: c.user_id,
                is_anonymous: isCommentAnon
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
