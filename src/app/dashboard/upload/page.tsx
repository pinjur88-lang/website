"use client";

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Upload as UploadIcon, Check } from 'lucide-react';

export default function UploadPage() {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
            setFile(null);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-stone-800">{t.upload}</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">

                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded flex items-center gap-2">
                        <Check size={18} /> Slika uspješno učitana!
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <UploadIcon size={48} className="text-stone-400 mb-2" />
                        <p className="text-stone-600 font-medium">{file ? file.name : "Kliknite ili povucite sliku ovdje"}</p>
                        <p className="text-xs text-stone-400 mt-1">JPG, PNG do 5MB</p>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? 'Učitavanje...' : 'Učitaj'}
                    </button>
                </form>
            </div>
        </div>
    );
}
