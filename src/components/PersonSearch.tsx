"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";

interface CheckboxState {
    strictBaljci: boolean;
}

interface Person {
    id: string;
    name: string;
    surname: string;
    birth_year: string;
    father_name: string;
    mother_name: string;
    origin: string;
    godparents: string;
}

export default function PersonSearch() {
    const [data, setData] = useState<Person[]>([]);
    const [filtered, setFiltered] = useState<Person[]>([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<CheckboxState>({
        strictBaljci: true,
    });

    useEffect(() => {
        fetch("/archive/data/village_tree.csv")
            .then((res) => res.text())
            .then((csv) => {
                const parsed = Papa.parse<Person>(csv, {
                    header: true,
                    skipEmptyLines: true,
                });
                setData(parsed.data);
                setFiltered(parsed.data);
            });
    }, []);

    useEffect(() => {
        let result = data;

        // 1. Text Search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.surname && p.surname.toLowerCase().includes(q)) ||
                    (p.godparents && p.godparents.toLowerCase().includes(q))
            );
        }

        // 2. Strict Filter (Default ON)
        if (filters.strictBaljci) {
            result = result.filter((p) =>
                p.origin?.includes("Possible Baljci Origin")
            );
        }

        setFiltered(result);
    }, [search, filters, data]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Search Archives
                    </label>
                    <input
                        type="text"
                        placeholder="Search by name, surname, or godparent..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 pb-2">
                    <input
                        type="checkbox"
                        id="baljciOnly"
                        className="w-4 h-4 text-blue-600 rounded"
                        checked={filters.strictBaljci}
                        onChange={(e) =>
                            setFilters({ ...filters, strictBaljci: e.target.checked })
                        }
                    />
                    <label htmlFor="baljciOnly" className="text-sm font-medium text-slate-700">
                        Baljci Origins Only
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Surname</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Father</th>
                            <th className="px-4 py-3">Mother</th>
                            <th className="px-4 py-3">Origin Tag</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.slice(0, 100).map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-slate-500">
                                    {row.birth_year}
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-900">
                                    {row.surname}
                                </td>
                                <td className="px-4 py-3 text-slate-900">{row.name}</td>
                                <td className="px-4 py-3 text-slate-600">{row.father_name}</td>
                                <td className="px-4 py-3 text-slate-600">{row.mother_name}</td>
                                <td className="px-4 py-3">
                                    {row.origin && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {row.origin}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    No records found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="mt-4 text-xs text-slate-400 text-center">
                    Showing top 100 of {filtered.length} matches
                </div>
            </div>
        </div>
    );
}
