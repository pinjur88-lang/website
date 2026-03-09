"use client";

import { useLanguage } from "@/lib/language-context";
import Image from "next/image";
import { CreditCard, Landmark, Check } from "lucide-react";

export default function DashboardDonatePage() {
    const { t } = useLanguage();
    const WISE_LINK = "https://wise.com/pay/business/udrugagradjanabaljci?utm_source=quick_pay";

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">

            <div className="flex flex-col gap-10">

                {/* Efficient Donations */}
                <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-sky-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative h-full bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-xl border border-blue-200 dark:border-blue-800/60 rounded-2xl p-8 flex flex-col">

                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 w-fit">
                            {t.donateOpt2Badge}
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                <Landmark className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">{t.donateOpt2Title}</h2>
                                <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed font-medium">
                                    {t.donateOpt2Desc}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    <span className="font-bold block mb-1 text-red-900 dark:text-red-100 uppercase text-xs tracking-wider">{t.donateProblemLabel}</span>
                                    {t.donateProblemText}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-bold block mb-1 text-blue-900 dark:text-red-100 uppercase text-xs tracking-wider">{t.donateSolutionLabel}</span>
                                    {t.donateSolutionText}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/50">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                                {t.donateBankDetails}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Wise Quick Pay QR Code - LEFT */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mb-3">
                                        <Image
                                            src="/wise-quick-pay-qr-code.png"
                                            alt="Wise Quick Pay QR Code"
                                            width={180}
                                            height={180}
                                            className="object-contain"
                                        />
                                        <p className="text-center text-xs text-zinc-500 mt-2 font-medium">Scan to Pay with Wise</p>
                                        <p className="text-center text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">Wise to Wise</p>
                                    </div>
                                    <a
                                        href={WISE_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                                    >
                                        <span>Click to Pay (Link)</span>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Bank Details - RIGHT - Simplified */}
                                <div className="space-y-6">
                                    {/* Europe */}
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateEuropeTitle}</h4>
                                        <div className="text-xs space-y-1 mt-2 text-zinc-800 dark:text-zinc-300 font-mono pl-2">
                                            <p className="font-medium">{t.donateBeneficiary}</p>
                                            <p className="select-all font-bold text-black dark:text-white text-sm bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateIban}</p>
                                            <p className="font-medium">{t.donateBic}</p>
                                        </div>
                                    </div>

                                    {/* UK */}
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUkTitle}</h4>
                                        <div className="text-xs space-y-1 mt-2 text-zinc-800 dark:text-zinc-300 font-mono pl-2">
                                            <p className="font-medium">{t.donateBeneficiary}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateAccount}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateSortCode}</p>
                                            <p className="select-all font-medium">{t.donateUkIban}</p>
                                            <p className="font-medium">{t.donateUkBic}</p>
                                        </div>
                                    </div>

                                    {/* USA */}
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUsaTitle}</h4>
                                        <div className="text-xs space-y-1 mt-2 text-zinc-800 dark:text-zinc-300 font-mono pl-2">
                                            <p className="font-medium">{t.donateBeneficiary}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateUsaAccount}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateRouting}</p>
                                            <p className="font-medium">{t.donateUsaBic}</p>
                                        </div>
                                    </div>

                                    {/* Australia */}
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateAustraliaTitle}</h4>
                                        <div className="text-xs space-y-1 mt-2 text-zinc-800 dark:text-zinc-300 font-mono pl-2">
                                            <p className="font-medium">{t.donateBeneficiary}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateAusAccount}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateBsb}</p>
                                            <p className="font-medium">{t.donateAusBic}</p>
                                        </div>
                                    </div>

                                    {/* Canada */}
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateCanadaTitle}</h4>
                                        <div className="text-xs space-y-1 mt-2 text-zinc-800 dark:text-zinc-300 font-mono pl-2">
                                            <p className="font-medium">{t.donateBeneficiary}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateCadAccount}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateCadInstitution}</p>
                                            <p className="font-bold text-black dark:text-white bg-white/50 dark:bg-black/30 w-fit px-1 rounded">{t.donateCadTransit}</p>
                                            <p className="font-medium">{t.donateCadBic}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
