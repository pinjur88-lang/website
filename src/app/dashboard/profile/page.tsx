"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getProfile, updateProfile } from '@/actions/profile';
import { User, Image as ImageIcon, Check, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { useLanguage } from '@/lib/language-context';

export default function ProfileSettingsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [tier, setTier] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) return;
            const res = await getProfile(user.id);
            if (res.data) {
                setDisplayName(res.data.display_name || res.data.full_name || '');
                setBio(res.data.bio || '');
                setAvatarUrl(res.data.avatar_url || '');
                setTier(res.data.membership_tier || 'free');
                setRole(res.data.role || 'user');
            }
            setLoading(false);
        };
        loadProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setSaving(true);
        const res = await updateProfile(user.id, { 
            display_name: displayName, 
            bio, 
            avatar_url: avatarUrl 
        });

        if (res.error) {
            alert('Error updating profile: ' + res.error);
        } else {
            alert('Profil uspješno ažuriran! (Profile updated successfully!)');
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setSaving(true);
        try {
            // 1. Compress image
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            // 2. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, compressedFile, { upsert: true });

            if (uploadError) throw uploadError;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        } catch (error: any) {
            alert('Greška pri učitavanju slike (Error uploading): ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-sky-600"><Loader2 className="animate-spin mx-auto" size={32} /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-sky-100 pb-4">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="text-sky-600" /> Profil i Postavke (Profile Settings)
                </h1>
                <p className="text-slate-500 text-sm mt-1">Uredite svoj profil, biografiju i profilnu sliku.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 space-y-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-slate-300" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-sky-600 text-white p-2 rounded-full cursor-pointer hover:bg-sky-700 transition shadow-md">
                            <ImageIcon size={14} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleAvatarUpload}
                                disabled={saving}
                            />
                        </label>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-slate-800 text-lg">Profilna Slika</h3>
                        <p className="text-xs text-slate-500 mt-1">Kliknite na ikonu kamere za promjenu slike. Maksimalna veličina: 5MB.</p>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                             <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wide">
                                Role: {role}
                            </span>
                             <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-bold uppercase tracking-wide">
                                Tier: {tier}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Prikazano Ime (Display Name)</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
                            placeholder="Vaše ime za forum"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kratka Biografija (Bio) - Opcionalno</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition min-h-[120px] resize-none"
                            placeholder="Npr. Ja sam unuk Ivana iz zaseoka..."
                            maxLength={500}
                        />
                        <p className="text-xs text-slate-400 mt-1 text-right">{bio.length} / 500</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-sky-700 disabled:opacity-50 transition shadow-sm"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Spremi Promjene (Save)
                    </button>
                </div>
            </form>
        </div>
    );
}
