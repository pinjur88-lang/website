"use client";

import { useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Heart, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SpomenarPage() {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);

        try {
            // 1. Upload to Supabase Storage
            // Path: spomenar_uploads/{timestamp}_{filename}
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            const { data, error } = await supabase
                .storage
                .from('spomenar_uploads')
                .upload(fileName, file);

            if (error) throw error;

            alert("Hvala! Slika je uspješno učitana. Obavijestit ćemo vas kada restauracija bude gotova.");
        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Greška pri učitavanju: " + (error.message || "Nepoznata greška"));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-4 md:p-8 font-sans">
            {/* Nav */}
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors">
                <ArrowLeft size={18} /> Natrag na Nadzornu ploču
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">

                    {/* Hero Section */}
                    <div className="bg-stone-900 text-stone-100 p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <ImageIcon className="w-full h-full text-white transform scale-150 translate-x-1/4 translate-y-1/4" />
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-amber-50">Projekt: Digitalni Spomenar</h1>
                            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                                Imate li staru kutiju cipela punu fotografija na tavanu? <br />
                                Pomozite nam izgraditi trajnu povijest Baljaka.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left: What we need */}
                        <div className="p-8 md:p-12 space-y-8 bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                    <Camera size={24} className="text-amber-600" />
                                    Što tražimo?
                                </h3>
                                <ul className="space-y-3 text-stone-600">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                        <span>Fotografije kuća prije rata</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                        <span>Svadbe, sprovodi i Slave</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                        <span>Razredne slike (Škola)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                        <span>Radovi u polju i svakodnevni život</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <Heart size={20} className="fill-amber-600 text-amber-600" />
                                    Posebna Nagrada
                                </h3>
                                <p className="text-amber-800 text-sm leading-relaxed mb-4">
                                    Za svaku sliku koju učitate, naš Admin će vam <strong>profesionalno restaurirati i kolorizirati</strong> jednu fotografiju po vašem izboru – potpuno BESPLATNO!
                                </p>
                                <p className="text-xs text-amber-600/80 italic">
                                    "Vi dobivate novu profilnu sliku, a povijest dobiva novi zapis. Poštena razmjena!"
                                </p>
                            </div>
                        </div>

                        {/* Right: Upload Section (Replaces Mailto) */}
                        <div className="p-8 md:p-12 bg-stone-50 border-l border-stone-100 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-stone-800 mb-6">Učitaj Sliku Ovdje</h3>

                            <div className="space-y-6">
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-stone-300 hover:border-amber-400'}`}
                                    onDragEnter={() => setDragActive(true)}
                                    onDragLeave={() => setDragActive(false)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActive(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            handleUpload(e.dataTransfer.files[0]);
                                        }
                                    }}
                                >
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm rounded-xl">
                                            <div className="flex flex-col items-center gap-2 text-amber-600 font-bold animate-pulse">
                                                <Upload size={32} />
                                                <span>Učitavanje...</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-500">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-stone-600 font-medium mb-2">Povucite sliku ovdje ili kliknite za odabir</p>
                                    <p className="text-xs text-stone-400 mb-6">Podržani formati: JPG, PNG (Max 5MB)</p>

                                    <button
                                        className="py-3 px-6 bg-stone-900 text-white font-bold rounded-lg shadow-lg hover:bg-stone-800 transition-all active:scale-95"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        disabled={uploading}
                                    >
                                        Odaberi Datoteku
                                    </button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-amber-100 text-amber-800 rounded-xl text-xs">
                                    <Heart size={16} className="fill-amber-600 text-amber-600 shrink-0" />
                                    <p>Hvala što čuvate uspomene na naše selo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
