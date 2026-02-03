"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccessRequestModal from './AccessRequestModal';
import { useLanguage } from '@/lib/language-context';

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t, setLanguage, language } = useLanguage();

    return (
        <section className="relative min-h-screen flex flex-col justify-between bg-zinc-50 text-zinc-800 font-serif">
            <AccessRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Top Bar */}
            <div className="w-full p-6 flex justify-between items-center border-b border-zinc-200 bg-white">
                <div className="flex gap-2 text-xs font-sans tracking-widest text-zinc-400">
                    <button onClick={() => setLanguage('hr')} className={`hover:text-zinc-800 ${language === 'hr' ? 'text-zinc-900 font-bold' : ''}`}>CRO</button>
                    <span>|</span>
                    <button onClick={() => setLanguage('sr')} className={`hover:text-zinc-800 ${language === 'sr' ? 'text-zinc-900 font-bold' : ''}`}>SRB</button>
                    <span>|</span>
                    <button onClick={() => setLanguage('en')} className={`hover:text-zinc-800 ${language === 'en' ? 'text-zinc-900 font-bold' : ''}`}>EN</button>
                    <span>|</span>
                    <button onClick={() => setLanguage('de')} className={`hover:text-zinc-800 ${language === 'de' ? 'text-zinc-900 font-bold' : ''}`}>DE</button>
                </div>
                <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-wider">
                    {t.login}
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4 drop-shadow-lg">
                    {/* Logo Integration */}
                    <Image
                        src="/logo.jpg"
                        alt="Udruga Baljci Logo"
                        fill
                        className="object-contain rounded-full"
                        priority
                    />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 drop-shadow-sm">
                    {t.title}
                </h1>

                <div className="max-w-xl text-lg text-zinc-600 leading-relaxed font-light space-y-2">
                    <p>{t.heroSubtitle}</p>
                    <p>{t.heroDescription}</p>
                </div>

                <div className="mt-8 p-6 border border-zinc-200 bg-white rounded-sm shadow-sm max-w-md w-full">
                    <p className="text-sm text-zinc-500 mb-4 italic">{t.accessRestricted}</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 px-4 bg-zinc-900 text-white text-sm hover:bg-zinc-700 transition-all uppercase tracking-widest"
                    >
                        {t.requestAccess}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full p-6 border-t border-zinc-200 bg-zinc-100 flex flex-col items-center justify-center gap-2 text-xs text-zinc-400">
                <p>&copy; {new Date().getFullYear()} {t.title}. {t.footerRight}</p>
                {/* Hidden/Discreet Contact */}
                <a href="mailto:udrugabaljci@gmail.com" className="hover:text-zinc-600 transition-colors">
                    {t.navContact}
                </a>
            </footer>
        </section>
    );
}
