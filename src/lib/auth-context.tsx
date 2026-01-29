"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Simulate checking session
    const router = useRouter();

    useEffect(() => {
        // Check local storage for session
        const storedUser = localStorage.getItem('mock_session');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        // Mock login logic
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        if (email === 'udrugabaljci@gmail.com') {
            const adminUser: User = { id: '1', name: 'Admin', email, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('mock_session', JSON.stringify(adminUser));
            router.push('/admin');
            return true;
        } else if (email === 'clan@ug-baljci.hr') {
            const memberUser: User = { id: '2', name: 'Ivan Horvat', email, role: 'member' };
            setUser(memberUser);
            localStorage.setItem('mock_session', JSON.stringify(memberUser));
            router.push('/dashboard');
            return true;
        }

        setIsLoading(false);
        return false; // Login failed
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
