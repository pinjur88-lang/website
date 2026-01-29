"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface AccessRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccessRequestModal({ isOpen, onClose }: AccessRequestModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reason: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-zinc-200">
                <div className="flex justify-between items-center p-4 border-b border-zinc-100 bg-zinc-50">
                    <h3 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Zahtjev za Pristup</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Send size={24} />
                            </div>
                            <h4 className="text-lg font-medium text-zinc-900 mb-2">Zahtjev Zaprimljen</h4>
                            <p className="text-sm text-zinc-600">
                                Vaš zahtjev za članstvom je poslan na pregled administratoru.<br />
                                Obavijest o statusu dobit ćete putem e-pošte.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded text-sm transition-colors"
                            >
                                Zatvori
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">Ime i Prezime</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-3 py-2 border border-zinc-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-900 bg-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">E-mail Adresa</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-3 py-2 border border-zinc-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-900 bg-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="reason" className="block text-xs font-medium text-zinc-500 mb-1 uppercase">Razlog Pristupa</label>
                                <textarea
                                    id="reason"
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-zinc-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 text-zinc-900 bg-white resize-none"
                                    placeholder="Navedite vezu s Udrugom..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Slanje...' : 'Pošalji Zahtjev'}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 text-center">
                                Slanjem zahtjeva pristajete na provjeru podataka.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
