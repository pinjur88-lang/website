"use client";

import { useState } from 'react';
import { Lock, MapPin, Church, Leaf } from 'lucide-react'; // Using Church as alternative for Cemetery candle logic if needed, or specific icons
import { useLanguage } from '@/lib/language-context';
import RestrictionsModal from './RestrictionsModal';

export default function MembersGrid() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLanguage();

    const features = [
        {
            id: 1,
            title: t.feat1Title,
            description: t.feat1Desc,
            icon: <MapPin className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: t.feat2Title,
            description: t.feat2Desc,
            icon: <Church className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1533158388470-9a56699990c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: t.feat3Title,
            description: t.feat3Desc,
            icon: <Leaf className="w-6 h-6" />,
            image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <section className="py-12 md:py-24 bg-[#f8f9fa] px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-[#2f3e46] mb-4 relative inline-block">
                        {t.exploreHeritage}
                        <span className="block text-sm font-sans font-medium text-[#2f3e46]/60 uppercase tracking-[0.2em] mt-3">
                            {t.membersOnly}
                        </span>
                    </h2>
                    <div className="w-16 h-1 bg-[#556B2F] mx-auto mt-6"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            onClick={() => setIsModalOpen(true)}
                            className="group bg-white rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-[450px] flex flex-col"
                        >
                            {/* Image Area */}
                            <div className="h-3/5 relative overflow-hidden">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover filter blur-[2px] grayscale-[20%] group-hover:blur-[1px] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                {/* Velvet Rope Overlay */}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white shadow-lg">
                                        <Lock size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 flex-grow flex flex-col justify-center bg-white relative z-10">
                                <div className="text-[#556B2F] mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-serif text-2xl text-[#2f3e46] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <RestrictionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
