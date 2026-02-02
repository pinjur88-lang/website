"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, FileDiff, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace('/login');
            } else if (user.role !== 'admin') {
                router.replace('/dashboard');
            }
        }
    }, [user, isLoading, router]);

    // BLOCK CONTENT IMMEDIATELY IF UNAUTHORIZED
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-100">
                <div className="text-zinc-500">Provjera ovlasti...</div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null; // Show nothing while redirecting
    }

    return (
        <div className="min-h-screen bg-zinc-100 font-sans text-zinc-900">
            <header className="bg-zinc-900 text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        <span className="font-bold tracking-wide">Admin Panel</span>
                    </div>

                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/admin" className="hover:text-zinc-300 flex items-center gap-2">
                            <Users size={18} /> Članstvo
                        </Link>
                        <Link href="/admin/news" className="hover:text-zinc-300 flex items-center gap-2">
                            <FileDiff size={18} /> Objave
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-400">Prijavljen kao: {user.name}</span>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                            title="Odjava"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8">
                {children}
            </main>
        </div>
    );
}
