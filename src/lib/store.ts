"use client";

// Types
export interface NewsItem {
    id: string;
    title: string;
    date: string;
    author: string;
    content: string;
    tags: string[];
}

export interface MembershipRequest {
    id: string;
    name: string;
    email: string;
    reason: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface CommunityPost {
    id: string;
    content: string;
    date: string;
    author: string; // "Anonymous" or Name
}

// Helpers
const STORAGE_KEYS = {
    NEWS: 'db_news',
    REQUESTS: 'db_requests',
    COMMUNITY: 'db_community',
};

const INITIAL_NEWS: NewsItem[] = [
    {
        id: '1',
        title: "Godišnja skupština Udruge",
        date: "28.01.2026.",
        author: "Predsjednik",
        content: "Pozivamo sve članove na redovnu godišnju skupštinu koja će se održati u društvenom domu.",
        tags: ["Obavijest"]
    }
];

// Store Implementation
export const db = {
    // NEWS
    getNews: (): NewsItem[] => {
        if (typeof window === 'undefined') return INITIAL_NEWS;
        const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
        return stored ? JSON.parse(stored) : INITIAL_NEWS;
    },
    addNews: (item: Omit<NewsItem, 'id' | 'date'>) => {
        const news = db.getNews();
        const newItem: NewsItem = {
            ...item,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('hr-HR'),
        };
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify([newItem, ...news]));
        return newItem;
    },

    // REQUESTS
    getRequests: (): MembershipRequest[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        return stored ? JSON.parse(stored) : [];
    },
    addRequest: (item: Omit<MembershipRequest, 'id' | 'date' | 'status'>) => {
        const requests = db.getRequests();
        const newItem: MembershipRequest = {
            ...item,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('hr-HR'),
            status: 'pending',
        };
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([newItem, ...requests]));
        return newItem;
    },

    // COMMUNITY POSTS
    getCommunityPosts: (): CommunityPost[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
        return stored ? JSON.parse(stored) : [];
    },
    addCommunityPost: (content: string) => {
        const posts = db.getCommunityPosts();
        // User asked for "Anonymous", so we hardcode the author or give option. 
        // We will default to "Anonimno" for this specific feature request.
        const newItem: CommunityPost = {
            id: Date.now().toString(),
            content,
            date: new Date().toLocaleDateString('hr-HR') + ' ' + new Date().toLocaleTimeString('hr-HR'),
            author: 'Anonimni Član',
        };
        localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify([newItem, ...posts]));
        return newItem;
    }
};
