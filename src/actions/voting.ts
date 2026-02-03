'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getPolls() {
    // Get polls and their vote counts
    const { data: polls, error } = await supabase
        .from('polls')
        .select(`
            *,
            votes:poll_votes(option_index)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching polls:', error);
        return { data: null, error: error.message };
    }

    // Process polls to include result counts
    const processedPolls = (polls as any[]).map(poll => {
        const results = new Array(poll.options.length).fill(0);
        poll.votes?.forEach((v: any) => {
            if (v.option_index >= 0 && v.option_index < results.length) {
                results[v.option_index]++;
            }
        });

        return {
            ...poll,
            totalVotes: poll.votes?.length || 0,
            results
        };
    });

    return { data: processedPolls, error: null };
}

export async function castVote(pollId: string, optionIndex: number) {
    // Get current user session from supabase but use admin for DB operations if needed
    // Actually, we can use the regular supabase client if the policies are set up correctly.
    // But for simplicity in server actions, let's stick to supabaseAdmin for write operations.

    const { data: { user }, error: authError } = await (await supabase.auth.getUser());
    if (authError || !user) return { error: 'Unauthorized' };

    // Check membership tier via profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('membership_tier, role')
        .eq('id', user.id)
        .single();

    const isSilverOrBetter = profile?.membership_tier === 'silver' || profile?.membership_tier === 'gold' || profile?.role === 'admin';

    if (!isSilverOrBetter) {
        return { error: 'Upgrade to Silver to vote' };
    }

    // Insert vote
    const { error: voteError } = await supabase
        .from('poll_votes')
        .insert([{
            poll_id: pollId,
            user_id: user.id,
            option_index: optionIndex
        }]);

    if (voteError) {
        if (voteError.code === '23505') return { error: 'Već ste glasali u ovoj anketi' };
        return { error: voteError.message };
    }

    revalidatePath('/dashboard/voting');
    return { success: true };
}

export async function getUserVote(pollId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null };

    const { data, error } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

    if (error) return { data: null };
    return { data: data.option_index };
}
