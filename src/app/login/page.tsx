"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLocalLoading(true);

        const { error: loginError } = await login(email, password);
        if (loginError) {
            // If it's a specific Supabase error, show it (translated roughly by fallback)
            setError(loginError === 'Email not confirmed'
                ? "Molimo potvrdite svoju email adresu prije prijave (provjerite inbox)."
                : (loginError === 'Invalid login credentials' ? t.loginError : loginError)
            );
            setIsLocalLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
            <div className="w-full max-w-sm bg-white border border-zinc-200 shadow-sm p-8 rounded-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-2 text-zinc-500">
                        <Lock size={18} />
                    </div>
                    <h1 className="text-xl font-serif text-zinc-800 tracking-wide">{t.loginTitle}</h1>
                    <p className="text-xs text-zinc-400 mt-1 uppercase">{t.onlyMembers}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.emailLabel}</label>
                        <input
                            type="email"
                            id="email"
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
                            type="password"
                            id="password"
                            required
                            className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 text-zinc-900 bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-xs text-red-600 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading || isLocalLoading}
                        className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm text-sm transition-colors uppercase tracking-wider relative"
                    >
                        {(isLoading || isLocalLoading) ? t.checking : t.signIn}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-xs text-zinc-400">
                        {t.noAccount} <a href="/" className="underline hover:text-zinc-600">{t.requestHere || "Zatraži pristup"}</a>.
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                        Imate odobrenje? <a href="/register" className="underline hover:text-zinc-600 font-bold">Registrirajte se ovdje</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
