export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-sky-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 text-sm font-medium animate-pulse">Učitavanje...</p>
            </div>
        </div>
    );
}
