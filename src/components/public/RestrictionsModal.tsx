"use client";

import { X, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RestrictionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RestrictionsModal({ isOpen, onClose }: RestrictionsModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative transform transition-transform duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 text-zinc-400/80">
                        <Lock size={48} />
                    </div>

                    <h3 className="font-serif text-3xl text-zinc-800 mb-4 font-bold">
                        Restricted Access
                    </h3>

                    <p className="text-zinc-500 leading-relaxed mb-8">
                        To view the Village Map and Ancestral Data, you must be a registered member. Founding Membership is free for 2026.
                    </p>

                    <button
                        onClick={() => router.push('/register')}
                        className="bg-[#556B2F] text-white px-8 py-3 rounded-full font-medium tracking-wide hover:bg-[#3f5222] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        JOIN THE WAITLIST
                    </button>
                </div>
            </div>
        </div>
    );
}
