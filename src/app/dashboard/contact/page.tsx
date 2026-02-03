'use client';

import { useState } from 'react';
import { Mail, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactPage() {
    const { t } = useLanguage();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('General');

    const adminEmail = 'udrugabaljci@gmail.com';

    const handleSendEmail = () => {
        const mailtoBody = `Category: ${category}\n\n${message}`;
        const mailtoUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(subject || 'Inquiry from Member')}&body=${encodeURIComponent(mailtoBody)}`;
        window.location.href = mailtoUrl;
    };

    const categories = {
        hr: ['Općenito', 'Infrastruktura', 'Memorijalni Arhiv', 'Članstvo', 'Prijedlog'],
        sr: ['Opšte', 'Infrastruktura', 'Memorijalni Arhiv', 'Članstvo', 'Predlog'],
        en: ['General', 'Infrastructure', 'Memorial Archive', 'Membership', 'Suggestion'],
        de: ['Allgemein', 'Infrastruktur', 'Gedenkarchiv', 'Mitgliedschaft', 'Vorschlag']
    };

    // Fallback for categories based on current language
    const currentCategories = (categories as any)[t.navHome === 'Početna' ? 'hr' : t.navHome === 'Home' ? 'en' : 'hr'] || categories.en;

    const labels = {
        hr: {
            title: "Kontakt Administratora",
            subtitle: "Imate li pitanja ili briga u vezi sela? Pošaljite nam poruku izravno.",
            categoryLabel: "Kategorija",
            subjectLabel: "Predmet",
            messageLabel: "Vaša Poruka",
            buttonText: "Pripremi E-mail",
            infoText: "Klikom na gumb otvorit će se vaša zadanu e-mail aplikacija s ispunjenim podacima.",
            directEmail: "Također nas možete kontaktirati izravno na:"
        },
        en: {
            title: "Contact Administrator",
            subtitle: "Do you have concerns or questions about the village? Send us a message directly.",
            categoryLabel: "Category",
            subjectLabel: "Subject",
            messageLabel: "Your Message",
            buttonText: "Prepare Email",
            infoText: "Clicking the button will open your default email app with the details filled in.",
            directEmail: "You can also contact us directly at:"
        },
        sr: {
            title: "Kontakt Administratora",
            subtitle: "Imate li pitanja ili briga u vezi sela? Pošaljite nam poruku direktno.",
            categoryLabel: "Kategorija",
            subjectLabel: "Predmet",
            messageLabel: "Vaša Poruka",
            buttonText: "Pripremi E-mail",
            infoText: "Klikom na dugme otvoriće se vaša podrazumevana e-mail aplikacija sa ispunjenim podacima.",
            directEmail: "Takođe nas možete kontaktirati direktno na:"
        },
        de: {
            title: "Administrator Kontaktieren",
            subtitle: "Haben Sie Bedenken oder Fragen zum Dorf? Senden Sie uns direkt eine Nachricht.",
            categoryLabel: "Kategorie",
            subjectLabel: "Betreff",
            messageLabel: "Ihre Nachricht",
            buttonText: "E-Mail vorbereiten",
            infoText: "Durch Klicken auf die Schaltfläche wird Ihre Standard-E-Mail-App mit den ausgefüllten Details geöffnet.",
            directEmail: "Sie können uns auch direkt kontaktieren unter:"
        }
    };

    const l = (labels as any)[t.navHome === 'Početna' ? 'hr' : t.navHome === 'Home' ? 'en' : 'hr'] || labels.en;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Mail className="text-sky-600" size={32} />
                    {l.title}
                </h1>
                <p className="text-slate-500 text-lg">
                    {l.subtitle}
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Form Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">{l.categoryLabel}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-sky-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                {categories.en.map((cat, i) => (
                                    <option key={cat} value={cat}>
                                        {((currentCategories as string[])[i]) || cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">{l.subjectLabel}</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="..."
                                className="w-full p-3 bg-slate-50 border border-sky-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">{l.messageLabel}</label>
                        <textarea
                            rows={8}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-sky-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="..."
                        ></textarea>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl flex items-start gap-3 border border-blue-100/50">
                        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                        <p className="text-xs text-blue-800 leading-relaxed">
                            {l.infoText}
                        </p>
                    </div>

                    <button
                        onClick={handleSendEmail}
                        disabled={!message}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-lg"
                    >
                        <Send size={20} />
                        {l.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
