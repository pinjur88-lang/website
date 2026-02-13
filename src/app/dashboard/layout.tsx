"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, Hammer, BookOpen, Map, Trash2, Lightbulb, AlertTriangle, MessageSquare, ImageIcon, Scale, Mail, Vote } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const { t, setLanguage, language } = useLanguage();
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

    const navGroups = [
        {
            title: null,
            items: [
                { name: t.overview, href: '/dashboard', icon: LayoutDashboard },
                /* REMOVED PER USER REQUEST
                {
                    name: t.map,
                    href: '/dashboard/map',
                    icon: Map,
                    children: [
                        { name: t.map, href: '/dashboard/map', icon: Map },
                        { name: t.genealogy, href: '/dashboard/genealogy', icon: Users }
                    ]
                },
                */
                /* { name: t.voting, href: '/dashboard/voting', icon: Vote }, */
            ]
        },
        {
            title: "Zajednica",
            items: [
                { name: t.community, href: '/dashboard/community', icon: MessageSquare },
                { name: t.gallery, href: '/dashboard/gallery', icon: ImageIcon },
                { name: t.donations, href: '/dashboard/donate', icon: FileText },
                { name: t.contactAdmin, href: '/dashboard/contact', icon: Mail },
            ]
        },
        {
            title: "Baština & Usluge",
            items: [
                { name: t.memorial, href: '/dashboard/memorial', icon: BookOpen },
                { name: t.handbook, href: '/dashboard/handbook', icon: BookOpen },
                { name: t.statute, href: '/dashboard/statute', icon: Scale },
                { name: t.renovation, href: '/dashboard/renovation', icon: Hammer },
                { name: t.infrastructure, href: '/dashboard/infrastructure', icon: Lightbulb },
                { name: t.dumping, href: '/dashboard/dumping', icon: AlertTriangle },
                { name: t.oib, href: '/dashboard/oib', icon: FileText },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-sky-50 text-slate-800 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm shadow-sm border-b border-sky-100">
                <span className="font-semibold text-slate-900">{t.title}</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-sky-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0 flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="p-6 border-b border-sky-100 bg-gradient-to-br from-sky-50 to-white flex-shrink-0">
                        <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
                        <p className="text-xs text-slate-500 mt-1">Član: {user.name}</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        {navGroups.map((group, groupIdx) => (
                            <div key={groupIdx}>
                                {group.title && (
                                    <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {group.title}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item: any) => {
                                        const isActive = pathname === item.href || (item.children && item.children.some((child: any) => pathname === child.href));

                                        if (item.children) {
                                            return (
                                                <div key={item.href} className="space-y-1">
                                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-sky-900' : 'text-slate-600'}`}>
                                                        <item.icon size={18} />
                                                        {item.name}
                                                    </div>
                                                    <div className="pl-9 space-y-1">
                                                        {item.children.map((child: any) => {
                                                            const isChildActive = pathname === child.href;
                                                            return (
                                                                <Link
                                                                    key={child.href}
                                                                    href={child.href}
                                                                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${isChildActive
                                                                        ? 'bg-sky-100 text-sky-900 font-medium'
                                                                        : 'text-slate-500 hover:bg-sky-50 hover:text-sky-900'
                                                                        }`}
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                                    ? 'bg-sky-100 text-sky-900'
                                                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-900'
                                                    }`}
                                            >
                                                <item.icon size={18} />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-sky-100 space-y-4">
                        {/* Language Selector */}
                        <div className="flex justify-center gap-2 text-xs font-sans tracking-widest text-slate-400">
                            <button onClick={() => setLanguage('hr')} className={`hover:text-sky-900 ${language === 'hr' ? 'text-sky-900 font-bold' : ''}`}>CRO</button>
                            <span>|</span>
                            <button onClick={() => setLanguage('sr')} className={`hover:text-sky-900 ${language === 'sr' ? 'text-sky-900 font-bold' : ''}`}>SRB</button>
                            <span>|</span>
                            <button onClick={() => setLanguage('en')} className={`hover:text-sky-900 ${language === 'en' ? 'text-sky-900 font-bold' : ''}`}>EN</button>
                            <span>|</span>
                            <button onClick={() => setLanguage('de')} className={`hover:text-sky-900 ${language === 'de' ? 'text-sky-900 font-bold' : ''}`}>DE</button>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <LogOut size={16} />
                            {t.logout}
                        </button>
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
