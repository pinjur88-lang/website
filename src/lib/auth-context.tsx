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
<<<<<<< HEAD
        // Create an async helper to handle session logic
        const handleSession = async (session: any) => {
            try {
                if (session?.user) {
                    const userStatus = await getUserStatus(session.user.email!);
                    const isAdmin = session.user.email === 'udrugabaljci@gmail.com';

                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('membership_tier, role')
                        .eq('id', session.user.id)
                        .maybeSingle();
=======
        // 2. Check Supabase Session (For Members)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // SECURITY: Double check approval status in requests table
                const { data: reqData } = await supabase
                    .from('requests')
                    .select('status')
                    .eq('email', session.user.email!)
                    .single();
>>>>>>> d4417a2 (feat: Anonymous posting, DB fixes, UX/Reliability improvements)

                    if (profileError) {
                        console.error("Error fetching profile:", profileError);
                    }

                    const isProfileAdmin = profileData?.role === 'admin';
                    const finalRole = (isAdmin || isProfileAdmin) ? 'admin' : 'member';

                    const memberUser: User = {
                        id: session.user.id,
                        name: session.user.user_metadata?.display_name || 'Član',
                        email: session.user.email!,
                        role: finalRole,
                        membership_tier: profileData?.membership_tier || 'free',
                        status: userStatus || 'pending'
                    };
                    setUser(memberUser);
                } else {
                    setUser(null);
<<<<<<< HEAD
                }
            } catch (err) {
                console.error("Auth State Check Error:", err);
=======
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
            } else {
>>>>>>> d4417a2 (feat: Anonymous posting, DB fixes, UX/Reliability improvements)
                setUser(null);
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
<<<<<<< HEAD
                    // We no longer push to router here. 
                    // login/page.tsx's useEffect will natively catch the populated user and redirect.
=======
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
>>>>>>> d4417a2 (feat: Anonymous posting, DB fixes, UX/Reliability improvements)
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
