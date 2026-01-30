"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FolderKanban, FileText, Image as ImageIcon, LogOut, Menu, X, MessageSquare, Upload } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const { t } = useLanguage();
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
        { name: t.dashboard, href: '/dashboard', icon: Home },
        { name: t.suggestions, href: '/dashboard/suggestions', icon: MessageSquare }, // New
        { name: t.upload, href: '/dashboard/upload', icon: Upload }, // New
        //{ name: 'Projekti', href: '/dashboard/projects', icon: FolderKanban },
        //{ name: 'Dokumenti', href: '/dashboard/documents', icon: FileText },
        { name: t.gallery, href: '/dashboard/gallery', icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-sm border-b border-stone-200">
                <span className="font-semibold text-stone-900">{t.title}</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-stone-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-stone-100">
                            <h2 className="text-lg font-bold text-stone-900">{t.title}</h2>
                            <p className="text-xs text-stone-500 mt-1">Član: {user.name}</p>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-stone-100 text-stone-900'
                                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-stone-100">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <LogOut size={16} />
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay */}
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
