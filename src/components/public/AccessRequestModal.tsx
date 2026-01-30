"use client";

import { useState } from 'react';
import { X, Send, AlertCircle, CheckSquare, Square } from 'lucide-react';
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
        phone: '',
        reason: '',
    });

    // Checkbox states
    const [contactMethods, setContactMethods] = useState({
        whatsapp: false,
        viber: false,
        sms: false,
        email: true // default
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const toggleMethod = (method: keyof typeof contactMethods) => {
        setContactMethods(prev => ({
            ...prev,
            [method]: !prev[method]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Create comma separated string of selected methods
        const selectedMethods = Object.entries(contactMethods)
            .filter(([_, isSelected]) => isSelected)
            .map(([method]) => method)
            .join(', ');

        try {
            await db.addRequest({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                contact_method: selectedMethods,
                reason: formData.reason,
            });
            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Failed to submit request', error);
            setErrorMsg(error.message || 'Greška u povezivanju s bazom podataka.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-sm shadow-xl w-full max-w-md relative overflow-hidden my-8">
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

                                <div className="grid grid-cols-2 gap-4">
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
                                        <label htmlFor="phone" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.phoneLabel}</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900"
                                            placeholder="+385..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">{t.contactMethodLabel}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={() => toggleMethod('whatsapp')} className={`flex items-center gap-2 text-sm p-2 border rounded-sm transition-colors ${contactMethods.whatsapp ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>
                                            {contactMethods.whatsapp ? <CheckSquare size={16} /> : <Square size={16} />} {t.methodWhatsapp}
                                        </button>
                                        <button type="button" onClick={() => toggleMethod('viber')} className={`flex items-center gap-2 text-sm p-2 border rounded-sm transition-colors ${contactMethods.viber ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>
                                            {contactMethods.viber ? <CheckSquare size={16} /> : <Square size={16} />} {t.methodViber}
                                        </button>
                                        <button type="button" onClick={() => toggleMethod('sms')} className={`flex items-center gap-2 text-sm p-2 border rounded-sm transition-colors ${contactMethods.sms ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>
                                            {contactMethods.sms ? <CheckSquare size={16} /> : <Square size={16} />} {t.methodSms}
                                        </button>
                                        <button type="button" onClick={() => toggleMethod('email')} className={`flex items-center gap-2 text-sm p-2 border rounded-sm transition-colors ${contactMethods.email ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`}>
                                            {contactMethods.email ? <CheckSquare size={16} /> : <Square size={16} />} {t.methodEmail}
                                        </button>
                                    </div>
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

                                {errorMsg && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-sm flex items-start gap-2">
                                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                                        <p className="text-xs text-red-600">{errorMsg}</p>
                                    </div>
                                )}

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
                            <p className="text-sm text-zinc-600 mb-8 px-4">
                                {t.successMessage}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-zinc-900 text-white py-3 text-sm font-medium hover:bg-zinc-800 transition-colors uppercase tracking-widest mb-3"
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
