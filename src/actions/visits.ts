'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addVisit(startDate: string, endDate: string) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('visits')
            .insert({
                user_id: user.id,
                start_date: startDate,
                end_date: endDate
            });

        if (error) throw error;
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function getVisits() {
    try {
        const { data, error } = await supabase
            .from('visits')
            .select(`
                id,
                start_date,
                end_date,
                user_id,
                user:profiles(display_name)
            `)
            .gte('end_date', new Date().toISOString().split('T')[0]) // Only future/current visits
            .order('start_date', { ascending: true });

        if (error) throw error;

        // Map to simpler structure
        const visits = data.map((visit: any) => ({
            id: visit.id,
            userId: visit.user_id,
            userName: visit.user?.display_name || 'Nepoznato',
            startDate: visit.start_date,
            endDate: visit.end_date
        }));

        return { data: visits };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteVisit(visitId: string) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from('visits')
            .delete()
            .eq('id', visitId)
            .eq('user_id', user.id); // RLS redundancy for safety

        if (error) throw error;
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
