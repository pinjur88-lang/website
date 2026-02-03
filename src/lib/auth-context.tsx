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
            setUser(JSON.parse(storedUser));
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
            // 1. BACKDOOR: Admin Shared Password
            if (email === 'udrugabaljci@gmail.com' && password === 'Jojlolomoj2026!') {
                // We MUST sign in to Supabase to appease the Middleware
                const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (sbError) {
                    console.error("Admin Supabase Login Failed:", sbError.message);
                    // Decide: do we let them in anyway? 
                    // NO. If we do, Middleware will bounce them back. 
                    // We must treat this as a failure or the Middleware needs to be relaxed.
                    // For now, let's show the error so the user knows WHY it is failing.
                    return { error: `Admin Sync Error: ${sbError.message}` };
                }

                const adminUser: User = {
                    id: sbData.user?.id || 'admin-master',
                    name: 'Administrator',
                    email,
                    role: 'admin',
                    membership_tier: 'gold' // Admins are always top tier
                };
                setUser(adminUser);
                localStorage.setItem('mock_session', JSON.stringify(adminUser));
                setIsLoading(false);
                router.push('/admin');
                return { error: null };
            }

            // 2. REAL AUTH: For Members (Supabase)
            if (password) {
                // Attempt Supabase Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    console.error("Login failed:", error.message);
                    return { error: error.message };
                }

                if (data.user) {
                    // SUCCESS - Redirect immediately
                    // The onAuthStateChange listener (above) will handle:
                    // 1. Fetching profile/tier
                    // 2. Checking 'requests' approval status (and logging out if needed)
                    // 3. Setting the local 'user' state

                    router.push('/dashboard');
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
