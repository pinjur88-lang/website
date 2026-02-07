import MapViewer from "@/components/MapViewer";

export default function MapPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Cadastral Maps
                </h1>
                <p className="text-slate-500 mb-8">
                    Historical maps of Baljci (K.O. 8 Baljke) from the 19th century.
                </p>
                <MapViewer />
            </div>
        </div>
    );
}
