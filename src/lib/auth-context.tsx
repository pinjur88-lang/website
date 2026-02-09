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
        // 1. Check LocalStorage (for Admin Backdoor)
        const storedUser = localStorage.getItem('mock_session');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed && parsed.id) {
                    setUser(parsed);
                } else {
                    localStorage.removeItem('mock_session');
                }
            } catch (e) {
                localStorage.removeItem('mock_session');
            }
        }

        // 2. Check Supabase Session (For Members)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // SECURITY: Double check approval status in requests table
                const { data: reqData } = await supabase
                    .from('requests')
                    .select('status')
                    .eq('email', session.user.email!)
                    .single();

                if (reqData && reqData.status !== 'approved') {
                    console.warn('User logged in but not approved (or revoked). Logging out.');
                    await supabase.auth.signOut();
                    setUser(null);
                    localStorage.removeItem('mock_session');
                    setIsLoading(false);
                    return;
                }

                // Check if user is the admin email
                const isAdmin = session.user.email === 'udrugabaljci@gmail.com';

                // Get profile details (tier)
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('membership_tier')
                    .eq('id', session.user.id)
                    .single();

                const memberUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata?.display_name || 'Član',
                    email: session.user.email!,
                    role: isAdmin ? 'admin' : 'member',
                    membership_tier: profileData?.membership_tier || 'free'
                };
                setUser(memberUser);
                localStorage.setItem('mock_session', JSON.stringify(memberUser));
            } else if (!storedUser) {
                // Only clear if not using backdoor
                setUser(null);
            }
            setIsLoading(false);
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
                    // Check if Admin to redirect properly
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();

                    if (profile?.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/dashboard');
                    }
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
