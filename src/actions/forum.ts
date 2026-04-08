'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { verifyUser } from '@/lib/auth-admin';

interface ForumProfile {
    id: string;
    full_name?: string;
    role?: string;
    membership_tier?: string;
    donor_tier?: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
}

export type Topic = {
    id: string;
    title: string;
    content: string;
    author_name: string;
    author_role?: string;
    author_membership_tier?: string;
    author_donor_tier?: string;
    author_avatar_url?: string;
    author_bio?: string;
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
    author_avatar_url?: string;
    author_bio?: string;
    created_at: string;
    created_by: string;
    is_anonymous?: boolean;
};

export async function getTopics() {
    try {
        const { data: posts, error: postsError } = await supabaseAdmin
            .from('community_posts')
            .select(`
                id,
                content,
                created_at,
                user_id,
                is_anonymous
            `)
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        if (!posts || posts.length === 0) {
            return { data: [] };
        }

        const userIds = Array.from(new Set(posts.map((p: { user_id: string }) => p.user_id).filter(Boolean)));

        const profileMap = new Map<string, ForumProfile>();
        if (userIds.length > 0) {
            const { data: profilesData } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, role, membership_tier, donor_tier, display_name, avatar_url, bio')
                .in('id', userIds);

            if (profilesData) {
                profilesData.forEach((p: ForumProfile) => profileMap.set(p.id, p));
            }
        }

        const topics: Topic[] = posts.map((post: { id: string; content: string; created_at: string; user_id: string; is_anonymous?: boolean }) => {
            const isAnon = post.is_anonymous === true;
            const profile = profileMap.get(post.user_id);
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
                author_avatar_url: isAnon ? undefined : profile?.avatar_url,
                author_bio: isAnon ? undefined : profile?.bio,
                created_at: post.created_at,
                created_by: post.user_id,
                is_anonymous: isAnon
            };
        });

        return { data: topics };
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" };
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
                user_id,
                is_anonymous
            `)
            .eq('id', topicId)
            .single();

        if (topicError) throw topicError;
        if (!topic) throw new Error("Tema nije pronađena");

        const { data: comments, error: commentsError } = await supabaseAdmin
            .from('community_comments')
            .select(`
                id,
                content,
                created_at,
                user_id,
                is_anonymous
            `)
            .eq('post_id', topicId)
            .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        const userIds = Array.from(new Set([
            topic.user_id,
            ...(comments || []).map((c: { user_id: string }) => c.user_id)
        ].filter(Boolean)));

        const profileMap = new Map<string, ForumProfile>();
        if (userIds.length > 0) {
            const { data: profilesData } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, role, membership_tier, donor_tier, display_name, avatar_url, bio')
                .in('id', userIds);

            if (profilesData) {
                profilesData.forEach((p: ForumProfile) => profileMap.set(p.id, p));
            }
        }

        const isTopicAnon = topic.is_anonymous === true;
        const topicProfile = profileMap.get(topic.user_id);
        const topicDisplayName = isTopicAnon ? 'Anonimni Član' : (topicProfile?.full_name || topicProfile?.display_name || 'Član Udruge');

        const formattedTopic: Topic = {
            id: topic.id,
            title: topic.content,
            content: topic.content,
            author_name: topicDisplayName,
            author_role: isTopicAnon ? 'user' : (topicProfile?.role || 'user'),
            author_membership_tier: isTopicAnon ? undefined : topicProfile?.membership_tier,
            author_donor_tier: isTopicAnon ? undefined : topicProfile?.donor_tier,
            author_avatar_url: isTopicAnon ? undefined : topicProfile?.avatar_url,
            author_bio: isTopicAnon ? undefined : topicProfile?.bio,
            created_at: topic.created_at,
            created_by: topic.user_id,
            is_anonymous: isTopicAnon
        };

        const formattedComments: Comment[] = (comments || []).map((c: { id: string; content: string; created_at: string; user_id: string; is_anonymous?: boolean }) => {
            const isCommentAnon = c.is_anonymous === true;
            const commentProfile = profileMap.get(c.user_id);
            return {
                id: c.id,
                content: c.content,
                author_name: isCommentAnon ? 'Anonimni Član' : (commentProfile?.full_name || commentProfile?.display_name || 'Član Udruge'),
                author_role: isCommentAnon ? 'user' : (commentProfile?.role || 'user'),
                author_membership_tier: isCommentAnon ? undefined : commentProfile?.membership_tier,
                author_donor_tier: isCommentAnon ? undefined : commentProfile?.donor_tier,
                author_avatar_url: isCommentAnon ? undefined : commentProfile?.avatar_url,
                author_bio: isCommentAnon ? undefined : commentProfile?.bio,
                created_at: c.created_at,
                created_by: c.user_id,
                is_anonymous: isCommentAnon
            };
        });

        return { topic: formattedTopic, comments: formattedComments };

    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}

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
    } catch (error: unknown) {
        console.error("Create topic error:", error);
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}
