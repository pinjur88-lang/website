'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Vote, ChartBar, Lock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { getPolls, castVote, getUserVote } from '@/actions/voting';

export default function VotingHallPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [polls, setPolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userVotes, setUserVotes] = useState<Record<string, number | null>>({});
    const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

    const isSilverOrAbove = user?.membership_tier === 'silver' || user?.membership_tier === 'gold' || user?.role === 'admin';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data, error } = await getPolls();
        if (data) {
            setPolls(data);
            // Load user votes
            const votes: Record<string, number | null> = {};
            for (const poll of data) {
                const res = await getUserVote(poll.id);
                votes[poll.id] = res.data;
            }
            setUserVotes(votes);
        }
        setLoading(false);
    };

    const handleVote = async (pollId: string, optionIndex: number) => {
        if (!isSilverOrAbove) return;

        setVotingInProgress(pollId);
        const res = await castVote(pollId, optionIndex);
        if (res.success) {
            await loadData();
        } else {
            alert(res.error);
        }
        setVotingInProgress(null);
    };

    if (loading) {
        return <div className="p-8 text-center animate-pulse text-slate-500">Učitavanje glasovanja...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Vote className="text-sky-600" size={32} />
                    {t.votingHall || 'Dvorana za Glasovanje'}
                </h1>
                <p className="text-slate-500 text-lg">
                    {t.title === "Association Baljci"
                        ? "Shape the future of our village. Every vote counts towards communal decisions."
                        : "Sudjelujte u odlučivanju o budućnosti sela. Vaš glas je bitan za zajedničke projekte."}
                </p>
            </div>

            {/* UPSELL BANNER */}
            {!isSilverOrAbove && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-xl text-white shadow-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Lock size={24} />
                        </div>
                        <div>
                            <p className="font-bold">Nadogradite na SILVER Status</p>
                            <p className="text-xs opacity-90">Pravo glasa imaju samo Silver i Gold članovi udruge.</p>
                        </div>
                    </div>
                    <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap">
                        Saznaj Više
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {polls.map((poll) => {
                    const hasVoted = userVotes[poll.id] !== null;
                    const selectedOption = userVotes[poll.id];

                    return (
                        <div key={poll.id} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                            {/* Poll Info */}
                            <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-sky-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${poll.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {poll.is_active ? 'Aktivno' : 'Završeno'}
                                    </span>
                                    {hasVoted && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                                            <CheckCircle2 size={12} /> GLASALI STE
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">{poll.title}</h2>
                                <p className="text-slate-500 mb-6 leading-relaxed">
                                    {poll.description}
                                </p>

                                <div className="space-y-3">
                                    {poll.options.map((option: string, index: number) => {
                                        const isSelected = selectedOption === index;
                                        return (
                                            <button
                                                key={index}
                                                disabled={hasVoted || !isSilverOrAbove || votingInProgress === poll.id}
                                                onClick={() => handleVote(poll.id, index)}
                                                className={`w-full p-4 rounded-xl border-2 text-left transition-all relative group overflow-hidden ${isSelected
                                                        ? 'border-sky-500 bg-sky-50'
                                                        : hasVoted
                                                            ? 'border-slate-100 cursor-default'
                                                            : !isSilverOrAbove
                                                                ? 'border-slate-100 opacity-60 cursor-not-allowed'
                                                                : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className={`font-semibold ${isSelected ? 'text-sky-900' : 'text-slate-700'}`}>
                                                        {option}
                                                    </span>
                                                    {isSelected && <CheckCircle2 className="text-sky-600" size={18} />}
                                                </div>
                                                {!isSilverOrAbove && !hasVoted && (
                                                    <div className="absolute inset-0 bg-slate-50/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                                                        <span className="text-[10px] bg-slate-800 text-white px-2 py-1 rounded">Nadogradite za glasanje</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Poll Results */}
                            <div className="p-8 md:w-1/2 bg-slate-50/50 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <ChartBar size={20} className="text-sky-600" />
                                        {t.liveResults || 'Rezultati Uživo'}
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400">UKUPNO: {poll.totalVotes}</span>
                                </div>

                                <div className="space-y-6">
                                    {poll.options.map((option: string, index: number) => {
                                        const count = poll.results[index] || 0;
                                        const percentage = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;

                                        return (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-slate-600 uppercase tracking-tight">{option}</span>
                                                    <span className="text-sky-600">{percentage}%</span>
                                                </div>
                                                <div className="h-4 bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-[10px] text-slate-400 text-right uppercase">
                                                    {count} {count === 1 ? 'glas' : count < 5 ? 'glasa' : 'glasova'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sky-100">
                                        <Info className="text-sky-600 flex-shrink-0" size={18} />
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            {t.title === "Association Baljci"
                                                ? "Votes are anonymized. One member per household is encouraged to participate in project-specific voting."
                                                : "Glasanje je anonimno. Potiču se svi članovi obitelji na sudjelovanje, no pravno glasa jedan registrirani Silver član."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
