'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export type Clan = {
    id: string;
    surname: string;

    prevalence_hr: string;
    world_distribution_hr: string;
    description_hr: string;

    prevalence_en: string;
    world_distribution_en: string;
    description_en: string;

    prevalence_de: string;
    world_distribution_de: string;
    description_de: string;

    coat_of_arms_url?: string;
};

export async function getClans(searchQuery?: string) {
    try {
        let query = supabaseAdmin
            .from('clans')
            .select('*')
            .order('surname', { ascending: true });

        if (searchQuery) {
            query = query.ilike('surname', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { data: data as Clan[] };
    } catch (error: any) {
        console.error("Fetch clans error:", error);
        return { error: error.message };
    }
}

export async function getClanById(id: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('clans')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data: data as Clan };
    } catch (error: any) {
        console.error("Fetch clan error:", error);
        return { error: error.message };
    }
}
