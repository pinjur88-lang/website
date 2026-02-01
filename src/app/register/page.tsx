"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Lock, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { checkApprovedRequest } from '../actions';

export default function RegisterPage() {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Status states
    const [status, setStatus] = useState<'idle' | 'checking' | 'pending_approval' | 'approved_not_registered' | 'registered' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setStatus('checking');

        try {
            // 1. Check if email exists in requests table and is approved
            // We use a Server Action to bypass RLS policies that prevent Anon reading the requests table
            const { data: requestData, error: requestError } = await checkApprovedRequest(email);

            if (requestError || !requestData) {
                setStatus('error');
                // If it's a specific server error (like config missing), show it.
                // Otherwise show the user-friendly "not found" message.
                if (requestError && requestError !== 'Not found') {
                    setErrorMsg(requestError);
                } else {
                    setErrorMsg(t.registerRequestNotFound || "Zahtjev nije pronađen. Molimo prvo ispunite zahtjev za članstvom na naslovnici.");
                }
                return;
            }

            if (requestData.status === 'pending') {
                setStatus('pending_approval');
                return;
            }

            if (requestData.status !== 'approved') {
                setStatus('error');
                setErrorMsg("Vaš zahtjev je odbijen.");
                return;
            }

            // 2. If approved, proceed with Registration
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name, // Use input name
                        role: 'member'
                    }
                }
            });

            if (authError) {
                setStatus('error');
                setErrorMsg(authError.message);
                return;
            }

            setStatus('registered');

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message || 'Došlo je do greške.');
        }
    };

    if (status === 'registered') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
                <div className="w-full max-w-md bg-white border border-zinc-200 shadow-sm p-8 rounded-sm text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-2xl font-serif text-zinc-900 mb-2">{t.registerSuccessTitle || "Registracija Uspješna!"}</h1>
                    <p className="text-zinc-600 mb-6">{t.registerSuccessDesc || "Vaš račun je kreiran. Molimo potvrdite svoju email adresu (ako je potrebno) ili se prijavite."}</p>
                    <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white hover:bg-zinc-700 transition-colors uppercase tracking-wider text-sm rounded-sm">
                        {t.login} <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
            <div className="w-full max-w-sm bg-white border border-zinc-200 shadow-sm p-8 rounded-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-2 text-zinc-500">
                        <UserPlus size={18} />
                    </div>
                    <h1 className="text-xl font-serif text-zinc-800 tracking-wide">{t.registerTitle || "Registracija"}</h1>
                    <p className="text-xs text-zinc-400 mt-1 uppercase">{t.registerSubtitle || "Samo za odobrene članove"}</p>
                </div>

                {status === 'pending_approval' ? (
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-sm text-center mb-4">
                        <AlertCircle className="mx-auto text-yellow-600 mb-2" size={24} />
                        <h3 className="text-sm font-bold text-yellow-800 mb-1">Zahtjev na čekanju</h3>
                        <p className="text-xs text-yellow-700 leading-relaxed">
                            Vaš zahtjev za članstvom još nije odobren. Administrator će vas obavijestiti putem emaila kada vaš zahtjev bude obrađen.
                        </p>
                        <button onClick={() => setStatus('idle')} className="mt-3 text-xs underline text-yellow-800 hover:text-yellow-900">
                            Pokušaj ponovno s drugim emailom
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.nameLabel}</label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 text-zinc-900 bg-white"
                                placeholder="Vaše Ime"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.emailLabel}</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 text-zinc-900 bg-white"
                                placeholder="ime@primjer.hr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.password}</label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 text-zinc-900 bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-sm flex items-start gap-2">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-red-600">{errorMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'checking'}
                            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm text-sm transition-colors uppercase tracking-wider relative"
                        >
                            {status === 'checking' ? t.checking || "Provjera..." : "Registriraj se"}
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-xs text-zinc-400">
                        {t.alreadyMember || "Već imate račun?"} <Link href="/login" className="underline hover:text-zinc-600">{t.login}</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
