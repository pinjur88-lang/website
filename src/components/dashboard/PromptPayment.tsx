"use client";

import { useLanguage } from '@/lib/language-context';
import { CreditCard, ArrowRight, ShieldCheck, Mail, AlertCircle, Check, Globe, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { notifyAdminPayment } from '@/actions/admin';

export default function PromptPayment() {
    const { t } = useLanguage();
    const { user, logout } = useAuth();

    const [selectedTier, setSelectedTier] = useState<'voting' | 'supporter'>('voting');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleNotifyAdmin = async () => {
        if (!user?.email) return;
        setIsSubmitting(true);
        setError('');

        const res = await notifyAdminPayment(user.email, selectedTier, note);
        if (res.success) {
            setSuccessMessage('Hvala! Administrator je obaviješten i vaš račun će uskoro biti aktiviran (Check back in 24 hours).');
            setNote('');
        } else {
            setError(res.error || 'Došlo je do greške. Pokušajte ponovno.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="bg-amber-500 text-white p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <CreditCard size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold mb-2">Članarina / Membership</h1>
                        <p className="text-amber-100 max-w-lg mx-auto">
                            Vaš zahtjev je odobren! Odaberite razinu članarine i izvršite uplatu kako biste pristupili portalu.
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Tier Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Voting Member */}
                        <div
                            onClick={() => setSelectedTier('voting')}
                            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${selectedTier === 'voting'
                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-4 ring-indigo-500/10'
                                    : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50'
                                }`}
                        >
                            {selectedTier === 'voting' && (
                                <div className="absolute top-4 right-4 text-indigo-500">
                                    <Check className="w-6 h-6" />
                                </div>
                            )}
                            <h3 className="font-bold text-zinc-900 text-lg mb-1">Punopravni Član</h3>
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-4">Voting Member</p>
                            <div className="text-3xl font-bold text-indigo-600 mb-4">
                                €100 <span className="text-sm text-zinc-500 font-normal">/ year</span>
                            </div>
                            <ul className="space-y-2 text-sm text-zinc-600">
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 min-w-[16px]"><Check className="w-4 h-4 text-emerald-500" /></div>
                                    <span>Pravo glasa na sjednicama (18+ god)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 min-w-[16px]"><Check className="w-4 h-4 text-emerald-500" /></div>
                                    <span>Potreban OIB za službeni Registar Udruga</span>
                                </li>
                            </ul>
                        </div>

                        {/* Supporter */}
                        <div
                            onClick={() => setSelectedTier('supporter')}
                            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${selectedTier === 'supporter'
                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md ring-4 ring-indigo-500/10'
                                    : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50'
                                }`}
                        >
                            {selectedTier === 'supporter' && (
                                <div className="absolute top-4 right-4 text-indigo-500">
                                    <Check className="w-6 h-6" />
                                </div>
                            )}
                            <h3 className="font-bold text-zinc-900 text-lg mb-1">Podupirući Član</h3>
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-4">Supporter</p>
                            <div className="text-3xl font-bold text-indigo-600 mb-4">
                                €50 <span className="text-sm text-zinc-500 font-normal">/ year</span>
                            </div>
                            <ul className="space-y-2 text-sm text-zinc-600">
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 min-w-[16px]"><Check className="w-4 h-4 text-zinc-400" /></div>
                                    <span className="text-zinc-500">Nema pravo glasa (No voting rights)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-0.5 min-w-[16px]"><Check className="w-4 h-4 text-emerald-500" /></div>
                                    <span>Potreban OIB za Registar</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-amber-800">
                            <strong>Total: {selectedTier === 'voting' ? '100 EUR' : '50 EUR'}</strong>
                            <p className="mt-1 opacity-80">
                                Odaberite metodu plaćanja ispod. (Choose your payment method below).
                            </p>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a
                                href={selectedTier === 'voting' ? "#TODO-voting-stripe-link" : "#TODO-supporter-stripe-link"} // TODO: Need specific Stripe links
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm hover:shadow-md active:scale-95"
                                onClick={(e) => {
                                    if (e.currentTarget.getAttribute('href')?.startsWith('#TODO')) {
                                        e.preventDefault();
                                        alert("Stripe links for these new tiers are being generated. Please use Wise or Bank Transfer in the meantime.");
                                    }
                                }}
                            >
                                <CreditCard size={18} /> Stripe (Card)
                            </a>
                            <a
                                href="https://wise.com/pay/business/udrugagradjanabaljci?utm_source=quick_pay"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex flex-col items-center justify-center gap-1 py-3 bg-[#9FE870] text-[#163300] rounded-xl font-bold hover:bg-[#8CD850] transition-colors shadow-sm hover:shadow-md active:scale-95"
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    <span>Wise Transfer</span>
                                </div>
                                <span className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">All Currencies Accepted (Not just EUR)</span>
                            </a>
                        </div>

                        <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                {t.donateOpt2Title || 'Bankovni Prijenos (Bank Transfer)'}
                            </p>
                            <div className="text-sm space-y-1.5 text-zinc-700 font-mono">
                                <p className="text-xs text-zinc-500 mb-2 uppercase">Iznos (Amount): <strong className="text-zinc-900 text-sm">€{selectedTier === 'voting' ? '100.00' : '50.00'}</strong></p>
                                <p>{t.donateBeneficiary || 'UDRUGA GRAĐANA BALJCI'}</p>
                                <p className="font-bold text-zinc-900 select-all">{t.donateIban || 'HR0723600001103006612'}</p>
                                <p>{t.donateBic || 'ZABA HR 2X'}</p>
                                <p className="pt-2 mt-2 border-t border-zinc-200 text-zinc-500 text-xs">
                                    Opis plaćanja (Reference): Članarina 2026 - {user?.name}
                                </p>
                            </div>
                        </div>

                        {/* Confirmation Box */}
                        <div className="mt-8 bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
                            <h4 className="font-bold text-indigo-900 text-lg mb-2">Jeste li izvršili uplatu? (Have you paid?)</h4>
                            <p className="text-sm text-zinc-600 mb-4">
                                Obavijestite administratora kako bi ubrzali aktivaciju vašeg računa. (Notify the admin to speed up your account activation).
                            </p>

                            {successMessage ? (
                                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-3">
                                    <Check className="shrink-0 text-emerald-600 mt-0.5" />
                                    <p className="text-sm font-medium">{successMessage}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Ostavite napomenu (opcionalno) npr. 'Plaćeno preko banke' ili 'Paid via Wise'..."
                                        className="w-full border border-zinc-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        rows={2}
                                    />
                                    {error && <p className="text-red-600 text-xs">{error}</p>}
                                    <button
                                        onClick={handleNotifyAdmin}
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                        {isSubmitting ? 'Slanje...' : 'Potvrdi Uplatu (Confirm Payment)'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-center text-zinc-500 pt-4">
                            Nakon potvrde uplate, administrator će vam dodijeliti puni pristup. (Ovo može potrajati do 24 sata).
                        </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-100">
                        <button
                            onClick={logout}
                            className="w-full py-3 text-zinc-500 hover:text-zinc-900 text-sm font-semibold transition-colors rounded-xl hover:bg-zinc-100"
                        >
                            Odjava (Log out)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
