"use client";

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Send } from 'lucide-react';

export default function SuggestionsPage() {
    const { t } = useLanguage();
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const { submitReport } = await import('@/actions/submissions');
            const res = await submitReport('suggestion', text);

            if (res.error) {
                setSubmitError(res.error);
                setIsSubmitting(false);
                return;
            }

            setSubmitted(true);
            setText('');
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err: any) {
            setSubmitError(err.message || 'Unknown error');
        }

        setIsSubmitting(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-stone-800">{t.suggestions}</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                <p className="text-stone-600 mb-4">{t.suggestionDesc}</p>

                {submitted ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-md mb-4 flex items-center gap-2">
                        <Send size={16} /> Prijedlog uspješno poslan!
                    </div>
                ) : null}

                {submitError ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
                        Greška pri slanju: {submitError}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full h-32 p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400 mb-4 text-stone-800"
                        placeholder={t.suggestionPlaceholder}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !text.trim()}
                        className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? 'Slanje...' : t.submitSuggestion}
                    </button>
                </form>
            </div>
        </div>
    );
}
