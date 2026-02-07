'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const FamilyTree = dynamic(() => import('@/components/FamilyTree'), { ssr: false });

export default function GenealogyPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Baljci Family Tree Archive</h1>
                <p className="mb-4 text-gray-600">
                    Search for an ancestor to explore connections. Click on nodes to expand their immediate family.
                </p>
                <div className="h-[800px] border shadow-lg rounded-lg overflow-hidden relative">
                    <FamilyTree />
                </div>
            </div>
        </main>
    );
}
