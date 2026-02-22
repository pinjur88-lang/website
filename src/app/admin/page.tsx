"use client";

import { useEffect, useState } from 'react';
import { db, MembershipRequest } from '@/lib/db';
import { Mail, Phone, MapPin, Calendar, FileText, Check, X, Users, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import AnnouncementManager from '@/components/admin/AnnouncementManager';
import { getAdminRequests, approveRequest } from '@/actions/admin';

import GalleryManager from '@/components/admin/GalleryManager';
import MemberDetailModal from '@/components/admin/MemberDetailModal';
import { getAllMembersForRegistry } from '@/actions/admin';

export default function AdminMembersPage() {
    const [requests, setRequests] = useState<MembershipRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Tabs state
    const [activeTab, setActiveTab] = useState<'members' | 'announcements' | 'gallery' | 'registry'>('members');

    // Registry state
    const [registeredMembers, setRegisteredMembers] = useState<any[]>([]);

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);

    const loadRequests = async () => {
        const { data, error } = await getAdminRequests();
        if (error === "Unauthorized") {
            window.location.href = '/login';
            return;
        }
        if (data) setRequests(data);
        if (error) alert("Greška pri učitavanju zahtjeva: " + error);
    };

    const loadRegistry = async () => {
        const res = await getAllMembersForRegistry();
        if (res.data) {
            // Combine and sort by date
            const all = res.data.profiles.sort((a: any, b: any) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            setRegisteredMembers(all);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([loadRequests(), loadRegistry()]);
            setLoading(false);
        };
        init();
    }, []);

    const handleApprove = async (req: MembershipRequest) => {
        if (!confirm(`Odobriti pristup za ${req.name}?`)) return;

        // Optimistic update
        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));

        const res = await approveRequest(req.id, req.email, req.name);

        if (res.error) {
            alert('Greška: ' + res.error);
            // Revert optimistic update
            setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'pending' } : r));
        } else {
            alert('Korisnik odobren! Sada možete poslati obavijest klikom na gumb "Obavijesti".');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Učitavanje podataka...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800 mb-2">Admin Dashboard</h1>
                        <p className="text-zinc-500 text-sm">Upravljanje članstvom i sadržajem stranice.</p>
                    </div>
                    <a href="/admin/register-print" target="_blank" className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-md text-sm font-bold shadow hover:bg-zinc-700 transition-colors">
                        <FileText size={16} /> Ispis Registra
                    </a>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-6 border-b border-zinc-100 pb-1">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'members' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <Users size={16} /> Članovi
                    </button>
                    <button
                        onClick={() => setActiveTab('announcements')}
                        className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'announcements' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <MessageSquare size={16} /> Obavijesti
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <ImageIcon size={16} /> Galerija
                    </button>
                    <button
                        onClick={() => setActiveTab('registry')}
                        className={`flex items-center gap-2 pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'registry' ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        <FileText size={16} /> Registar
                    </button>
                </div>
            </div>

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
                <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
                    {requests.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">
                            Nema novih zahtjeva za članstvo.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 text-zinc-700 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Datum</th>
                                        <th className="px-6 py-4">Kandidat</th>
                                        <th className="px-6 py-4">Osobni Podaci</th>
                                        <th className="px-6 py-4">Kontakt & Metoda</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-zinc-50 align-top">
                                            <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{req.date}</td>

                                            <td className="px-6 py-4">
                                                <div className="font-medium text-zinc-900">{req.name}</div>
                                                {req.oib && <div className="text-xs text-zinc-500">OIB: {req.oib}</div>}
                                                {req.accepted_statute && (
                                                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                                                        <FileText size={10} /> Statut Prihvaćen
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-zinc-600 mb-1">
                                                    <MapPin size={14} className="text-zinc-400" /> {req.address}
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-600">
                                                    <Calendar size={14} className="text-zinc-400" /> {req.dob}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-zinc-900 font-medium mb-1">
                                                    <Mail size={14} className="text-zinc-400" /> {req.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-600 mb-1">
                                                    <Phone size={14} className="text-zinc-400" /> {req.phone}
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">
                                                    Preferira: <span className="font-semibold">{req.contact_method || 'Sve'}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${req.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {req.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleApprove(req)}
                                                            className="md:px-3 px-2 py-1.5 bg-zinc-900 text-white hover:bg-zinc-700 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                                            title="Odobri Pristup"
                                                        >
                                                            <Check size={14} /> <span className="hidden md:inline">Odobri</span>
                                                        </button>
                                                    )}
                                                    {req.status === 'approved' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSelectedRequest(req)}
                                                                className="md:px-3 px-2 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-zinc-200"
                                                                title="Prikaži Detalje"
                                                            >
                                                                <FileText size={14} /> <span className="hidden md:inline">Detalji</span>
                                                            </button>
                                                            <a
                                                                href={`mailto:${req.email}?subject=Vaš zahtjev za članstvo je odobren!&body=Poštovani ${req.name},%0D%0A%0D%0AVaš zahtjev za članstvom u Udruzi Građana Baljci je odobren!%0D%0A%0D%0AMolimo vas da završite registraciju svog računa klikom na sljedeći link:%0D%0A${window.location.origin}/register%0D%0A%0D%0ALijep pozdrav,%0D%0AAdministrator`}
                                                                className="md:px-3 px-2 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-green-200"
                                                                title="Pošalji Email Obavijest"
                                                            >
                                                                <Mail size={14} /> <span className="hidden md:inline">Obavijesti</span>
                                                            </a>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ANNOUNCEMENTS TAB */}
            {activeTab === 'announcements' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                    <AnnouncementManager profileId={user?.id || ''} />
                </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                    <GalleryManager />
                </div>
            )}

            {/* REGISTRY TAB */}
            {activeTab === 'registry' && (
                <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 text-zinc-700 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">#</th>
                                    <th className="px-6 py-4">Ime i Prezime</th>
                                    <th className="px-6 py-4">E-mail</th>
                                    <th className="px-6 py-4">Status / Tier</th>
                                    <th className="px-6 py-4 text-right">Datum Registracije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {registeredMembers.map((member, index) => (
                                    <tr key={member.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 text-center font-mono text-zinc-400">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-zinc-900">
                                            {member.full_name || member.display_name || 'Korisnik bez imena'}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600">{member.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${member.membership_tier === 'voting' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                member.membership_tier === 'supporter' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                                                    'bg-zinc-100 text-zinc-800 border-zinc-200'
                                                }`}>
                                                {member.membership_tier || 'FREE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-zinc-500 font-mono">
                                            {new Date(member.created_at).toLocaleDateString('hr-HR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* Member Details Modal */}
            {
                selectedRequest && (
                    <MemberDetailModal
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onUpdate={(updatedReq) => {
                            setRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
                            setSelectedRequest(updatedReq);
                        }}
                    />
                )
            }
        </div>
    );
}
