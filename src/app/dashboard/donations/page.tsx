'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { uploadDonationReport, getDonationReports, deleteDonationReport } from '@/actions/donations';
import { FileText, Download, Trash2, Plus, Loader2, FileSpreadsheet } from 'lucide-react';

type Report = {
    id: string;
    title: string;
    description: string;
    file_url: string;
    created_at: string;
};

export default function DonationsPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDesc, setUploadDesc] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const loadReports = async () => {
        setLoading(true);
        const { data, error } = await getDonationReports();
        if (data) setReports(data);
        setLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !uploadTitle || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('title', uploadTitle);
        formData.append('description', uploadDesc);
        formData.append('file', selectedFile);
        formData.append('userId', user.id);

        const result = await uploadDonationReport(formData);

        if (result.error) {
            alert('Upload failed: ' + result.error);
        } else {
            // Reset form
            setUploadTitle('');
            setUploadDesc('');
            setSelectedFile(null);
            loadReports();
        }
        setIsUploading(false);
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;

        const result = await deleteDonationReport(id, fileUrl);
        if (result.error) alert('Delete failed: ' + result.error);
        else loadReports();
    };

    const isAdmin = user?.role === 'admin' || user?.email === 'udrugabaljci@gmail.com';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Izvješća o Donacijama</h1>
                <p className="text-slate-600 text-sm mt-1">
                    Transparentni pregled svih donacija i financijskih izvješća udruge.
                </p>
            </div>

            {/* Admin Upload Section */}
            {isAdmin && (
                <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Plus size={18} />
                        Učitaj Novo Izvješće
                    </h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Naslov (npr. Siječanj 2026)"
                                value={uploadTitle}
                                onChange={e => setUploadTitle(e.target.value)}
                                className="p-2 border border-stone-300 rounded-md text-sm w-full"
                                required
                            />
                            <input
                                type="file"
                                accept=".pdf,.xlsx,.xls,.csv"
                                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                                className="p-2 border border-stone-300 rounded-md text-sm w-full text-stone-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                                required
                            />
                        </div>
                        <textarea
                            placeholder="Kratki opis ili sažetak (opcionalno)"
                            value={uploadDesc}
                            onChange={e => setUploadDesc(e.target.value)}
                            className="w-full p-2 border border-stone-300 rounded-md text-sm h-20 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                            {isUploading ? 'Učitavanje...' : 'Objavi Izvješće'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reports List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-stone-400">Učitavanje...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 border border-dashed border-stone-200 rounded-lg">
                        <FileText className="mx-auto text-stone-300 mb-2" size={32} />
                        <p className="text-stone-500 text-sm">Trenutno nema objavljenih izvješća.</p>
                    </div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-white p-5 rounded-lg border border-sky-100 shadow-sm flex items-start gap-4 hover:border-sky-300 transition-colors">
                            <div className="p-3 bg-sky-50 rounded-lg text-sky-600">
                                {report.file_url.endsWith('.pdf') ? <FileText size={24} /> : <FileSpreadsheet size={24} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">{report.title}</h4>
                                <p className="text-xs text-slate-400 mb-2">
                                    Objavljeno: {new Date(report.created_at).toLocaleDateString('hr-HR')}
                                </p>
                                {report.description && (
                                    <p className="text-sm text-stone-600 mb-3 line-clamp-2">{report.description}</p>
                                )}
                                <div className="flex items-center gap-3">
                                    <a
                                        href={report.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-sky-700 flex items-center gap-1 hover:underline"
                                    >
                                        <Download size={14} />
                                        Preuzmi Dokument
                                    </a>
                                </div>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(report.id, report.file_url)}
                                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Izbriši"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
