'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const FamilyTree = dynamic(() => import('@/components/FamilyTree'), { ssr: false });

export default function GenealogyPage() {
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Baljci Family Tree Archive</h1>
            <p className="mb-4 text-slate-600">
                Search for an ancestor to explore connections. Click on nodes to expand their immediate family.
            </p>
            <div className="flex-1 border border-slate-200 shadow-sm rounded-lg overflow-hidden relative bg-white">
                <FamilyTree />
            </div>
        </div>
    );
}
