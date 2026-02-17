'use client';

import { useState } from 'react';
import { Mail, Send, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { sendMessage } from '@/actions/contact';
import { useAuth } from '@/lib/auth-context';

export default function ContactPage() {
    const { t } = useLanguage();
    const { user } = useAuth();

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('General');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSend = async () => {
        setStatus('loading');

        const formData = new FormData();
        formData.append('email', user?.email || 'anon@baljci.org');
        formData.append('subject', subject);
        formData.append('category', category);
        formData.append('message', message);

        const res = await sendMessage(formData);

        if (res.error) {
            alert(res.error);
            setStatus('error');
        } else {
            if (!res.emailSent) {
                console.warn("Email was not sent:", res.emailError);
                // We keep it as success but maybe notify? 
                // For now, let's just log and treat as success since it's in DB.
            }
            setStatus('success');
            setMessage('');
            setSubject('');
        }
    };

    const categories = {
        hr: ['Općenito', 'Infrastruktura', 'Memorijalni Arhiv', 'Članstvo', 'Prijedlog'],
        sr: ['Opšte', 'Infrastruktura', 'Memorijalni Arhiv', 'Članstvo', 'Predlog'],
        en: ['General', 'Infrastructure', 'Memorial Archive', 'Membership', 'Suggestion'],
        de: ['Allgemein', 'Infrastruktur', 'Gedenkarchiv', 'Mitgliedschaft', 'Vorschlag']
    };

    // ... (labels remain same) ...

    // Fallback for categories based on current language
    const currentCategories = (categories as any)[t.navHome === 'Početna' ? 'hr' : t.navHome === 'Home' ? 'en' : 'hr'] || categories.en;

    const labels = {
        hr: {
            title: "Kontakt Administratora",
            subtitle: "Imate li pitanja o web stranici ili prijedloge? Javite nam se, trudimo se poboljšati kako bismo vam bolje služili.",
            categoryLabel: "Kategorija",
            subjectLabel: "Predmet",
            messageLabel: "Vaša Poruka",
            buttonText: "Pošalji Poruku",
            infoText: "Vaša poruka će biti spremljena u sustav i administrator će je pregledati.",
            success: "Poruka uspješno poslana!"
        },
        en: {
            title: "Contact Administrator",
            subtitle: "Do you have questions about the website or suggestions? Please let us know, we strive to improve to better serve you.",
            categoryLabel: "Category",
            subjectLabel: "Subject",
            messageLabel: "Your Message",
            buttonText: "Send Message",
            infoText: "Your message will be saved to the system and reviewed by an administrator.",
            success: "Message sent successfully!"
        },
        sr: {
            title: "Kontakt Administratora",
            subtitle: "Imate li pitanja o veb stranici ili predloge? Javite nam se, trudimo se da budemo bolji da bismo vam bolje služili.",
            categoryLabel: "Kategorija",
            subjectLabel: "Predmet",
            messageLabel: "Vaša Poruka",
            buttonText: "Pošalji Poruku",
            infoText: "Vaša poruka će biti sačuvana u sistemu i administrator će je pregledati.",
            success: "Poruka uspešno poslata!"
        },
        de: {
            title: "Administrator Kontaktieren",
            subtitle: "Haben Sie Fragen zur Website oder Vorschläge? Bitte lassen Sie es uns wissen, wir bemühen uns, besser zu werden, um Ihnen besser zu dienen.",
            categoryLabel: "Kategorie",
            subjectLabel: "Betreff",
            messageLabel: "Ihre Nachricht",
            buttonText: "Nachricht Senden",
            infoText: "Ihre Nachricht wird im System gespeichert und von einem Administrator überprüft.",
            success: "Nachricht erfolgreich gesendet!"
        }
    };

    const l = (labels as any)[t.navHome === 'Početna' ? 'hr' : t.navHome === 'Home' ? 'en' : 'hr'] || labels.en;

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{l.success}</h2>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-blue-600 hover:underline font-medium mt-4"
                >
                    Nova poruka / New Message
                </button>
            </div>
        );
    }

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
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/5 space-y-6">

                    {/* Form Fields */}
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
                        onClick={handleSend}
                        disabled={!message || status === 'loading'}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-lg"
                    >
                        {status === 'loading' ? '...' : <><Send size={20} /> {l.buttonText}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
