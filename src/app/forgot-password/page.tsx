import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/language-context';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage(t.checkEmail);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
            <div className="w-full max-w-sm bg-white border border-zinc-200 shadow-sm p-8 rounded-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-2 text-zinc-500">
                        <Mail size={18} />
                    </div>
                    <h1 className="text-xl font-serif text-zinc-800 tracking-wide">{t.forgotPassword}</h1>
                    <p className="text-xs text-zinc-400 mt-1 text-center">{t.passwordResetDesc}</p>
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

                    {message && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs text-emerald-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <p className="text-xs text-red-600 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm text-sm transition-colors uppercase tracking-wider disabled:opacity-50"
                    >
                        {isLoading ? t.sending : t.sendResetLink}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
                    <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center justify-center gap-1 transition-colors">
                        <ArrowLeft size={12} />
                        {t.backToLogin}
                    </Link>
                </div>
            </div>
        </div>
    );
}
