import { getProfile } from '@/actions/profile';
import { User, Shield, Award, Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
    const { id } = params;
    
    const res = await getProfile(id);
    if (res.error || !res.data) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500">
                <h2>Profil nije pronađen (Profile not found).</h2>
                <Link href="/dashboard/community" className="text-sky-600 hover:underline mt-4 inline-block">Natrag na forum</Link>
            </div>
        );
    }

    const p = res.data;
    const name = p.display_name || p.full_name || 'Član Udruge';

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link href="/dashboard/community" className="flex items-center gap-1 text-sky-600 hover:text-sky-800 transition font-medium text-sm w-fit">
                <ChevronLeft size={16} /> Natrag na Forum (Back)
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden relative">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-sky-400 to-indigo-500 w-full" />
                
                <div className="px-6 pb-8 relative">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12 mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
                            {p.avatar_url ? (
                                <img src={p.avatar_url} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                    <User size={60} className="text-slate-300" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left pb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                                {p.role === 'admin' && (
                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        <Shield size={12} /> Administrator
                                    </span>
                                )}
                                {p.membership_tier === 'voting' && (
                                    <span className="flex items-center gap-1 bg-sky-100 text-sky-800 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        <Award size={12} /> Punopravni Član
                                    </span>
                                )}
                                {p.donor_tier && p.donor_tier !== 'none' && (
                                    <span className="flex items-center gap-1 bg-fuchsia-100 text-fuchsia-800 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        Donor: {p.donor_tier}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">O Članu (About)</h3>
                        {p.bio ? (
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{p.bio}</p>
                        ) : (
                            <p className="text-slate-400 italic">Ovaj korisnik još nije unio biografiju. (No bio provided yet.)</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
