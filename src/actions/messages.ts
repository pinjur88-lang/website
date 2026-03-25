'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyUser } from '@/lib/auth-admin';
import { revalidatePath } from 'next/cache';

export type Message = {
    id: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    read: boolean;
};

export type ConversationPreview = {
    other_user_id: string;
    other_user_name: string;
    other_user_avatar?: string;
    other_user_role: string;
    last_message: string;
    last_message_date: string;
    unread_count: number;
};

// Send a new private message
export async function sendMessage(receiverId: string, content: string) {
    try {
        const user = await verifyUser();
        if (!user) throw new Error("Unauthorized");

        if (user.id === receiverId) {
            throw new Error("Ne možete poslati poruku sami sebi. (You cannot message yourself).");
        }

        const { data, error } = await supabaseAdmin
            .from('messages')
            .insert({
                sender_id: user.id,
                receiver_id: receiverId,
                content: content.trim(),
                read: false
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/dashboard/messages');
        revalidatePath(`/dashboard/messages/${receiverId}`);
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

// Fetch the complete message history with a specific user
export async function getMessagesHistory(otherUserId: string) {
    try {
        const user = await verifyUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: true }); // chronological order

        if (error) throw error;

        // Fetch the other user's profile to display their name/avatar at the top
        const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, display_name, avatar_url, role')
            .eq('id', otherUserId)
            .single();

        return { messages: data as Message[], otherUser: profileData };
    } catch (error: any) {
        return { error: error.message };
    }
}

// Mark messages from a specific sender to the current user as read
export async function markMessagesAsRead(senderId: string) {
    try {
        const user = await verifyUser();
        if (!user) return { error: "Unauthorized" };

        const { error } = await supabaseAdmin
            .from('messages')
            .update({ read: true })
            .eq('receiver_id', user.id)
            .eq('sender_id', senderId)
            .eq('read', false);

        if (error) throw error;
        
        revalidatePath('/dashboard/messages');
        revalidatePath(`/dashboard/messages/${senderId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

// Fetch the inbox view (list of unique conversations)
export async function getInboxConversations() {
    try {
        const user = await verifyUser();
        if (!user) throw new Error("Unauthorized");

        // Supabase doesn't easily support complex "GROUP BY" latest message natively in auto-generated REST unless we make an RPC view.
        // Instead, we will fetch all messages involving the user, and group them in the server logic.
        // This is safe assuming individual users don't have millions of DMs initially.
        const { data: messages, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Extract unique conversational partners and aggregate stats
        const conversationsMap = new Map<string, ConversationPreview>();
        const otherUserIds = new Set<string>();

        for (const msg of (messages as Message[])) {
            const isMeSender = msg.sender_id === user.id;
            const partnerId = isMeSender ? msg.receiver_id : msg.sender_id;

            otherUserIds.add(partnerId);

            if (!conversationsMap.has(partnerId)) {
                conversationsMap.set(partnerId, {
                    other_user_id: partnerId,
                    other_user_name: 'Učitavanje...',
                    other_user_role: 'user',
                    last_message: msg.content,
                    last_message_date: msg.created_at,
                    unread_count: 0
                });
            }

            // If the message is sent TO the current user and unread, count it
            if (!isMeSender && !msg.read) {
                const conv = conversationsMap.get(partnerId)!;
                conv.unread_count += 1;
            }
        }

        const conversationsList = Array.from(conversationsMap.values());

        // Fetch profiles of all partners to get names and avatars
        if (otherUserIds.size > 0) {
            const { data: profiles } = await supabaseAdmin
                .from('profiles')
                .select('id, full_name, display_name, avatar_url, role')
                .in('id', Array.from(otherUserIds));

            if (profiles) {
                const profileMap = new Map(profiles.map(p => [p.id, p]));
                for (const conv of conversationsList) {
                    const profile = profileMap.get(conv.other_user_id);
                    if (profile) {
                        conv.other_user_name = profile.display_name || profile.full_name || 'Korisnik';
                        conv.other_user_avatar = profile.avatar_url;
                        conv.other_user_role = profile.role;
                    } else {
                        conv.other_user_name = 'Obrisan Korisnik';
                    }
                }
            }
        }

        return { data: conversationsList };
    } catch (error: any) {
        return { error: error.message };
    }
}
