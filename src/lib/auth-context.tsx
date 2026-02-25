"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';
import { getUserStatus } from '@/actions/admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    membership_tier: 'free' | 'supporter' | 'voting';
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
        // Create an async helper to handle session logic
        const handleSession = async (session: any) => {
            try {
                if (session?.user) {
                    // 1. Check if user is the admin email fallback
                    const isEmailAdmin = session.user.email === 'udrugabaljci@gmail.com';

                    // 2. Fetch profile data (role, tier)
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('membership_tier, role')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profileError) {
                        console.error("Error fetching profile:", profileError);
                    }

                    // 3. Double check approval status in requests table
                    const { data: reqData } = await supabase
                        .from('requests')
                        .select('status')
                        .eq('email', session.user.email!)
                        .maybeSingle();

                    if (reqData && reqData.status !== 'approved' && !isEmailAdmin) {
                        console.warn('User logged in but not approved. Logging out.');
                        await supabase.auth.signOut();
                        setUser(null);
                        return;
                    }

                    const isProfileAdmin = profileData?.role === 'admin';
                    const finalRole = (isEmailAdmin || isProfileAdmin) ? 'admin' : 'member';

                    const memberUser: User = {
                        id: session.user.id,
                        name: session.user.user_metadata?.display_name || 'Član',
                        email: session.user.email!,
                        role: finalRole,
                        membership_tier: profileData?.membership_tier || 'free',
                        status: reqData?.status || 'pending'
                    };
                    setUser(memberUser);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth State Check Error:", err);
            } finally {
                setIsLoading(false); // ALWAYS set loading to false
            }
        };

        // 1. Check Initial Session explicitly to avoid hanging loading states
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
        });

        // 2. Listen to subsequent Auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION') return; // Handled by getSession above
            handleSession(session);
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
                    // No redirect here - handleSession will catch state change and login/page.tsx will redirect
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

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("Logout Error:", err);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
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
