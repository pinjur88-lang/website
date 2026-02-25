'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={32} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900">Došlo je do greške!</h2>
                <p className="text-slate-600">
                    Ispričavamo se, nešto je pošlo po zlu. Molimo pokušajte ponovno.
                </p>

                <div className="bg-slate-50 p-4 rounded-lg text-left text-xs font-mono text-slate-500 overflow-auto max-h-32 mb-4 border border-slate-200">
                    {error.message || "Nepoznata greška"}
                </div>

                <button
                    onClick={() => reset()}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <RefreshCcw size={18} />
                    Pokušaj ponovno
                </button>
            </div>
        </div>
    );
}
