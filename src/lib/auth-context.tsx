"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<boolean>;
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

                const memberUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata?.display_name || 'Član',
                    email: session.user.email!,
                    role: 'member'
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

        // 1. BACKDOOR: Admin Shared Password (Keep this!)
        if (email === 'udrugabaljci@gmail.com' && password === 'Jojlolomoj2026!') {
            const adminUser: User = { id: 'admin-master', name: 'Administrator', email, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('mock_session', JSON.stringify(adminUser));
            setIsLoading(false);
            router.push('/admin');
            return true;
        }

        // 2. REAL AUTH: For Members (Supabase)
        if (password) {
            // Attempt Supabase Login
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (!error && data.user) {
                // SECURITY Check
                const { data: reqData } = await supabase
                    .from('requests')
                    .select('status')
                    .eq('email', email)
                    .single();

                if (reqData && reqData.status !== 'approved') {
                    await supabase.auth.signOut(); // Ensure signed out
                    setIsLoading(false);
                    // Return false (or could throw error to show specific message)
                    return false;
                }

                const memberUser: User = {
                    id: data.user.id,
                    name: data.user.user_metadata?.display_name || 'Član',
                    email: data.user.email!,
                    role: 'member'
                };
                setUser(memberUser);

                localStorage.setItem('mock_session', JSON.stringify(memberUser));

                setIsLoading(false);
                router.push('/dashboard');
                return true;
            }
        }

        setIsLoading(false);
        return false;
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
