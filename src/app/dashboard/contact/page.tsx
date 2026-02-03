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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-sky-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">{l.categoryLabel}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
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
                                className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">{l.messageLabel}</label>
                        <textarea
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-sky-100 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
                            placeholder="..."
                        ></textarea>
                    </div>

                    <div className="bg-sky-50 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-sky-600 flex-shrink-0" size={20} />
                        <p className="text-xs text-sky-800 leading-relaxed">
                            {l.infoText}
                        </p>
                    </div>

                    <button
                        onClick={handleSendEmail}
                        disabled={!message}
                        className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:hover:bg-sky-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Send size={18} />
                        {l.buttonText}
                    </button>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-lg">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <MessageCircle size={20} className="text-sky-400" />
                            Admin Support
                        </h3>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                            {l.directEmail}
                        </p>
                        <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3 border border-white/10 group hover:bg-white/20 transition-colors cursor-pointer"
                            onClick={() => window.location.href = `mailto:${adminEmail}`}>
                            <Mail size={18} className="text-sky-400" />
                            <span className="text-sm font-medium">{adminEmail}</span>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h4 className="text-amber-900 font-bold text-sm mb-2">Udruga Građana Baljci</h4>
                        <p className="text-amber-800/70 text-xs leading-relaxed">
                            Sjedište: Baljci, Općina Ružić<br />
                            Hrvatska
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
