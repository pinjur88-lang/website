import { supabase } from './supabase';

// Types
export interface NewsItem {
    id: string;
    title: string;
    date: string; // Display date
    author: string;
    content: string;
    tags: string[];
    created_at?: string;
}

export interface MembershipRequest {
    id: string;
    name: string;
    email: string;
    reason: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at?: string;
}

export interface CommunityPost {
    id: string;
    content: string;
    date: string;
    author: string;
    created_at?: string;
}

// Helper to format date
const formatDate = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleDateString('hr-HR');
    return new Date(isoString).toLocaleDateString('hr-HR');
};

const formatDateTime = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleString('hr-HR');
    return new Date(isoString).toLocaleString('hr-HR');
};

export const db = {
    // NEWS
    getNews: async (): Promise<NewsItem[]> => {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching news:', error);
            return [];
        }

        return data.map((item: any) => ({
            ...item,
            date: formatDate(item.created_at),
        }));
    },
    addNews: async (item: Omit<NewsItem, 'id' | 'date'>) => {
        const { data, error } = await supabase
            .from('news')
            .insert([{
                title: item.title,
                content: item.content,
                author: item.author,
                tags: item.tags
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // REQUESTS
    getRequests: async (): Promise<MembershipRequest[]> => {
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }
        return data.map((item: any) => ({
            ...item,
            date: formatDate(item.created_at),
        }));
    },
    addRequest: async (item: Omit<MembershipRequest, 'id' | 'date' | 'status'>) => {
        const { error } = await supabase
            .from('requests')
            .insert([{
                name: item.name,
                email: item.email,
                reason: item.reason,
                status: 'pending'
            }]);
        if (error) throw error;
    },

    // COMMUNITY
    getCommunityPosts: async (): Promise<CommunityPost[]> => {
        const { data, error } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return [];
        }

        return data.map((item: any) => ({
            ...item,
            date: formatDateTime(item.created_at),
        }));
    },
    addCommunityPost: async (content: string) => {
        const { error } = await supabase
            .from('community_posts')
            .insert([{
                content,
                author: 'Anonimni Član'
            }]);
        if (error) throw error;
    }
};
