"use client";

import { useLanguage } from '@/lib/language-context';
import { CreditCard, ArrowRight, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PromptPayment() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="bg-amber-500 text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <CreditCard size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold mb-2">Članarina</h1>
                        <p className="text-amber-100 max-w-sm mx-auto">
                            Vaš zahtjev je odobren! Kako biste pristupili portalu, molimo uplatite godišnju članarinu.
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-amber-800">
                            <strong>Godišnja članarina (2026.) iznosi 15 EUR.</strong>
                            <p className="mt-1 opacity-80">
                                Vaša uplata pomaže u održavanju i razvoju naše zajednice i baštine.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a
                                href="https://buy.stripe.com/5kQbJ160x3l6g8Q6FK4ZG00" // Real Stripe link from donate page
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm hover:shadow-md active:scale-95"
                            >
                                <CreditCard size={18} /> {t.donateOpt1Method || 'Kartica'}
                            </a>
                            <a
                                href="https://wise.com/pay/business/udrugagradjanabaljci?utm_source=quick_pay"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#9FE870] text-[#163300] rounded-xl font-bold hover:bg-[#8CD850] transition-colors shadow-sm hover:shadow-md active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.35 15.11l2.58-7.91h4.63l-2.09 6.27c-.24.69.1 1.09.83 1.09h3.69l3.59-10.9h4.3L19.2 19.34c-1.35 4-4.5 5.86-9.13 5.86-4.63 0-8-2.61-8-6.17 0-1.85.81-3.6 2.28-3.92z" />
                                </svg>
                                Wise Pay
                            </a>
                        </div>

                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                {t.donateOpt2Title || 'Bankovni Prijenos'}
                            </p>
                            <div className="text-xs space-y-1 text-zinc-600 font-mono">
                                <p>{t.donateBeneficiary || 'UDRUGA GRAĐANA BALJCI'}</p>
                                <p className="font-bold text-zinc-900 select-all">{t.donateIban || 'HR0723600001103006612'}</p>
                                <p>{t.donateBic || 'ZABA HR 2X'}</p>
                                <p className="pt-1 mt-1 border-t border-zinc-200 text-zinc-500">
                                    Opis: Članarina 2026 - {user?.name}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-center text-zinc-500">
                            Nakon uplate, administrator će vam dodijeliti puni pristup. (Ovo može potrajati do 24 sata).
                        </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-100">
                        <button
                            onClick={logout}
                            className="w-full py-3 text-zinc-500 hover:text-zinc-900 text-sm font-semibold transition-colors rounded-xl hover:bg-zinc-100"
                        >
                            Odjava
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
