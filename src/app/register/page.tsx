"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Lock, UserPlus, AlertCircle, ArrowRight, User, Users, Building2, Check, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { checkApprovedRequest } from '../actions';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();

    // Steps: 'select' -> 'form' -> 'success'
    const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
    const [regType, setRegType] = useState<'individual' | 'family' | 'corporate'>('individual');
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

    // Corporate Data
    const [companyName, setCompanyName] = useState('');
    const [companyOib, setCompanyOib] = useState(''); // MBS

    // Family Data
    const [familyMembers, setFamilyMembers] = useState<{ name: string, dob: string, relation: string }[]>([]);

    // Consents
    const [consents, setConsents] = useState({
        statute: false,
        data: false,
        marketing: false
    });

    const handleSelect = (type: 'individual' | 'family' | 'corporate') => {
        setRegType(type);
        setStep('form');
        setError('');
    };

    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, { name: '', dob: '', relation: 'child' }]);
    };

    const updateFamilyMember = (index: number, field: string, value: string) => {
        const newMembers = [...familyMembers];
        (newMembers[index] as any)[field] = value;
        setFamilyMembers(newMembers);
    };

    const removeFamilyMember = (index: number) => {
        const newMembers = [...familyMembers];
        newMembers.splice(index, 1);
        setFamilyMembers(newMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Sign Up User (Created as 'pending' by DB default)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: fullName,
                        // role: 'member' // IGNORED by DB Trigger now, defaults to 'pending'
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Greška pri registraciji.");

            // Check if user is already confirmed (if email confirmation is off) or not
            // If session exists, we can proceed with profile updates
            // If distinct email confirmation is required, we might stop here.
            // Assuming we can proceed (or RLS allows update to own profile even if unconfirmed? usually yes)

            const userId = authData.user.id;

            // 2. Create or Ensure 'Request' exists for Admin Approval
            // We insert a request so the Admin sees it in their "Requests" table
            // We use a server action or public API for this? 
            // The table likely has RLS. 
            // Only 'anon' can insert? Or 'authenticated'?
            // Let's try inserting via client. If it fails due to RLS, we might need a server action.
            // Actually, we can just use the same `requests` table.

            const { error: requestError } = await supabase
                .from('requests')
                .insert([{
                    email: email,
                    full_name: fullName,
                    status: 'pending', // Waiting for admin
                    request_type: regType
                }]);

            // If request already exists (duplicate email), we might get error, but that's fine, 
            // as long as the user account is created. We can ignore unique violation or handle it.
            if (requestError && requestError.code !== '23505') { // 23505 = unique_violation
                console.warn("Could not create request entry:", requestError);
                // We don't block registration, but admin might not see it easily.
            }

            // 3. Update Profile (Base Data)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    oib: oib || null,
                    date_of_birth: dob || null,
                    address: address,
                    phone: phone,
                    fathers_name: fathersName,
                    family_nickname: nickname,
                    consents: consents,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (profileError) throw profileError;

            // 4. Handle Specialized Data
            if (regType === 'family') {
                // Insert Family Members
                if (familyMembers.length > 0) {
                    const { error: famError } = await supabase
                        .from('family_members')
                        .insert(familyMembers.map(m => ({
                            head_of_household: userId,
                            full_name: m.name,
                            date_of_birth: m.dob || null, // handle empty dates if optional
                            relationship: m.relation,
                            legal_guardian: fullName // Auto-filled
                        })));
                    if (famError) throw famError;
                }
            } else if (regType === 'corporate') {
                // Insert Company
                const { error: compError } = await supabase
                    .from('companies')
                    .insert([{
                        representative_id: userId,
                        company_name: companyName,
                        company_oib: companyOib,
                        address: address
                    }]);
                if (compError) throw compError;
            }

            setStep('success');

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Došlo je do greške.");
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
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Zahtjev Zaprimljen!</h1>
                    <p className="text-zinc-600 mb-8 text-lg">Vaš račun je kreiran i čeka odobrenje administratora. Obavijestit ćemo vas emailom kada pristup bude omogućen.</p>
                    <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white hover:bg-zinc-800 transition-all rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95">
                        {t.login} <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 flex justify-center items-start">

            {/* STEP 1: SELECTION */}
            {step === 'select' && (
                <div className="w-full max-w-5xl space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-serif font-bold text-zinc-900">Odaberite Tip Članstva</h1>
                        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Pridružite se zajednici na način koji vama najbolje odgovara.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Individual */}
                        <div onClick={() => handleSelect('individual')} className="bg-white p-8 rounded-2xl border border-zinc-200 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-900/10 cursor-pointer transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <User size={120} />
                            </div>
                            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <User size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Individualno</h3>
                            <p className="text-zinc-500 leading-relaxed">Standardno članstvo za pojedince. Uključuje pravo glasa i pristup svim resursima.</p>
                        </div>

                        {/* Family */}
                        <div onClick={() => handleSelect('family')} className="bg-white p-8 rounded-2xl border border-zinc-200 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-900/10 cursor-pointer transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={120} />
                            </div>
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Obiteljski Paket</h3>
                            <p className="text-zinc-500 leading-relaxed">"Glava kuće" registrira sebe i dodaje članove obitelji (djecu/supružnika) u jednom potezu.</p>
                        </div>

                        {/* Corporate */}
                        <div onClick={() => handleSelect('corporate')} className="bg-white p-8 rounded-2xl border border-zinc-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-900/10 cursor-pointer transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Building2 size={120} />
                            </div>
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building2 size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Pravna Osoba</h3>
                            <p className="text-zinc-500 leading-relaxed">Za tvrtke i sponzore. Registrira ovlašteni zastupnik koji glasa u ime tvrtke.</p>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <Link href="/" className="text-zinc-400 hover:text-zinc-600 text-sm">Natrag na naslovnicu</Link>
                    </div>
                </div>
            )}

            {/* STEP 2: FORM */}
            {step === 'form' && (
                <div className="w-full max-w-2xl bg-white border border-zinc-200 shadow-xl rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={() => setStep('select')} className="text-sm text-zinc-400 hover:text-zinc-600 mb-6 flex items-center gap-1">
                        ← Promijeni tip članstva
                    </button>

                    <div className="mb-8 pb-8 border-b border-zinc-100">
                        <div className="flex items-center gap-3 mb-2">
                            {regType === 'individual' && <User className="text-sky-600" size={24} />}
                            {regType === 'family' && <Users className="text-purple-600" size={24} />}
                            {regType === 'corporate' && <Building2 className="text-amber-600" size={24} />}
                            <h2 className="text-2xl font-bold text-zinc-900 capitalize">
                                {regType === 'individual' ? 'Individualna Registracija' : regType === 'family' ? 'Obiteljska Registracija' : 'Registracija Pravne Osobe'}
                            </h2>
                        </div>
                        <p className="text-zinc-500">Molimo ispunite zakonski obvezne podatke za Registar Članova.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* SECTION A: LOGIN INFO */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Moji Podaci za Prijavu</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">EMAIL ADRESA (Mora biti odobrena)</label>
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="ime@primjer.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">LOZINKA</label>
                                    <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="******" />
                                </div>
                            </div>
                        </div>

                        {/* SECTION B: LEGAL INFO */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                                {regType === 'corporate' ? 'Podaci o Zastupniku' : 'Osobni Podaci'}
                            </h3>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">IME I PREZIME (PUNO) *</label>
                                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="npr. Ivan Horvat" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">DATUM ROĐENJA *</label>
                                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">OIB (Osobni identifikacijski broj)</label>
                                    <input type="text" value={oib} onChange={e => setOib(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="Ostavite prazno ako nemate" />
                                    <p className="text-[10px] text-zinc-400">Strani državljani bez OIB-a se registriraju kao pridruženi članovi.</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">ADRESA PREBIVALIŠTA *</label>
                                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="Ulica i broj, Grad, Država" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">TELEFON</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="+385..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500">IME OCA (IDENTITET)</label>
                                    <input type="text" value={fathersName} onChange={e => setFathersName(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="Ime oca" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500">OBITELJSKI NADIMAK / Pleme</label>
                                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none" placeholder="npr. Genda, Bibić..." />
                            </div>
                        </div>

                        {/* SECTION C: FAMILY BUNDLE */}
                        {regType === 'family' && (
                            <div className="space-y-4 pt-4 border-t border-zinc-100 bg-purple-50/50 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">Članovi Obitelji (Djeca/Supružnik)</h3>
                                    <button type="button" onClick={addFamilyMember} className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-white border border-purple-200 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Plus size={14} /> DODAJ ČLANA
                                    </button>
                                </div>

                                {familyMembers.map((member, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm space-y-3 relative">
                                        <button type="button" onClick={() => removeFamilyMember(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400">IME I PREZIME</label>
                                                <input type="text" required value={member.name} onChange={e => updateFamilyMember(idx, 'name', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm" placeholder="Ime" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400">DATUM ROĐENJA</label>
                                                <input type="date" required value={member.dob} onChange={e => updateFamilyMember(idx, 'dob', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-zinc-400">ODNOS</label>
                                                <select value={member.relation} onChange={e => updateFamilyMember(idx, 'relation', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm">
                                                    <option value="child">Dijete</option>
                                                    <option value="spouse">Supružnik</option>
                                                    <option value="parent">Roditelj</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {familyMembers.length === 0 && <p className="text-xs text-purple-400 italic text-center py-2">Kliknite "Dodaj člana" za unos djece ili supružnika.</p>}
                            </div>
                        )}

                        {/* SECTION D: CORPORATE */}
                        {regType === 'corporate' && (
                            <div className="space-y-4 pt-4 border-t border-zinc-100 bg-amber-50/50 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Podaci o Tvrtki</h3>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500">IME TVRTKE</label>
                                        <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500">OIB TVRTKE (MBS)</label>
                                        <input type="text" required value={companyOib} onChange={e => setCompanyOib(e.target.value)} className="w-full p-3 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION E: CONSENTS */}
                        <div className="space-y-4 pt-6 border-t border-zinc-100">
                            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl">
                                <input type="checkbox" required checked={consents.statute} onChange={e => setConsents({ ...consents, statute: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">Prihvaćam Statut Udruge</p>
                                    <p className="text-xs text-zinc-500">Obavezno po Zakonu o udrugama.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl">
                                <input type="checkbox" required checked={consents.data} onChange={e => setConsents({ ...consents, data: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">Pristanak na prikupljanje podataka</p>
                                    <p className="text-xs text-zinc-500">Slažem se da se moji podaci koriste u svrhu vođenja Registra članova (GDPR).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white border border-zinc-200 rounded-xl">
                                <input type="checkbox" checked={consents.marketing} onChange={e => setConsents({ ...consents, marketing: e.target.checked })} className="mt-1 w-5 h-5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">Newsletter i Obavijesti</p>
                                    <p className="text-xs text-zinc-500">Želim primati novosti o akcijama i događanjima.</p>
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
                            {loading ? 'Obrađivanje...' : 'Završi Registraciju'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
