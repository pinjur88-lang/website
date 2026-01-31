"use client";

import { useState } from 'react';
import { ArrowLeft, Check, Lock, Leaf, Heart, Award, Footprints } from 'lucide-react';
import Link from 'next/link';

export default function DonatePage() {
    // --------------------------------------------------------------------------------
    // 1. STATE & STATIC DATA (As per user instruction to keep it manual for now)
    // --------------------------------------------------------------------------------
    const BANK_BALANCE = 1240.00;
    const GOAL_TARGET = 2500.00; // Example target for "Village Path" (calculated from 45% = 1240ish?) Let's say target is 2750.
    // 45% of X = 1240 => X = 2755. Let's make it simple.
    // Let's stick to the prompt's example: "Next Goal: Village Path Cleaning (45% funded)"
    const GOAL_PERCENTAGE = 45;

    // Helpers
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

    const [customAmount, setCustomAmount] = useState<string>('');

    // Impact Logic
    const getImpactBadge = (amount: number) => {
        if (amount >= 500) return { text: "Restores 1 Historic Stone Wall", icon: <Lock size={16} /> };
        if (amount >= 100) return { text: "Plants 5 Olive Trees", icon: <Leaf size={16} /> };
        if (amount >= 50) return { text: "Cleans 5m of Village Road", icon: <Footprints size={16} /> };
        if (amount >= 20) return { text: "Supports Monthly Maintenance", icon: <Check size={16} /> };
        return null;
    };

    const impact = customAmount ? getImpactBadge(parseFloat(customAmount)) : null;

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
            {/* Header / Nav */}
            <nav className="bg-white border-b border-stone-200 p-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <span className="font-serif font-bold text-stone-900">Udruga Baljci</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 py-8 space-y-12">

                {/* 1. TRANSPARENCY DASHBOARD */}
                <section className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="bg-slate-800 text-white p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">Transparency Dashboard</h1>
                        <p className="text-slate-300 max-w-2xl">
                            We believe in radical transparency. Every cent donated goes directly into the village infrastructure.
                            Here is our live financial status.
                        </p>
                    </div>

                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                        {/* Widget 1: Bank Balance */}
                        <div className="flex flex-col gap-1 border-l-4 border-green-600 pl-4">
                            <span className="text-sm uppercase tracking-widest text-stone-500 font-bold">Current Funds Available</span>
                            <span className="text-4xl font-mono font-bold text-slate-800">{formatCurrency(BANK_BALANCE)}</span>
                            <div className="flex items-center gap-2 text-xs text-green-600 font-medium mt-1">
                                <Check size={12} /> Verified by Treasurer
                            </div>
                        </div>

                        {/* Widget 2: Live Goal Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-800">Next Goal: Village Path Cleaning</span>
                                <span className="text-2xl font-bold text-green-700">{GOAL_PERCENTAGE}%</span>
                            </div>
                            <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${GOAL_PERCENTAGE}%` }}
                                />
                            </div>
                            <p className="text-xs text-stone-500 text-right">Target: {formatCurrency(2750)}</p>
                        </div>
                    </div>
                </section>

                {/* 2. MEMBERSHIP TIERS */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-3">Membership Tiers</h2>
                        <p className="text-stone-600">Choose your level of impact.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Bronze */}
                        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-50 px-2 py-1 rounded-sm">Bronze</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Supporter</h3>
                            <div className="text-3xl font-bold text-slate-900 mb-4">€20 <span className="text-sm font-normal text-stone-500">/ year</span></div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> Digital Newsletter</li>
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> Access to Community Wall</li>
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> Annual Report</li>
                            </ul>
                            <button className="w-full py-3 bg-white border-2 border-slate-800 text-slate-800 font-bold rounded hover:bg-slate-50 transition-colors">
                                Join Bronze
                            </button>
                        </div>

                        {/* Silver */}
                        <div className="bg-white p-6 rounded-lg border-2 border-slate-800 shadow-lg transform md:-translate-y-2 flex flex-col relative">
                            <div className="absolute top-0 right-0 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
                            <div className="mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-1 rounded-sm">Silver</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Voting Member</h3>
                            <div className="text-3xl font-bold text-slate-900 mb-4">€50 <span className="text-sm font-normal text-stone-500">/ year</span></div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> <b>All Bronze Benefits</b></li>
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> <b>Right to Vote</b> on Projects</li>
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> Member ID Card</li>
                            </ul>
                            <button className="w-full py-3 bg-slate-800 text-white font-bold rounded hover:bg-slate-700 transition-colors shadow-md">
                                Join Silver
                            </button>
                        </div>

                        {/* Gold */}
                        <div className="bg-white p-6 rounded-lg border border-yellow-200 bg-gradient-to-b from-yellow-50/50 to-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-yellow-700 bg-yellow-100 px-2 py-1 rounded-sm">Gold</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Legacy Patron</h3>
                            <div className="text-3xl font-bold text-slate-900 mb-4">€500 <span className="text-sm font-normal text-stone-500">/ one-time</span></div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex gap-2 text-sm text-stone-600"><Check size={16} className="text-green-600" /> <b>All Silver Benefits</b> (Lifetime)</li>
                                <li className="flex gap-2 text-sm text-stone-600"><Award size={16} className="text-yellow-600" /> <b>Name Engraved</b> on Village Wall</li>
                                <li className="flex gap-2 text-sm text-stone-600"><Award size={16} className="text-yellow-600" /> VIP Dinner Invitation</li>
                            </ul>
                            <button className="w-full py-3 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700 transition-colors">
                                Become a Patron
                            </button>
                        </div>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-12 pt-8">
                    {/* 3. ONE-TIME DONATION ("Impact Badges") */}
                    <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Make a One-Time Donation</h3>
                        <p className="text-stone-600 text-sm mb-6">Not ready to join? Support a specific cause directly.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Amount (€)</label>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    placeholder="e.g. 50"
                                    className="w-full text-2xl font-bold p-3 border border-stone-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            {/* Impact Badge */}
                            <div className={`p-4 rounded-lg border transition-all duration-300 ${impact ? 'bg-green-50 border-green-200 opacity-100' : 'bg-stone-50 border-stone-100 opacity-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${impact ? 'bg-green-200 text-green-800' : 'bg-stone-200 text-stone-400'}`}>
                                        {impact ? impact.icon : <Heart size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase text-stone-400">Your Impact</div>
                                        <div className={`font-bold ${impact ? 'text-green-800' : 'text-stone-400'}`}>
                                            {impact ? impact.text : "Enter an amount to see your impact"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-green-700 text-white font-bold rounded hover:bg-green-800 transition-colors">
                                Donate {customAmount ? `€${customAmount}` : ''}
                            </button>
                        </div>
                    </section>

                    {/* 4. WALL OF THANKS */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Heart className="text-red-500" fill="currentColor" size={20} /> Wall of Thanks
                        </h3>

                        <div className="bg-white rounded-lg border border-stone-100 shadow-sm overflow-hidden">
                            {[
                                { name: "Marko Horvat", amount: 500, date: "Yesterday" },
                                { name: "Anonymous", amount: 50, date: "2 days ago" },
                                { name: "Ivan P.", amount: 100, date: "5 days ago" },
                                { name: "Sarah Miller", amount: 200, date: "1 week ago" },
                                { name: "Family Jurić", amount: 50, date: "1 week ago" },
                            ].map((donor, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {donor.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-slate-700">{donor.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-700">€{donor.amount}</div>
                                        <div className="text-xs text-stone-400">{donor.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <button className="text-sm text-stone-500 hover:text-slate-800 underline">View All Donors</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
