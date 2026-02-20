"use client";

import { useLanguage } from '@/lib/language-context';
import { Clock, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PendingApproval() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden text-center">
                <div className="p-12 space-y-6">
                    <div className="w-24 h-24 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto relative">
                        <Clock size={48} />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Loader2 size={16} className="text-sky-500 animate-spin" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-zinc-900 font-serif">
                            Zahtjev na pregledu
                        </h1>
                        <p className="text-zinc-500 leading-relaxed">
                            Poštovani <strong className="text-zinc-900">{user?.name}</strong>,<br />
                            vaš profil je trenutno u procesu odobravanja od strane administratora.
                        </p>
                    </div>

                    <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-100/50">
                        <p className="text-sm text-sky-800">
                            Obavijestit ćemo vas putem e-maila čim vaš pristup bude odobren.
                            Hvala na strpljenju!
                        </p>
                    </div>

                    <div className="pt-6 space-y-3">
                        <a
                            href="mailto:udrugabaljci@gmail.com"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl font-medium transition-colors border border-zinc-200"
                        >
                            <Mail size={18} /> Kontaktirajte nas
                        </a>
                        <button
                            onClick={logout}
                            className="w-full py-3 text-zinc-400 hover:text-zinc-600 text-sm font-semibold transition-colors"
                        >
                            Odjava
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
