"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    membership_tier: 'free' | 'silver' | 'gold';
    status: 'pending' | 'approved' | 'rejected' | 'registered' | string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<{ error: string | null }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. Check Supabase Session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (session?.user) {
                    // SECURITY: Double check approval status in requests table
                    const { data: reqData, error: reqError } = await supabase
                        .from('requests')
                        .select('status')
                        .eq('email', session.user.email!)
                        .maybeSingle(); // Use maybeSingle to avoid 406 if not found

                    if (reqData) {
                        // We no longer forcefully log out unapproved users.
                        // We will handle their access visually in the dashboard layout.
                    }

                    // Check if user is the admin email
                    const isAdmin = session.user.email === 'udrugabaljci@gmail.com';

                    // Get profile details (tier)
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('membership_tier')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    const memberUser: User = {
                        id: session.user.id,
                        name: session.user.user_metadata?.display_name || 'Član',
                        email: session.user.email!,
                        role: isAdmin ? 'admin' : 'member',
                        membership_tier: profileData?.membership_tier || 'free',
                        status: reqData?.status || 'pending'
                    };
                    setUser(memberUser);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth State Check Error:", err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password?: string) => {
        setIsLoading(true);

        try {
            // 1. Supabase Auth
            if (password) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    console.error("Login failed:", error.message);
                    return { error: error.message };
                }

                if (data.user) {
                    // We no longer push to router here. 
                    // login/page.tsx's useEffect will natively catch the populated user and redirect.
                    return { error: null };
                }
            }

            return { error: "Lozinka je obavezna" };

        } catch (error: any) {
            console.error(error);
            return { error: error.message || "Nepoznata greška" };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mock_session');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
