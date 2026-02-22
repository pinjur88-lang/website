"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        if (!email) {
            setErrorMessage('Molimo unesite email adresu.');
            setStatus('error');
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;
            setStatus('success');
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Došlo je do greške. Pokušajte ponovno.';
            setErrorMessage(errorMessage);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Mail size={120} />
                    </div>

                    <div className="space-y-6 relative">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-serif font-bold text-zinc-900">Zaboravljena Lozinka</h1>
                            <p className="text-zinc-500">Unesite email adresu i poslat ćemo vam link za ponovno postavljanje lozinke.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="p-6 bg-green-50 border border-green-100 rounded-xl text-center space-y-4">
                                <div className="flex justify-center">
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-green-800">Email poslan!</h3>
                                <p className="text-green-700 text-sm">Provjerite svoj email sandučić za daljnje upute.</p>
                                <Link href="/login" className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    Povratak na prijavu
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700">Email adresa</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900 transition-all"
                                        placeholder="vas@email.com"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex gap-2 items-center animate-shake">
                                        <AlertCircle size={18} />
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? 'Slanje...' : 'Pošalji link'}
                                    {status !== 'loading' && <ArrowRight size={20} />}
                                </button>
                            </form>
                        )}

                        {!status.includes('success') && (
                            <div className="pt-6 border-t border-zinc-100 text-center">
                                <Link href="/login" className="text-zinc-500 text-sm hover:text-zinc-900 transition-colors">
                                    ← Povratak na prijavu
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
