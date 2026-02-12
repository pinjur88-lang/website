"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, Landmark, Check, Globe } from "lucide-react";

export default function DonatePage() {
  const [lang, setLang] = useState<"en" | "hr">("en");

  const toggleLang = () => {
    setLang(lang === "en" ? "hr" : "en");
  };

  const content = {
    en: {
      headline: "Build Baljci. One Stone at a Time.",
      subtitle: "Choose how you want to make an impact today.",
      option1: {
        title: "Option 1: Quick Support",
        badge: "Recommended for under €500",
        desc: "Perfect for buying a round of drinks for the volunteers, fixing a meter of the wall, or paying yearly dues.",
        speed: "Speed: Instant",
        method: "Method: Visa / Mastercard / Apple Pay",
        impact: "Impact: Immediate",
        button: "DONATE",
        secure: "Secure payment via Stripe",
      },
      option2: {
        title: "Option 2: Major Impact",
        badge: "Best for €500+",
        desc: "Are you sponsoring a solar light, a roof repair, or becoming a Founding Family?",
        problemLabel: "The Problem",
        problemText: "Credit card companies take 3% of your donation. On a €1,000 gift, that is €30 lost to fees.",
        solutionLabel: "The Solution",
        solutionText: "Use a direct Bank Transfer. It ensures 100% of your money goes to the village, not the bankers.",
        bankDetails: "Bank Details for Direct Transfer",
        europe: {
          title: "🇪🇺 For Europe (SEPA):",
          beneficiary: "Beneficiary: Udruga Gradjana Baljci",
          iban: "IBAN: BE34 9676 1385 7590 (Wise)",
          swift: "BIC: TRWIBEB1XXX (For outside SEPA)",
          address: "Bank: Wise, Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium",
        },
        uk: {
          title: "🇬🇧 For UK (GBP):",
          beneficiary: "Beneficiary: Udruga Gradjana Baljci",
          account: "Account: 52686623",
          sortCode: "Sort Code: 60-84-64",
          iban: "IBAN: GB84 TRWI 6084 6452 6866 23 (For outside UK)",
          swift: "BIC: TRWIGB2LXXX (For outside UK)",
          address: "Bank: Wise Payments Limited, Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom",
        },
        usa: {
          title: "🇺🇸 For USA (USD):",
          beneficiary: "Beneficiary: Udruga Gradjana Baljci",
          account: "Account: 213196290229 (Checking)",
          routing: "Routing (Wire/ACH): 101019628",
          swift: "BIC: TRWIUS35XXX (For outside US)",
          address: "Bank: Wise US Inc, 108 W 13th St, Wilmington, DE, 19801, United States",
        },
        australia: {
          title: "🇦🇺 For Australia (AUD):",
          beneficiary: "Beneficiary: Udruga Gradjana Baljci",
          account: "Account: 241068232",
          bsb: "BSB: 774-001",
          swift: "BIC: TRWIAUS1XXX (For outside Australia)",
          address: "Bank: Wise Australia Pty Ltd, Suite 1, Level 11, 66 Goulburn Street, Sydney, NSW, 2000, Australia",
        },
        canada: {
          title: "🇨🇦 For Canada (CAD):",
          beneficiary: "Beneficiary: Udruga Gradjana Baljci",
          account: "Account: 200117505729",
          institution: "Institution: 621",
          transit: "Transit: 16001",
          swift: "BIC: TRWICAW1XXX (For outside Canada)",
          address: "Bank: Wise Payments Canada Inc., 99 Bank Street, Suite 1420, Ottawa, ON, K1P 1H4, Canada",
          note: "Note: For Interac e-Transfer, use email below.",
          email: "Email: finance@udrugabaljci.com",
          autoDeposit: "(Auto-deposit enabled)",
        },
      },
      or: "OR",
      back: "Back to Home",
    },
    hr: {
      headline: "Gradimo Baljke. Kamen po Kamen.",
      subtitle: "Izaberite način na koji želite pomoći danas.",
      option1: {
        title: "Opcija 1: Brza Podrška",
        badge: "Preporučeno za iznose do €500",
        desc: "Idealno za \"okrenuti rundu\" volonterima, popravak metra suhozida ili plaćanje godišnje članarine.",
        speed: "Brzina: Trenutno",
        method: "Način: Visa / Mastercard / Apple Pay",
        impact: "Učinak: Odmah vidljiv",
        button: "DONIRAJ",
        secure: "Sigurno plaćanje putem Stripe-a",
      },
      option2: {
        title: "Opcija 2: Velike Donacije",
        badge: "Najbolje za €500+",
        desc: "Planirate li sponzorirati solarnu rasvjetu, popravak krova ili postati Obitelj Utemeljitelja?",
        problemLabel: "Problem",
        problemText: "Kartične kuće uzimaju 3% provizije. Na donaciju od €1,000, to je €30 bačeno u vjetar.",
        solutionLabel: "Rješenje",
        solutionText: "Koristite Direktnu Uplatu (Bank Transfer). Tako osiguravate da 100% vašeg novca ide za selo, a ne bankarima.",
        bankDetails: "Podaci za uplatu",
        europe: {
          title: "🇪🇺 Za Europu (SEPA):",
          beneficiary: "Primatelj: Udruga Gradjana Baljci",
          iban: "IBAN: BE34 9676 1385 7590 (Wise)",
          swift: "BIC: TRWIBEB1XXX (Izvan SEPA)",
          address: "Banka: Wise, Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium",
        },
        uk: {
          title: "🇬🇧 Za Ujedinjeno Kraljevstvo (GBP):",
          beneficiary: "Primatelj: Udruga Gradjana Baljci",
          account: "Račun: 52686623",
          sortCode: "Sort Code: 60-84-64",
          iban: "IBAN: GB84 TRWI 6084 6452 6866 23 (Izvan UK)",
          swift: "BIC: TRWIGB2LXXX (Izvan UK)",
          address: "Banka: Wise Payments Limited, Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom",
        },
        usa: {
          title: "🇺🇸 Za SAD (USD):",
          beneficiary: "Primatelj: Udruga Gradjana Baljci",
          account: "Račun: 213196290229 (Checking)",
          routing: "Routing (Wire/ACH): 101019628",
          swift: "BIC: TRWIUS35XXX (Izvan SAD-a)",
          address: "Banka: Wise US Inc, 108 W 13th St, Wilmington, DE, 19801, United States",
        },
        australia: {
          title: "🇦🇺 Za Australiju (AUD):",
          beneficiary: "Primatelj: Udruga Gradjana Baljci",
          account: "Račun: 241068232",
          bsb: "BSB: 774-001",
          swift: "BIC: TRWIAUS1XXX (Izvan Australije)",
          address: "Banka: Wise Australia Pty Ltd, Suite 1, Level 11, 66 Goulburn Street, Sydney, NSW, 2000, Australia",
        },
        canada: {
          title: "🇨🇦 Za Kanadu (CAD):",
          beneficiary: "Primatelj: Udruga Gradjana Baljci",
          account: "Račun: 200117505729",
          institution: "Institution: 621",
          transit: "Transit: 16001",
          swift: "BIC: TRWICAW1XXX (Izvan Kanade)",
          address: "Banka: Wise Payments Canada Inc., 99 Bank Street, Suite 1420, Ottawa, ON, K1P 1H4, Canada",
          note: "Napomena: Za Interac e-Transfer koristite email ispod.",
          email: "Email: finance@udrugabaljci.com",
          autoDeposit: "(Auto-deposit enabled)",
        },
      },
      or: "ILI",
      back: "Povratak na naslovnicu",
    },
  };

  const t = content[lang];

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
            {lang === "en" ? "Hrvatski" : "English"}
          </span>
        </button>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>

          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent pb-1">
              {t.headline}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* OR Divider for desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-zinc-900 rounded-full items-center justify-center border border-zinc-200 dark:border-zinc-800 z-10 shadow-lg">
            <span className="font-bold text-zinc-400 text-sm">{t.or}</span>
          </div>

          {/* Option 1: Fast (Small Donors) */}
          <div className="relative group flex flex-col h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 w-fit">
                {t.option1.badge}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t.option1.title}</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {t.option1.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span className="font-medium text-zinc-900 dark:text-white">{t.option1.speed}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.option1.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.option1.impact}</span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[20, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 text-center transform hover:-translate-y-0.5"
                    >
                      €{amount}
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5 pt-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                  </svg>
                  {t.option1.secure}
                </p>
              </div>
            </div>
          </div>

          {/* Option 2: Efficient (Large Donors) */}
          <div className="relative group flex flex-col h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative h-full bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 w-fit">
                {t.option2.badge}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Landmark className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t.option2.title}</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {t.option2.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <span className="font-bold block mb-1 text-red-900 dark:text-red-100 uppercase text-xs tracking-wider">{t.option2.problemLabel}</span>
                    {t.option2.problemText}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    <span className="font-bold block mb-1 text-emerald-900 dark:text-emerald-100 uppercase text-xs tracking-wider">{t.option2.solutionLabel}</span>
                    {t.option2.solutionText}
                  </p>
                </div>
              </div>

              <div className="mt-auto bg-zinc-100 dark:bg-black/40 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                  {t.option2.bankDetails}
                </h3>

                <div className="space-y-6">
                  {/* Wise Quick Pay QR Code */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                      <Image
                        src="/wise-quick-pay-qr-code.png"
                        alt="Wise Quick Pay QR Code"
                        width={192}
                        height={192}
                        className="object-contain"
                      />
                      <p className="text-center text-xs text-zinc-500 mt-2 font-medium">Scan to Pay with Wise</p>
                    </div>
                  </div>

                  {/* Europe */}
                  <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{t.option2.europe.title}</h4>
                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                      <p>{t.option2.europe.beneficiary}</p>
                      <p className="select-all font-bold text-zinc-900 dark:text-zinc-200">{t.option2.europe.iban}</p>
                      <p>{t.option2.europe.swift}</p>
                      <p className="text-zinc-500 italic mt-1">{t.option2.europe.address}</p>
                    </div>
                  </div>

                  {/* UK */}
                  <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{t.option2.uk.title}</h4>
                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                      <p>{t.option2.uk.beneficiary}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.uk.account}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.uk.sortCode}</p>
                      <p>{t.option2.uk.iban}</p>
                      <p>{t.option2.uk.swift}</p>
                      <p className="text-zinc-500 italic mt-1">{t.option2.uk.address}</p>
                    </div>
                  </div>

                  {/* USA */}
                  <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{t.option2.usa.title}</h4>
                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                      <p>{t.option2.usa.beneficiary}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.usa.account}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.usa.routing}</p>
                      <p>{t.option2.usa.swift}</p>
                      <p className="text-zinc-500 italic mt-1">{t.option2.usa.address}</p>
                    </div>
                  </div>

                  {/* Australia */}
                  <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{t.option2.australia.title}</h4>
                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                      <p>{t.option2.australia.beneficiary}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.australia.account}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.australia.bsb}</p>
                      <p>{t.option2.australia.swift}</p>
                      <p className="text-zinc-500 italic mt-1">{t.option2.australia.address}</p>
                    </div>
                  </div>

                  {/* Canada */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{t.option2.canada.title}</h4>
                    <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 font-mono bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800 break-all sm:break-normal">
                      <p>{t.option2.canada.beneficiary}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.canada.account}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.canada.institution}</p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-200">{t.option2.canada.transit}</p>
                      <p>{t.option2.canada.swift}</p>
                      <p className="text-zinc-500 italic mt-1">{t.option2.canada.address}</p>
                      <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="select-all block sm:inline font-bold text-emerald-600 dark:text-emerald-400">{t.option2.canada.email}</p>
                        <p className="inline text-zinc-500 ml-0 sm:ml-2">{t.option2.canada.autoDeposit}</p>
                        <p className="text-zinc-400 italic mt-1">{t.option2.canada.note}</p>
                      </div>
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
