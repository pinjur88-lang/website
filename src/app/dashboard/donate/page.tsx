"use client";

import { useLanguage } from "@/lib/language-context";
import Image from "next/image";
import { CreditCard, Landmark, Check, Globe } from "lucide-react";

export default function DashboardDonatePage() {
    const { t, language, setLanguage } = useLanguage();

    const toggleLang = () => {
        if (language === "en") setLanguage("hr");
        else if (language === "hr") setLanguage("sr");
        else if (language === "sr") setLanguage("de");
        else setLanguage("en");
    };

    const STRIPE_LINK = "https://buy.stripe.com/5kQbJ160x3l6g8Q6FK4ZG00";
    const WISE_LINK = "https://wise.com/pay/me/udrugabaljci";

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Language Toggle */}
            <div className="flex justify-end">
                <button
                    onClick={toggleLang}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm w-fit group"
                >
                    <Globe className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-sm font-medium">
                        {t.donateLanguageName}
                    </span>
                </button>
            </div>

            <div className="flex flex-col gap-10">

                {/* Option 1: Fast (Small Donors) */}
                <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">

                        <div className="flex-1">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-4">
                                {t.donateOpt1Badge}
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{t.donateOpt1Title}</h2>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                        {t.donateOpt1Desc}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                                    <span className="font-medium text-zinc-900 dark:text-white text-sm">{t.donateOpt1Speed}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-sky-500" />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.donateOpt1Method}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-sky-500" />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.donateOpt1Impact}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px] justify-center">
                            <a
                                href={STRIPE_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-4 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-sky-500/25 active:scale-95 text-center transform hover:-translate-y-0.5 w-full block"
                            >
                                {t.donateButton}
                            </a>
                            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5 pt-2">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                                </svg>
                                {t.donateSecure}
                            </p>
                        </div>

                    </div>
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center">
                    <span className="px-4 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-xs font-bold text-zinc-400 tracking-widest border border-zinc-200 dark:border-zinc-800">
                        {t.donateOr}
                    </span>
                </div>

                {/* Option 2: Efficient (Large Donors) */}
                <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-sky-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative h-full bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col">

                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 w-fit">
                            {t.donateOpt2Badge}
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                <Landmark className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{t.donateOpt2Title}</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
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
                                        <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateEuropeTitle}</h4>
                                        <div className="text-xs space-y-0.5 text-zinc-600 dark:text-zinc-400 font-mono pl-2">
                                            <p>{t.donateBeneficiary}</p>
                                            <p className="select-all font-bold text-zinc-900 dark:text-zinc-200">{t.donateIban}</p>
                                            <p>{t.donateBic}</p>
                                        </div>
                                    </div>

                                    {/* UK */}
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUkTitle}</h4>
                                        <div className="text-xs space-y-0.5 text-zinc-600 dark:text-zinc-400 font-mono pl-2">
                                            <p>{t.donateBeneficiary}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateAccount}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateSortCode}</p>
                                            <p>{t.donateUkIban}</p>
                                            <p>{t.donateUkBic}</p>
                                        </div>
                                    </div>

                                    {/* USA */}
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUsaTitle}</h4>
                                        <div className="text-xs space-y-0.5 text-zinc-600 dark:text-zinc-400 font-mono pl-2">
                                            <p>{t.donateBeneficiary}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateUsaAccount}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateRouting}</p>
                                            <p>{t.donateUsaBic}</p>
                                        </div>
                                    </div>

                                    {/* Australia */}
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-xs uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateAustraliaTitle}</h4>
                                        <div className="text-xs space-y-0.5 text-zinc-600 dark:text-zinc-400 font-mono pl-2">
                                            <p>{t.donateBeneficiary}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateAusAccount}</p>
                                            <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateBsb}</p>
                                            <p>{t.donateAusBic}</p>
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
