"use client";

import { useEffect, useState, useCallback } from 'react';
import { getInboxConversations } from '@/actions/messages';
import { Mail, ChevronRight, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

interface Conversation {
    other_user_id: string;
    other_user_name: string;
    other_user_avatar?: string;
    other_user_role?: string;
    unread_count: number;
    last_message: string;
    last_message_date: string;
}

export default function InboxPage() {
    const { t } = useLanguage();
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadInbox = useCallback(async () => {
        const res = await getInboxConversations();
        if (res.error) {
            setError(res.error);
        } else {
            setConvos(res.data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadInbox();
    }, [loadInbox]);
    
    if (loading) {
        return <div className="text-center p-12 text-sky-600"><Loader2 className="animate-spin mx-auto" size={32} /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{t.errorPrefix || "Error: "} {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end border-b border-sky-100 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Mail className="text-sky-600" /> {t.messagesTitle || "Poruke"}
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">{t.messagesSubtitle || "Vaši privatni razgovori s drugim članovima"}</p>
                </div>
            </div>

            {convos.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-sky-100">
                    <Mail size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">{t.noMessages || "Nemate poruka"}</h3>
                    <p className="text-slate-500 mt-2 text-sm">{t.noMessagesDesc || "Započnite razgovor s članovima preko njihovih profila na forumu."}</p>
                </div>
            ) : (
                <div className="bg-white border border-sky-100 rounded-xl shadow-sm overflow-hidden">
                    <ul className="divide-y divide-sky-50 transition-colors">
                        {convos.map((c) => (
                            <li key={c.other_user_id} className="hover:bg-slate-50 transition">
                                <Link href={`/dashboard/messages/${c.other_user_id}`} className="flex items-center gap-4 p-4 sm:p-5">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 shadow-sm overflow-hidden flex items-center justify-center relative">
                                            {c.other_user_avatar ? (
                                                <Image 
                                                    src={c.other_user_avatar} 
                                                    alt={c.other_user_name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                            ) : (
                                                <User size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        {c.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                                                {c.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-base truncate ${c.unread_count > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                                                {c.other_user_name}
                                                {c.other_user_role === 'admin' && <span className="ml-2 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>}
                                            </h3>
                                            <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                                                {new Date(c.last_message_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${c.unread_count > 0 ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                                            {c.last_message}
                                        </p>
                                    </div>
                                    <div className="text-slate-300">
                                        <ChevronRight size={20} />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
