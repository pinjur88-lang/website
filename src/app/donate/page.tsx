"use client";

import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, Landmark, Check, Globe } from "lucide-react";

export default function DonatePage() {
  const { t, language, setLanguage } = useLanguage();

  const toggleLang = () => {
    if (language === "en") setLanguage("hr");
    else if (language === "hr") setLanguage("sr");
    else if (language === "sr") setLanguage("de");
    else setLanguage("en");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Navigation / Language Toggle */}
      <nav className="fixed top-0 right-0 p-6 z-50">
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm group"
        >
          <Globe className="w-4 h-4 text-zinc-500 group-hover:text-indigo-500 transition-colors" />
          <span className="text-sm font-medium">
            {t.donateLanguageName}
          </span>
        </button>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.donateBack}
          </Link>

          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent pb-1">
              {t.donateHeadline}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
              {t.donateSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10">

          {/* Option 1: Credit Card (Small/Small-Medium) */}
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 uppercase tracking-wider">
                  {t.donateOpt1Badge}
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">{t.donateOpt1Title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
                      {t.donateOpt1Desc}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="font-medium text-zinc-900 dark:text-white text-sm">{t.donateOpt1Speed}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.donateOpt1Method}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px] justify-center pt-4 md:pt-0">
                <div className="grid grid-cols-1 gap-3">
                  {[20, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      €{amount}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pt-2">
                  {t.donateSecure}
                </p>
              </div>
            </div>
          </div>

          {/* Option 2: Bank Transfer (Direct & Traditional) */}
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 uppercase tracking-wider">
                  {t.donateOpt2Badge}
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Landmark className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">{t.donateOpt2Title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-md">
                      {t.donateOpt2Desc}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-black/20 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
                    {t.donateBankDetails}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {/* Europe */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateEuropeTitle}</h4>
                      <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono pl-2 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] opacity-70">{t.donateBeneficiary}</p>
                        <p className="select-all font-bold text-zinc-900 dark:text-zinc-200 text-sm tracking-tight">{t.donateIban}</p>
                        <p className="text-[10px]">{t.donateBic}</p>
                      </div>
                    </div>

                    {/* USA */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUsaTitle}</h4>
                      <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono pl-2 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] opacity-70">{t.donateBeneficiary}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateUsaAccount}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateRouting}</p>
                      </div>
                    </div>

                    {/* Australia */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateAustraliaTitle}</h4>
                      <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono pl-2 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] opacity-70">{t.donateBeneficiary}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateAusAccount}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateBsb}</p>
                      </div>
                    </div>

                    {/* UK */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">{t.donateUkTitle}</h4>
                      <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono pl-2 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] opacity-70">{t.donateBeneficiary}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateAccount}</p>
                        <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.donateSortCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Option 3: Wise (Fast & Global) */}
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-3xl blur opacity-15 group-hover:opacity-35 transition duration-500"></div>
            <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                  Wise Transfer
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">Wise to Wise</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
                      The fastest way to send funds globally with near-zero fees. Perfect for international supporters.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="https://wise.com/pay/business/udrugagradjanabaljci?utm_source=quick_pay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                  >
                    Open Wise Quick Pay
                  </a>
                  <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-medium">Or use: udrugabaljci@gmail.com</p>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-center justify-center bg-zinc-50 dark:bg-black/30 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner">
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
                  <Image
                    src="/wise-quick-pay-qr-code.png"
                    alt="Wise Quick Pay QR Code"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.scanToPay || 'Scan to Pay'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
