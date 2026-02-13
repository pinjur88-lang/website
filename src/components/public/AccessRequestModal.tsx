"use client";

import { useState, useEffect } from 'react';
import { X, Send, AlertCircle, CheckSquare, Square } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { submitAccessRequest } from '@/actions/public';

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
        oib: '',
        dob: '',
        address: '',
        reason: '',
    });

    // Checkbox states
    const [contactMethods, setContactMethods] = useState({
        whatsapp: false,
        viber: false,
        sms: false,
        email: true // default
    });

    const [acceptedStatute, setAcceptedStatute] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Validation state
    const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleMethod = (method: keyof typeof contactMethods) => {
        setContactMethods(prev => ({
            ...prev,
            [method]: !prev[method]
        }));
    };

    const clearError = (field: string) => {
        if (fieldErrors.has(field)) {
            const next = new Set(fieldErrors);
            next.delete(field);
            setFieldErrors(next);
        }
    };

    const validateForm = () => {
        const errors = new Set<string>();

        if (!formData.name.trim()) errors.add('name');
        if (!formData.dob.trim()) errors.add('dob');
        if (!formData.address.trim()) errors.add('address');
        if (!formData.email.trim()) errors.add('email');
        if (!formData.phone.trim()) errors.add('phone');
        if (!formData.reason.trim()) errors.add('reason');
        if (!acceptedStatute) errors.add('statute');

        setFieldErrors(errors);
        return errors.size === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!validateForm()) {
            setErrorMsg(t.formError || "Molimo ispunite sva označena polja."); // Fallback if t.formError missing
            return;
        }

        setLoading(true);

        // Create comma separated string of selected methods
        const selectedMethods = Object.entries(contactMethods)
            .filter(([_, isSelected]) => isSelected)
            .map(([method]) => method)
            .join(', ');

        try {
            // Use Server Action instead of client DB
            const result = await submitAccessRequest({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                contact_method: selectedMethods,
                oib: formData.oib,
                dob: formData.dob,
                address: formData.address,
                accepted_statute: acceptedStatute,
                reason: formData.reason,
            });

            if (result.error) {
                setErrorMsg(result.error);
            } else {
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error('Failed to submit request', error);
            setErrorMsg('Greška u komunikaciji sa serverom.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="bg-white rounded-sm shadow-xl w-full max-w-lg relative overflow-hidden my-8 text-left mx-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 transition-colors z-10"
                        aria-label="Close"
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

                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-sm text-blue-800 leading-snug">
                                        {t.charterMember}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.nameLabel} *</label>
                                        <input
                                            id="name"
                                            required
                                            className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 ${fieldErrors.has('name') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                clearError('name');
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="dob" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.dobLabel} *</label>
                                            <input
                                                id="dob"
                                                required
                                                type="date"
                                                className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 ${fieldErrors.has('dob') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                                value={formData.dob}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, dob: e.target.value });
                                                    clearError('dob');
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="oib" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.oibLabel}</label>
                                            <input
                                                id="oib"
                                                className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900"
                                                value={formData.oib}
                                                onChange={(e) => setFormData({ ...formData, oib: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.addressLabel} *</label>
                                        <input
                                            id="address"
                                            required
                                            className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 ${fieldErrors.has('address') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                            placeholder="npr. Šibenik, Hrvatska"
                                            value={formData.address}
                                            onChange={(e) => {
                                                setFormData({ ...formData, address: e.target.value });
                                                clearError('address');
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.emailLabel} *</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 ${fieldErrors.has('email') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    clearError('email');
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.phoneLabel} *</label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 ${fieldErrors.has('phone') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                                placeholder="+385..."
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, phone: e.target.value });
                                                    clearError('phone');
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="reason" className="block text-xs font-bold text-zinc-500 mb-1 uppercase">{t.reasonLabel || "Razlog Zahtjeva"} *</label>
                                        <textarea
                                            id="reason"
                                            required
                                            rows={2}
                                            className={`w-full bg-zinc-50 border p-2 text-sm focus:outline-none focus:border-zinc-500 rounded-sm text-zinc-900 resize-none ${fieldErrors.has('reason') ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                                            placeholder="Obiteljska veza, itd..."
                                            value={formData.reason}
                                            onChange={(e) => {
                                                setFormData({ ...formData, reason: e.target.value });
                                                clearError('reason');
                                            }}
                                        />
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

                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAcceptedStatute(!acceptedStatute);
                                                if (!acceptedStatute) clearError('statute');
                                            }}
                                            className="flex items-start gap-3 w-full text-left group"
                                        >
                                            <div className={`mt-0.5 transition-colors ${acceptedStatute ? 'text-zinc-900' : (fieldErrors.has('statute') ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-600')}`}>
                                                {acceptedStatute ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </div>
                                            <span className={`text-sm font-medium leading-tight ${fieldErrors.has('statute') ? 'text-red-500' : 'text-zinc-900'}`}>
                                                {t.statuteLabel} <span className="text-red-500">*</span>
                                            </span>
                                        </button>
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
        </div>
    );
}
