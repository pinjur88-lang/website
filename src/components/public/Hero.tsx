"use client";

import { useState } from 'react';
import Link from 'next/link';
import AccessRequestModal from './AccessRequestModal';

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative h-screen flex flex-col justify-between bg-zinc-50 text-zinc-800 font-serif">
            <AccessRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Simple Top Bar */}
            <div className="w-full p-6 flex justify-between items-center border-b border-zinc-200 bg-white">
                <span className="text-sm uppercase tracking-widest text-zinc-500">Republika Hrvatska - Udruga Građana</span>
                <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
                    Prijava za članove
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-200 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-4xl text-zinc-400">🏛️</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
                    Udruga Građana Baljci
                </h1>
                <p className="max-w-xl text-lg text-zinc-600 leading-relaxed">
                    Udruga za očuvanje kulturne baštine i zaštitu okoliša.<br />
                    Osnovana s ciljem promicanja održivog razvoja i revitalizacije područja.
                </p>

                <div className="mt-8 p-4 border border-zinc-200 bg-white rounded-sm shadow-sm max-w-md w-full">
                    <p className="text-sm text-zinc-500 mb-3">Pristup sadržaju je ograničen na članove.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2 px-4 bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors uppercase tracking-wide"
                    >
                        Zatraži pristup
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full p-6 border-t border-zinc-200 bg-zinc-100 text-center text-xs text-zinc-500">
                <p>&copy; {new Date().getFullYear()} Udruga Građana Baljci. Sva prava pridržana.</p>
                <p className="mt-1">Kontakt: udrugabaljci@gmail.com</p>
            </footer>
        </section>
    );
}
