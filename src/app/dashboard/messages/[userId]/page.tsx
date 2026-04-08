"use client";

import { useEffect, useState, useRef } from 'react';
import { getMessagesHistory, sendMessage, markMessagesAsRead, Message } from '@/actions/messages';
import { useAuth } from '@/lib/auth-context';
import { User, Shield, ArrowLeft, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';

export default function ChatPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const params = useParams();
    const otherUserId = params?.userId as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [partnerProfile, setPartnerProfile] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadMessages = async () => {
        if (!otherUserId) return;
        const res = await getMessagesHistory(otherUserId);
        if (res.error) {
            console.error(res.error);
        } else {
            setMessages(res.messages || []);
            setPartnerProfile(res.otherUser);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadMessages();
        // Mark as read when entering
        if (otherUserId) {
            markMessagesAsRead(otherUserId);
        }
    }, [otherUserId]);

    // Scroll to bottom when messages load
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUserId || !user) return;
        
        setSending(true);
        const res = await sendMessage(otherUserId, newMessage);
        if (res.error) {
            alert((t.errorPrefix || 'Greška pri slanju: ') + res.error);
        } else if (res.data) {
            setNewMessage('');
            // Optimistically update
            setMessages((prev) => [...prev, res.data]);
        }
        setSending(false);
    };

    if (loading) {
        return <div className="text-center p-8 text-sky-600"><Loader2 className="animate-spin mx-auto" size={32} /></div>;
    }

    if (!partnerProfile) {
        return <div className="text-center p-8 text-slate-500">{(t.unknownUser || 'Korisnik nije pronađen.')}</div>;
    }

    const partnerName = partnerProfile.display_name || partnerProfile.full_name || (t.unknownUser || 'Korisnik');

    return (
        <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white border border-sky-100 shadow-lg rounded-2xl overflow-hidden">
            
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-sky-50 border-b border-sky-100 shrink-0">
                <Link href="/dashboard/messages" className="text-sky-600 hover:text-sky-800 p-2 rounded-full hover:bg-sky-100 transition" title={t.backToMessages || 'Natrag na poruke'}>
                    <ArrowLeft size={20} />
                </Link>
                <Link href={`/dashboard/community/user/${partnerProfile.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full border border-sky-200 bg-white shadow-sm overflow-hidden flex items-center justify-center">
                        {partnerProfile.avatar_url ? (
                            <img src={partnerProfile.avatar_url} alt={partnerName} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                        ) : (
                            <User size={18} className="text-slate-400 group-hover:text-sky-600 transition" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 group-hover:text-sky-700 transition flex items-center gap-2">
                            {partnerName}
                            {partnerProfile.role === 'admin' && <span title="Admin" className="flex items-center"><Shield size={12} className="text-amber-500" /></span>}
                        </h2>
                    </div>
                </Link>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center flex-col text-slate-400 p-4 text-center">
                        <User size={48} className="mb-2 opacity-50" />
                        <p>{(t.startDiscussion || 'Započnite razgovor s članom ')} {partnerName}.</p>
                        <p className="text-xs mt-1">{(t.disclaimer || 'Sve poruke su privatne.')}</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe ? 'bg-sky-600 text-white rounded-br-none shadow-md' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-sky-200' : 'text-slate-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && msg.read && <span className="ml-1" title="Pročitano">✓✓</span>}
                                        {isMe && !msg.read && <span className="ml-1 opacity-70" title="Poslano">✓</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-end gap-3 shrink-0">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}
                    placeholder={t.messagePlaceholder || "Napišite poruku..."}
                    className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-2xl p-3 px-4 max-h-32 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                    rows={1}
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 transition-colors shadow-md flex-shrink-0 mb-0.5"
                    title={t.send || 'Pošalji'}
                >
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                </button>
            </form>

        </div>
    );
}
