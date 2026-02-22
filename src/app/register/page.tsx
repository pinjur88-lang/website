"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Lock, UserPlus, AlertCircle, ArrowRight, User, Check } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();

    // Steps: 'form' -> 'success' (removed 'select' step)
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Common Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [oib, setOib] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [fathersName, setFathersName] = useState('');
    const [nickname, setNickname] = useState('');

    // Consents
    const [consents, setConsents] = useState({
        statute: false,
        data: false,
        marketing: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Sign Up User (Trigger handles Profile + Request creation)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: fullName,
                        full_name: fullName,
                        oib: oib || null,
                        address: address,
                        phone: phone || null,
                        fathers_name: fathersName || null,
                        nickname: nickname || null,
                        date_of_birth: dob,
                        request_type: 'individual' // Generic initial type, upgraded later
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error(t.registerUserNotCreated || "Greška pri registraciji - korisnik nije kreiran.");

            // 2. Success - Trigger handled everything.
            setStep('success');

        } catch (err: any) {
            console.error(err);
            setError(err.message || t.errorOccurred || "Došlo je do greške.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 animate-in zoom-in duration-300">
                <div className="w-full max-w-md bg-white border border-zinc-200 shadow-xl p-8 rounded-2xl text-center">
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserPlus size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Uspješna registracija!</h1>
                    <p className="text-zinc-600 mb-8 text-lg">
                        Vaš račun je kreiran i zahtjev proslijeđen administratorima.
                        <strong> Sada se možete prijaviti</strong> i pratiti status svog zahtjeva u bilo kojem trenutku.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white hover:bg-zinc-800 transition-all rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95">
                        {t.loginSubmit} <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 flex justify-center items-start">
            
            {/* STEP 2: FORM */}
            {step === 'form' && (
                <div className="w-full max-w-2xl bg-white border border-zinc-200 shadow-xl rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-8 pb-8 border-b border-zinc-100">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="text-sky-600" size={24} />
                            <h2 className="text-2xl font-bold text-zinc-900">
                                {t.registerTitle || "Pristupite Zajednici"}
                            </h2>
                        </div>
                        <p className="text-zinc-500">{t.fillLegalData}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* SECTION A: LOGIN INFO */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">{t.loginData}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.emailLabelRequired}</label>
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder={t.emailPlaceholder} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.passwordLabel}</label>
                                    <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder="******" />
                                </div>
                            </div>
                        </div>

                        {/* SECTION B: LEGAL INFO */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                                {t.personalData}
                            </h3>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">{t.fullNameLabelRequired}</label>
                                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder="npr. Ivan Horvat" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.dobLabelRequired}</label>
                                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.oibLabelLong}</label>
                                    <input type="text" value={oib} onChange={e => setOib(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder={t.leaveEmptyIfNotHave} />
                                    <p className="text-[10px] text-zinc-400">{t.oibForeignerNote}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">{t.addressLabelRequired}</label>
                                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder={t.addressPlaceholder} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.phoneLabel}</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder="+385..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">{t.fathersNameLabel}</label>
                                    <input type="text" value={fathersName} onChange={e => setFathersName(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder="Ime oca" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">{t.nicknameLabel}</label>
                                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none text-zinc-900" placeholder="npr. Genda, Bibić..." />
                            </div>
                        </div>

                        {/* SECTION E: CONSENTS */}
                        <div className="space-y-4 pt-6 border-t border-zinc-100">
                            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl">
                                <input type="checkbox" required checked={consents.statute} onChange={e => setConsents({ ...consents, statute: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">{t.acceptStatute}</p>
                                    <p className="text-xs text-zinc-500">{t.statuteRequiredByLaw}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl">
                                <input type="checkbox" required checked={consents.data} onChange={e => setConsents({ ...consents, data: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">{t.consentDataCollection}</p>
                                    <p className="text-xs text-zinc-500">{t.consentDataCollectionDesc}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white border border-zinc-200 rounded-xl">
                                <input type="checkbox" checked={consents.marketing} onChange={e => setConsents({ ...consents, marketing: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">{t.newsletterConsent}</p>
                                    <p className="text-xs text-zinc-500">{t.newsletterConsentDesc}</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg flex gap-2 items-start">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? t.processing : t.finishRegistration}
                        </button>
                    </form>
                </div>
            )}
            <div className="text-center pt-8 absolute top-8 left-8">
                <Link href="/" className="text-zinc-500 hover:text-zinc-900 font-bold flex items-center gap-2">← {t.navHome}</Link>
            </div>
        </div>
    );
}

