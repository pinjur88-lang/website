"use client";

import { useLanguage } from '@/lib/language-context';
import { Clock, Loader2, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PendingApproval() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto relative">
                            <Clock size={40} />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                <Loader2 size={16} className="text-sky-500 animate-spin" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900 font-serif">
                            Dobrodošli, {user?.name}!
                        </h1>
                        <p className="text-zinc-500 text-lg">
                            Vaš račun je uspješno kreiran. Kako bi zaštitili našu zajednicu, imamo proces registracije u 3 koraka.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
                        <h2 className="font-bold text-slate-800 font-serif text-xl border-b border-slate-200 pb-3">Kako funkcionira registracija?</h2>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Korak 1: Prijava (Završeno)</h3>
                                    <p className="text-slate-600 text-sm mt-1">Vaši podaci su poslani u naš sustav.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                                        2
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Korak 2: Odobrenje Odbora (U tijeku)</h3>
                                    <p className="text-slate-600 text-sm mt-1">
                                        Naš odbor pregledava vaš zahtjev. Očekujte e-mail potvrdu uskoro.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                        3
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Korak 3: Uplata Članarine (Donacija)</h3>
                                    <p className="text-slate-600 text-sm mt-1">
                                        Nakon što vas Odbor odobri, dobit ćete upute za uplatu godišnje članarine (donacije). 
                                        Kada evidentiramo vašu uplatu, administrator će vam otključati potpuni pristup portalu.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100/50 text-center">
                        <p className="text-sm text-sky-800 font-medium">
                            Molimo provjerite svoj e-mail sandučić (i spam mapu) za daljnje upute.
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:udrugabaljci@gmail.com"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium transition-colors"
                        >
                            <Mail size={18} /> Kontaktirajte nas
                        </a>
                        <button
                            onClick={logout}
                            className="w-full sm:w-auto px-6 py-3 text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
                        >
                            Odjava
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
