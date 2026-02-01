"use client";

import { useState } from 'react';
import { Lock, MapPin, Church, Leaf } from 'lucide-react'; // Using Church as alternative for Cemetery candle logic if needed, or specific icons
import RestrictionsModal from './RestrictionsModal';

interface FeatureCard {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
}

const features: FeatureCard[] = [
    {
        id: 1,
        title: "Interactive Village Map",
        description: "Find your family's original stone house. Click any roof to see historical records and photos from 1920-1990.",
        icon: <MapPin className="w-6 h-6" />,
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Memorial Archive",
        description: "Pay respects from anywhere. Search our database of ancestors and light a virtual candle on their grave.",
        icon: <Church className="w-6 h-6" />,
        image: "https://images.unsplash.com/photo-1533158388470-9a56699990c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Stewardship Program",
        description: "Become a guardian of a village olive tree. Receive a GPS tag, yearly harvest photos, and your name on the tree.",
        icon: <Leaf className="w-6 h-6" />,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

export default function MembersGrid() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-24 bg-[#f8f9fa] px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl text-[#2f3e46] mb-4 relative inline-block">
                        Explore Our Digital Heritage
                        <span className="block text-sm font-sans font-medium text-[#2f3e46]/60 uppercase tracking-[0.2em] mt-3">
                            (Members Only)
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
