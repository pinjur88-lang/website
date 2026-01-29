"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FolderKanban, FileText, Image as ImageIcon, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-amber-800 animate-pulse">Učitavanje...</div>
            </div>
        );
    }

    const navItems = [
        { name: 'Novosti', href: '/dashboard', icon: Home },
        { name: 'Projekti', href: '/dashboard/projects', icon: FolderKanban },
        { name: 'Dokumenti', href: '/dashboard/documents', icon: FileText },
        { name: 'Galerija', href: '/dashboard/gallery', icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-amber-50 text-stone-800 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-sm border-b border-amber-100">
                <span className="font-semibold text-amber-900">Udruga Baljci</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-stone-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-amber-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-amber-100">
                            <h2 className="text-xl font-bold text-amber-900">Naša Zajednica</h2>
                            <p className="text-xs text-stone-500 mt-1">Udruga Građana Baljci</p>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-amber-100">
                            <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-stone-900 truncate">{user.name}</p>
                                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={16} />
                                Odjava
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
