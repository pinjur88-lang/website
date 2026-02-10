'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Heart, Coins, TrendingUp, Users, CheckCircle2, Lock, ArrowRight, User } from 'lucide-react';
import { getProjects, getDonations, createDonation } from '@/actions/donations';
import Link from 'next/link';

// Types
type Project = {
    id: string;
    title: string;
    description: string;
    goal_amount: number;
    current_amount: number;
    image_url?: string;
};

type Donation = {
    donor_name: string;
    amount: number;
    currency: string;
    message?: string;
    created_at: string;
};

export default function DonatePage() {
    const { user } = useAuth();
    const { t } = useLanguage();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [donations, setDonations] = useState<Donation[]>([]);

    // Donation Form State
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [amount, setAmount] = useState<number>(50);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    // Guest Fields
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    // Options
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [inMemoryOf, setInMemoryOf] = useState(false);

    // Status
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showUpsell, setShowUpsell] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const pRes = await getProjects();
        if (pRes.data) {
            setProjects(pRes.data);
            if (pRes.data.length > 0) {
                // Load ticker donations for the first project (or aggregate later)
                // For now, let's just get recent donations for the first project as a sample
                const dRes = await getDonations(pRes.data[0].id);
                if (dRes.data) setDonations(dRes.data);
            }
        }
        setLoading(false);
    };

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;

        const finalAmount = isCustom ? parseFloat(customAmount) : amount;
        if (!finalAmount || finalAmount <= 0) {
            alert("Molimo unesite valjani iznos.");
            return;
        }

        const nameToUse = user ? user.name : guestName;
        const emailToUse = user ? user.email : guestEmail;

        if (!nameToUse || !emailToUse) {
            alert("Molimo unesite ime i email.");
            return;
        }

        setSubmitting(true);
        const res: any = await createDonation({
            projectId: selectedProject.id,
            amount: finalAmount,
            donorName: nameToUse,
            donorEmail: emailToUse,
            message: inMemoryOf ? `U sjećanje na: ${message}` : message,
            isAnonymous
        });

        setSubmitting(false);

        if (res?.error) {
            alert("Greška: " + res.error);
        } else {
            setSuccess(true);
            if (res?.isGuest) {
                setShowUpsell(true);
            }
            loadData(); // Refresh progress bars
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500">Učitavanje projekata...</div>;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* HERO SECTION */}
            <div className="bg-zinc-900 text-white py-16 px-4">
                <div className="max-w-5xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <Heart size={14} /> Otvoreno za sve
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold">Investirajte u Budućnost Sela</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Vaše donacije direktno financiraju obnovu infrastrukture, očuvanje baštine i razvoj zajednice.
                        Transparentno i s vidljivim rezultatima.
                    </p>
                </div>
            </div>

            {/* WALL OF THANKS (TICKER) */}
            {donations.length > 0 && (
                <div className="bg-zinc-800 border-t border-zinc-700 overflow-hidden py-2 relative">
                    <div className="flex animate-marquee gap-8 whitespace-nowrap px-4">
                        {/* Duplicate list for seamless loop */}
                        {[...donations, ...donations].map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                <span className="font-bold text-white">{d.donor_name}</span>
                                <span className="text-emerald-400">€{d.amount}</span>
                                {d.message && <span className="italic opacity-60">"{d.message}"</span>}
                                <span className="mx-2 text-zinc-600">•</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CAMPAIGN GRID */}
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => {
                        const percent = Math.min(100, Math.round((project.current_amount / project.goal_amount) * 100));
                        return (
                            <div key={project.id} className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-zinc-200 relative">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                                            <TrendingUp size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        Cilj: €{project.goal_amount.toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2">{project.title}</h3>
                                    <p className="text-zinc-500 text-sm mb-6 flex-grow">{project.description}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-zinc-600">Prikupljeno: €{project.current_amount.toLocaleString()}</span>
                                            <span className="text-emerald-600">{percent}%</span>
                                        </div>
                                        <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setSuccess(false);
                                            setShowUpsell(false);
                                            // Scroll to modal/form if needed
                                        }}
                                        className="w-full py-3 bg-zinc-900 text-white rounded-lg font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Coins size={18} /> Doniraj Sada
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DONATION MODAL */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

                        {/* SUCCESS STATE */}
                        {success ? (
                            <div className="p-8 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300 delay-100">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900">Hvala na Donaciji!</h2>
                                <p className="text-zinc-600">
                                    Vaša velikodušnost pomaže u ostvarenju projekta <span className="font-bold">"{selectedProject.title}"</span>.
                                </p>

                                {/* UPSELL FOR GUESTS */}
                                {showUpsell && (
                                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl mt-4 text-left">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 hidden sm:block">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-amber-900 text-lg mb-1">Već ste na pola puta!</h3>
                                                <p className="text-amber-800 text-sm mb-4 leading-relaxed">
                                                    Donirali ste kao gost, ali možete pratiti ovaj projekt i dobiti status "Prijatelja Sela" ako se registrirate. Besplatno je.
                                                </p>
                                                <Link href="/register" className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors shadow-sm">
                                                    Registriraj se <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => setSelectedProject(null)} className="text-zinc-400 hover:text-zinc-600 text-sm underline mt-4">
                                    Zatvori prozor
                                </button>
                            </div>
                        ) : (
                            // FORM STATE
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                                    <div>
                                        <h3 className="font-bold text-lg text-zinc-900">Donacija za Projekt</h3>
                                        <p className="text-xs text-zinc-500 truncate max-w-[250px]">{selectedProject.title}</p>
                                    </div>
                                    <button onClick={() => setSelectedProject(null)} className="text-zinc-400 hover:text-zinc-600">
                                        <div className="sr-only">Zatvori</div>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>

                                <form onSubmit={handleDonate} className="p-6 space-y-6">

                                    {/* Amount Selection */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Odaberite Iznos</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[20, 50, 100].map(val => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => { setAmount(val); setIsCustom(false); }}
                                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${!isCustom && amount === val ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}
                                                >
                                                    €{val}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setIsCustom(true)}
                                                className={`py-2 rounded-lg text-sm font-bold border transition-all ${isCustom ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}
                                            >
                                                Drugo
                                            </button>
                                        </div>
                                        {isCustom && (
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">€</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={customAmount}
                                                    onChange={e => setCustomAmount(e.target.value)}
                                                    className="w-full pl-8 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                                                    placeholder="Upišite iznos"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Personal Info (Only for Guests) */}
                                    {!user && (
                                        <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                            <div className="flex items-center gap-2 mb-2 text-zinc-900 font-bold text-sm">
                                                <User size={16} /> Podaci Donatora
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    value={guestName}
                                                    onChange={e => setGuestName(e.target.value)}
                                                    className="w-full p-2 border border-zinc-200 rounded text-sm"
                                                    placeholder="Vaše Ime i Prezime"
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    value={guestEmail}
                                                    onChange={e => setGuestEmail(e.target.value)}
                                                    className="w-full p-2 border border-zinc-200 rounded text-sm"
                                                    placeholder="Vaš Email (Za potvrdu)"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Optional Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600">
                                                <input type="checkbox" checked={inMemoryOf} onChange={e => setInMemoryOf(e.target.checked)} className="rounded text-zinc-900 focus:ring-zinc-900" />
                                                U sjećanje na nekoga?
                                            </label>
                                        </div>
                                        {inMemoryOf && (
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                className="w-full p-2 border border-zinc-300 rounded text-sm"
                                                placeholder="Upišite ime pokojnika..."
                                            />
                                        )}

                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600">
                                            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded text-zinc-900 focus:ring-zinc-900" />
                                            Anonimna donacija (sakrij ime s liste zahvale)
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? 'Obrada...' : 'Doniraj Putem Uplata'}
                                    </button>
                                    <p className="text-[10px] text-center text-zinc-400">
                                        Klikom na gumb dobit ćete podatke za uplatu. Ovo je neobvezujući iskaz namjere.
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
