"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type MenuSeparator = {
    type: 'separator';
    label?: undefined;
    href?: undefined;
    action?: undefined;
    external?: undefined;
};

type MenuLink = {
    type?: undefined;
    label: string;
    href: string;
    external?: boolean;
    action?: undefined;
};

type MenuAction = {
    type?: undefined;
    label: string;
    action: () => void;
    href?: undefined;
    external?: undefined;
};

type MenuItem = MenuSeparator | MenuLink | MenuAction;

export default function MenuBar() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuItems: Record<string, MenuItem[]> = {
        File: [
            { label: 'Početna', href: '/' },
            { label: 'Prijava', href: '/login' },
            { type: 'separator' },
            { label: 'Izlaz', href: 'https://google.com', external: true },
        ],
        Uredi: [
            { label: 'Poništi', action: () => alert('Funkcija nije dostupna.') },
            { label: 'Ponovi', action: () => alert('Funkcija nije dostupna.') },
            { type: 'separator' },
            { label: 'Kopiraj', action: () => alert('Sadržaj kopiran.') },
            { label: 'Zalijepi', action: () => alert('Lijepljenje nije dozvoljeno.') },
        ],
        Prikaz: [
            { label: 'Osvježi', action: () => window.location.reload() },
            { type: 'separator' },
            { label: 'Puni zaslon', action: () => document.documentElement.requestFullscreen().catch(() => { }) },
        ],
        Pomoć: [
            { label: 'O stranici', action: () => alert('Udruga Građana Baljci - Stealth Mode v1.0') },
        ]
    };

    const toggleMenu = (menuName: string) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    return (
        <div className="bg-[#c0c0c0] border-b border-white shadow-sm text-sm font-sans select-none relative z-50 print:hidden" ref={menuRef}>
            <div className="flex px-1 py-0.5">
                {Object.entries(menuItems).map(([name, items]) => (
                    <div key={name} className="relative">
                        <button
                            onClick={() => toggleMenu(name)}
                            onMouseEnter={() => activeMenu && setActiveMenu(name)}
                            className={`px-2 py-0.5 focus:outline-none ${activeMenu === name
                                ? 'bg-[#000080] text-white'
                                : 'text-black hover:bg-gray-300'
                                }`}
                        >
                            <span className="first-letter:underline">{name}</span>
                        </button>

                        {activeMenu === name && (
                            <div className="absolute left-0 top-full min-w-[160px] bg-[#c0c0c0] border border-gray-600 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] z-50">
                                <div className="border border-white border-r-gray-500 border-b-gray-500 py-0.5">
                                    {items.map((item, index) => {
                                        if (item.type === 'separator') {
                                            return <div key={index} className="h-[1px] bg-gray-600 border-b border-white my-1 mx-0.5" />;
                                        }

                                        if (item.href) {
                                            if (item.external) {
                                                return (
                                                    <a
                                                        key={index}
                                                        href={item.href}
                                                        className="block px-4 py-1 hover:bg-[#000080] hover:text-white text-black no-underline"
                                                        onClick={() => setActiveMenu(null)}
                                                    >
                                                        {item.label}
                                                    </a>
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    className="block px-4 py-1 hover:bg-[#000080] hover:text-white text-black no-underline"
                                                    onClick={() => setActiveMenu(null)}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    item.action?.();
                                                    setActiveMenu(null);
                                                }}
                                                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white text-black"
                                            >
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
