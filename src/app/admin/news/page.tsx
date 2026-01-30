"use client";

import { useState } from 'react';
import { Send, FileText } from 'lucide-react';

export default function PostNewsPage() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { db } = require('@/lib/store');
            db.addNews({
                title: formData.title,
                content: formData.content,
                author: 'Administrator', // Or user.name from auth context
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            });

            setMessage('Obavijest je uspješno objavljena na oglasnoj ploči.');
            setFormData({ title: '', content: '', tags: '' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                <h1 className="text-2xl font-bold text-zinc-800 mb-2">Nova Objava</h1>
                <p className="text-zinc-500 text-sm">Kreirajte novu obavijest za članove. Objava će biti vidljiva odmah.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">Naslov</label>
                    <input
                        type="text"
                        id="title"
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        placeholder="npr. Poziv na akciju čišćenja"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-zinc-700 mb-1">Oznake (odvojite zarezom)</label>
                    <input
                        type="text"
                        id="tags"
                        className="w-full px-4 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                        placeholder="npr. Akcija, Hitno, Obavijest"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-zinc-700 mb-1">Tekst Objave</label>
                    <textarea
                        id="content"
                        required
                        rows={8}
                        className="w-full px-4 py-2 border border-zinc-300 rounded focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
                        placeholder="Upišite tekst obavijesti ovdje..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">{message}</span>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-medium rounded hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Objavljivanje...' : (
                            <>
                                <Send size={18} /> Objavi Novost
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
