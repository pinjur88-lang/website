import React from 'react';
import { Scroll, Info, Users, Shield, Gavel, Scale } from 'lucide-react';

export default function StatutePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                            <Scale className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">SAŽETAK STATUTA</h1>
                    </div>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Jednostavan pregled naših pravila i načela, prilagođen za brzo čitanje.
                        Ovo je neslužbeni sažetak – za pravne detalje pogledajte puni PDF dokument.
                    </p>
                </div>

                <div className="p-6 md:p-8 space-y-12">

                    {/* SECTION 1 */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <Info className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-wide">1. TKO SMO MI (Who We Are)</h2>
                                <ul className="space-y-3 pl-4 border-l-2 border-blue-100">
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Ime:</span> Udruga Građana Baljci.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Pravni status:</span> Registrirana neprofitna organizacija u Republici Hrvatskoj.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Sjedište:</span> Baljci, Hrvatska.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Javnost rada:</span> Naš rad je javan. Izvještavamo o aktivnostima putem web stranice, društvenih mreža i godišnjih izvještaja.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2 */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                <Scroll className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-wide">2. NAŠA MISIJA I AKTIVNOSTI</h2>
                                <p className="text-slate-600 italic">Postojimo kako bismo revitalizirali Baljke kroz specifična područja djelovanja:</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-1">Razvoj zajednice</h3>
                                        <p className="text-sm text-slate-600">Suradnja s lokalnim agencijama na poboljšanju infrastrukture i dobrobiti.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-1">Ekologija</h3>
                                        <p className="text-sm text-slate-600">Zaštita prirodnih područja, upravljanje otpadom i promicanje obnovljive energije.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-1">Baština</h3>
                                        <p className="text-sm text-slate-600">Obnova spomenika, starih puteva i očuvanje naše kulturne povijesti.</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-1">Podrška</h3>
                                        <p className="text-sm text-slate-600">Pružanje humanitarne pomoći u krizama i podrška starijima ili nemoćnima.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3 */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-wide">3. ČLANSTVO (Membership)</h2>
                                <p className="text-slate-600">Svatko (osoba ili tvrtka) tko prihvaća naš Statut može se pridružiti. Članstvo počinje odobrenjem odbora i plaćanjem članarine.</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md">
                                        <div className="w-2 h-2 rounded-full bg-slate-900" />
                                        <p><span className="font-semibold text-slate-900">Redovni članovi:</span> Aktivno sudjeluju u radu Udruge i imaju puno pravo glasa.</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md">
                                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                                        <p><span className="font-semibold text-slate-900">Pridruženi članovi:</span> Podupiratelji koji doprinose ciljevima, ali sudjeluju manje aktivno.</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-md">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <p><span className="font-semibold text-slate-900">Počasni članovi:</span> Pojedinci priznati za izniman doprinos (ne plaćaju članarinu).</p>
                                    </div>
                                </div>
                                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-2">
                                    Prestanak članstva: Članstvo prestaje ako dobrovoljno istupite, ne platite članarinu do kraja godine ili prekršite Statut.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4 */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                                <Gavel className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-wide">4. UPRAVLJANJE (Governance)</h2>
                                <ul className="space-y-4 pl-4 border-l-2 border-orange-100">
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900 block mb-1">Skupština:</span>
                                        Najviše tijelo. Čine ga svi punoljetni redovni članovi. Sastajemo se najmanje jednom godišnje radi odobrenja proračuna i planova.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900 block mb-1">Digitalno glasanje:</span>
                                        Naš Statut izričito dopušta održavanje Skupština putem video konferencije, osiguravajući da naša globalna dijaspora može glasati.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900 block mb-1">Upravni Odbor:</span>
                                        3 člana izabrana na mandat od 4 godine. Oni vode svakodnevne operacije i izvršenje.
                                    </li>
                                    <li className="text-slate-700">
                                        <span className="font-semibold text-slate-900 block mb-1">Predsjednik:</span>
                                        Zakonski zastupa Udrugu i služi mandat od 4 godine.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5 */}
                    <section className="border-t border-slate-100 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-wide">5. FINANCIJE I IMOVINA</h2>
                                <div className="bg-indigo-50/50 p-4 rounded-xl space-y-3">
                                    <p className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Financiranje:</span> Naša sredstva dolaze od članarina, donacija, potpora i ovlaštenih gospodarskih djelatnosti.
                                    </p>
                                    <p className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Upotreba:</span> Novac se može koristiti <em>samo</em> za postizanje ciljeva Udruge. Mi smo neprofitna organizacija.
                                    </p>
                                    <p className="text-slate-700">
                                        <span className="font-semibold text-slate-900">Izvještavanje:</span> Predsjednik mora podnijeti financijsko izvješće Skupštini svake godine.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
