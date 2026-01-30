"use client";

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Send } from 'lucide-react';

export default function SuggestionsPage() {
    const { t } = useLanguage();
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send to backend
        setSubmitted(true);
        setText('');
        setTimeout(() => setSubmitted(false), 3000);
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
                        className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
                    >
                        {t.submitSuggestion}
                    </button>
                </form>
            </div>
        </div>
    );
}
