"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { db } from '@/lib/db';

interface AccessRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccessRequestModal({ isOpen, onClose }: AccessRequestModalProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reason: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await db.addRequest({
                name: formData.name,
                email: formData.email,
                reason: formData.reason,
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to submit request', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = () => {
        const subject = `Zahtjev za pristup: ${formData.name}`;
        const body = `Ime: ${formData.name}\nEmail: ${formData.email}\nRazlog: ${formData.reason}`;
        window.location.href = `mailto:udrugabaljci@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-sm shadow-xl w-full max-w-md relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {!isSubmitted ? (
                        <>
                            <div className="flex flex-col items-center mb-6 text-center">
                                <div className="w-12 h-12 relative mb-3">
                                    <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full" />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900">{t.modalTitle}</h2>
                                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Udruga Građana Baljci</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.nameLabel}</label>
                                    <input
                                        id="name"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.emailLabel}</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reason" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.reasonLabel}</label>
                                    <textarea
                                        id="reason"
                                        required
                                        rows={3}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm resize-none text-zinc-900"
                                        placeholder={t.reasonPlaceholder}
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>

                                <p className="text-[10px] text-zinc-400 text-center leading-tight pt-2">
                                    {t.disclaimer}
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-zinc-900 text-white py-3 text-sm font-medium hover:bg-zinc-800 transition-colors uppercase tracking-widest mt-2 disabled:opacity-50"
                                >
                                    {loading ? t.sending : t.submitButton}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-800 mb-2">{t.successTitle}</h3>
                            <p className="text-sm text-zinc-600 mb-6 px-4">
                                {t.successMessage}
                            </p>
                            <button
                                onClick={handleSendEmail}
                                className="w-full bg-zinc-900 text-white py-3 text-sm font-medium hover:bg-zinc-800 transition-colors uppercase tracking-widest mb-3"
                            >
                                Otvori E-mail
                            </button>
                            <button
                                onClick={onClose}
                                className="text-xs text-zinc-400 hover:text-zinc-600 underline"
                            >
                                {t.close}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
