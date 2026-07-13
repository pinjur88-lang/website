"use client";

import { FileText, Search, Scale, Users, FileSignature, AlertTriangle, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function VlasnistvoPage() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                    Rješavanje Imovinsko-Pravnih Odnosa
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                    Mnoge kuće i parcele u Baljcima još uvijek glase na djedove ili pradjedove. Vlasništvo je često podijeljeno na desetke nasljednika. Ovdje je korak-po-korak vodič kako prenijeti vlasništvo na svoje ime.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-12">

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                            Utvrđivanje trenutnog stanja
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p className="text-slate-600">
                                Prvi korak je provjeriti tko je službeno upisan kao vlasnik u Zemljišnim knjigama (Gruntovnici) i Katastru.
                            </p>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                                <p className="font-semibold text-slate-800 flex items-center gap-2"><Search size={16} className="text-blue-500" /> Pronađite broj čestice:</p>
                                <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                                    <li>Posjetite stranicu <a href="https://oss.uredjenazemlja.hr/" target="_blank" className="text-blue-600 hover:underline">Uređena Zemlja (OSS)</a>.</li>
                                    <li>Katastarska općina je <strong>K.O. Baljci</strong>.</li>
                                    <li>Zabilježite broj katastarske čestice (k.č.) i broj zemljišnoknjižnog uloška (z.k. uložak).</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
                            Prikupljanje dokumentacije (Izvodi)
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p className="text-slate-600">
                                Ako je upisani vlasnik preminuo (npr. djed ili pradjed), morate dokazati pravno sljedništvo (srodstvo).
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="border border-slate-200 p-4 rounded-lg flex gap-3">
                                    <FileText className="text-indigo-400 shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">Smrtni listovi</p>
                                        <p className="text-xs text-slate-500 mt-1">Za preminulog vlasnika i sve preminule nasljednike u nizu do vas.</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-lg flex gap-3">
                                    <Users className="text-indigo-400 shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">Rodni listovi</p>
                                        <p className="text-xs text-slate-500 mt-1">Vaš rodni list i rodni listovi vaših roditelja kako biste dokazali vezu.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</span>
                            Pokretanje ostavinske rasprave
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p className="text-slate-600">
                                Ako iza pokojnika nikada nije provedena ostavinska rasprava, morate ju pokrenuti tzv. <strong>Prijedlogom za naknadno pronađenu imovinu</strong>.
                            </p>
                            <ul className="space-y-3 text-slate-600 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span>Prijedlog se podnosi Općinskom sudu u Drnišu/Šibeniku ili javnom bilježniku.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span>Sud će pozvati sve zakonske nasljednike (braću, sestre, rođake).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span>Ostali nasljednici vam se mogu ustupiti (odreći se svog dijela u vašu korist) pisanom izjavom (Punomoć).</span>
                                </li>
                            </ul>
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                                <AlertTriangle className="text-amber-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-amber-900 text-sm">Napomena o Punomoćima (Dijaspora)</p>
                                    <p className="text-sm text-amber-800 mt-1">
                                        Ako vaši rođaci žive u inozemstvu (Srbija, Njemačka, Australija), oni mogu potpisati specijalnu punomoć kod svog lokalnog notara, apostilirati je (ako je potrebno) i poslati vama kako ne bi morali dolaziti u Hrvatsku na ročišta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                            Pojedinačni ispravni postupak (Opcija B)
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p className="text-slate-600">
                                Što ako su upisani vlasnici nepoznati, davno preminuli i ne možete naći sve nasljednike, ali vi godinama koristite tu kuću ili parcelu (tzv. "pošteni posjednik")?
                            </p>
                            <p className="text-slate-600 text-sm">
                                Tada se pokreće <strong>Pojedinačni ispravni postupak (PIP)</strong>. Dokazujete sudu (uz pomoć svjedoka iz sela) da ste vi i vaši preci jedini koristili to zemljište zadnjih 20+ godina (dosjelost). Sud objavljuje oglas i ako se nitko ne žali, upisuje vas kao 1/1 vlasnika.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">5</span>
                            Angažiranje stručnjaka
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p className="text-slate-600">
                                Sređivanje papira gotovo je nemoguće bez lokalnog odvjetnika (zbog ročišta i pravnih zavrzlama) te geodeta (ako međe nisu točne).
                            </p>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><MapPin size={16} /> Preporuke iz Drniša / Knina:</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2">
                                        <span className="font-medium text-slate-800">Geodetski ured (Mjerenje parcela)</span>
                                        <span className="italic text-slate-500">Traži se preporuka...</span>
                                    </li>
                                    <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2">
                                        <span className="font-medium text-slate-800">Odvjetnički ured (Pravni postupak)</span>
                                        <span className="italic text-slate-500">Traži se preporuka...</span>
                                    </li>
                                    <li className="flex flex-col sm:flex-row sm:items-center justify-between">
                                        <span className="font-medium text-slate-800">Javni Bilježnik</span>
                                        <span className="italic text-slate-500">Bilo koji bilježnik u Drnišu</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
