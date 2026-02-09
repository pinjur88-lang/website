"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function HistoricalMapPage() {
    return (
        <div className="h-screen flex flex-col bg-zinc-900 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="hidden sm:inline">Natrag</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-100">Povijesni Katastarski Plan</h1>
                        <p className="text-xs text-zinc-500">Baljci (Izvor: Arcanum Maps)</p>
                    </div>
                </div>
            </div>

            {/* Map Viewer */}
            <div className="flex-1 relative bg-zinc-950">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={8}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Controls */}
                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 bg-zinc-900/90 backdrop-blur border border-zinc-700 p-2 rounded-xl shadow-2xl">
                                <button onClick={() => zoomIn()} className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg">
                                    <ZoomIn size={24} />
                                </button>
                                <button onClick={() => zoomOut()} className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg">
                                    <ZoomOut size={24} />
                                </button>
                                <button onClick={() => resetTransform()} className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg" title="Reset">
                                    <RotateCcw size={24} />
                                </button>
                            </div>

                            {/* Viewport */}
                            <div className="w-full h-full cursor-move">
                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
                                        {/* Placeholder Logic: You must place 'baljci_cadastral.png' in public/images/maps/ */}
                                        <img
                                            src="/images/maps/baljci_cadastral.png"
                                            alt="Baljci Katastar"
                                            className="max-w-none shadow-2xl"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                // Fallback UI if image missing
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('bg-zinc-900');
                                                e.currentTarget.parentElement!.innerHTML = `
                          <div class="text-center p-8 border-2 border-dashed border-zinc-700 rounded-2xl">
                             <p class="text-zinc-400 font-bold mb-2">Nedostaje Karta</p>
                             <p class="text-zinc-600 text-sm">Molimo postavite datoteku:</p>
                             <code class="block mt-2 bg-black p-2 rounded text-amber-500 text-xs">public/images/maps/baljci_cadastral.png</code>
                          </div>
                        `;
                                            }}
                                        />
                                    </div>
                                </TransformComponent>
                            </div>
                        </>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
}
