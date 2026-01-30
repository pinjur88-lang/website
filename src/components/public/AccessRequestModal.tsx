"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // We cannot send emails directly from client without a service.
        // We will construct a mailto link or just show success message instructions.
    };

    const handleSendEmail = () => {
        const subject = `Zahtjev za pristup: ${formData.name}`;
        const body = `Ime: ${formData.name}\nEmail: ${formData.email}\nRazlog: ${formData.reason}`;
        window.location.href = `mailto:udrugabaljci@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 scale-100">
                <div className="flex justify-between items-center p-4 border-b border-zinc-100 bg-zinc-50">
                    <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">{t.modalTitle}</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-6">
                            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Send size={24} />
                            </div>
                            <h4 className="text-lg font-medium text-zinc-900 mb-2">{t.successTitle}</h4>
                            <p className="text-sm text-zinc-600 mb-6">
                                {t.successMessage}
                            </p>

                            <button
                                onClick={handleSendEmail}
                                className="w-full py-3 bg-zinc-900 text-white rounded text-sm uppercase tracking-wide hover:bg-zinc-800 mb-3"
                            >
                                Otvori Email
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full py-2 text-zinc-500 hover:text-zinc-800 text-sm transition-colors"
                            >
                                {t.close}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.nameLabel}</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:border-zinc-500 text-zinc-900 bg-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.emailLabel}</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:border-zinc-500 text-zinc-900 bg-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="reason" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">{t.reasonLabel}</label>
                                <textarea
                                    id="reason"
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:border-zinc-500 text-zinc-900 bg-white resize-none"
                                    placeholder={t.reasonPlaceholder}
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm text-sm uppercase tracking-widest font-medium transition-colors"
                                >
                                    {t.submitButton}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 text-center italic">
                                {t.disclaimer}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
