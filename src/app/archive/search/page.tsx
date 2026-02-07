import PersonSearch from "@/components/PersonSearch";

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Family Archive Search
                </h1>
                <p className="text-slate-500 mb-8">
                    Search the extracted parish records for your ancestors.
                </p>
                <PersonSearch />
            </div>
        </div>
    );
}
