"use client";

import { Suspense, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isApprovalPending, setIsApprovalPending] = useState(false);
    const [authCodeError, setAuthCodeError] = useState(false);
    const { login, isLoading: isAuthLoading, user } = useAuth();

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (user && !isAuthLoading) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'PendingApproval') {
            setIsApprovalPending(true);
        } else if (errorParam === 'AuthCodeError') {
            setAuthCodeError(true);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setIsApprovalPending(false);
        setAuthCodeError(false);

        if (!email || !password) {
            setError(t.loginRequiredFields);
            setLoading(false);
            return;
        }

        try {
            const { error: loginError } = await login(email, password);
            if (loginError) {
                // Handle specific error cases (loginError is a string here)
                if (loginError.includes("Email not confirmed")) {
                    setError(t.loginConfirmEmail);
                } else if (loginError.includes("Invalid login credentials") || loginError.includes("nema pristup")) {
                    setError(t.loginError);
                } else {
                    setError(loginError);
                }
            }
        } catch (err) {
            setError(t.loginError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Lock size={120} />
                    </div>

                    <div className="space-y-6 relative">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-serif font-bold text-zinc-900">{t.loginTitle}</h1>
                            <p className="text-zinc-500">{t.signIn}</p>
                        </div>

                        {/* Status Messages */}
                        {isApprovalPending && (
                            <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl flex gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={20} className="shrink-0" />
                                <p>{t.loginPendingApproval}</p>
                            </div>
                        )}

                        {authCodeError && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={20} className="shrink-0" />
                                <p>{t.loginAuthCodeError}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">{t.emailLabel}</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900 transition-all"
                                    placeholder={t.loginEmailPlaceholder}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-zinc-700">{t.passwordLabel}</label>
                                    <Link href="/login/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                                        {t.forgotPassword}
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex gap-2 items-center animate-shake">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isAuthLoading || !!user}
                                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading || isAuthLoading || user ? t.loading : t.loginSubmit}
                                {!(loading || isAuthLoading || user) && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div className="pt-6 border-t border-zinc-100 text-center space-y-4">
                            <p className="text-zinc-500 text-sm">
                                {t.noAccount} <Link href="/" className="text-zinc-900 font-bold hover:underline">{t.requestHere}</Link>
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                                <span>{t.haveApproval}</span>
                                <Link href="/register" className="text-zinc-900 font-semibold hover:underline">{t.registerHere}</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/" className="text-zinc-400 hover:text-zinc-600 text-sm transition-colors">
                        ← {t.navHome}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
            <Suspense fallback={<div className="text-sm text-zinc-500">Učitavanje...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
