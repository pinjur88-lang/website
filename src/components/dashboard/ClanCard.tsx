
import { Users, Globe, BookOpen, Shield } from 'lucide-react';
import { Clan } from '@/actions/memorial';
import { useLanguage } from '@/lib/language-context';

export default function ClanCard({ clan }: { clan: Clan }) {
    const { language } = useLanguage();

    // Fallback logic
    const langKey = (language === 'hr' || language === 'en' || language === 'de') ? language : 'en';

    // Helper to get field dynamically with fallback to English
    const getField = (field: 'prevalence' | 'world_distribution' | 'description') => {
        // e.g. clan.prevalence_hr
        const key = `${field}_${langKey}` as keyof Clan;
        const fallbackKey = `${field}_en` as keyof Clan;
        return clan[key] || clan[fallbackKey] || 'N/A';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold font-serif text-stone-900 tracking-wide">
                    {clan.surname}
                </h3>
                <Shield className="text-stone-300 group-hover:text-amber-600 transition-colors" size={20} />
            </div>

            <div className="p-6 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-bold">
                            <Users size={12} />
                            {language === 'hr' ? 'Rasprostranjenost' : (language === 'de' ? 'Verbreitung' : 'Prevalence')}
                        </div>
                        <p className="font-medium text-stone-700">{getField('prevalence')}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-bold">
                            <Globe size={12} />
                            {language === 'hr' ? 'Dijaspora' : (language === 'de' ? 'Diaspora' : 'Diaspora')}
                        </div>
                        <p className="font-medium text-stone-700">{getField('world_distribution')}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-stone-50">
                    <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-bold mb-2">
                        <BookOpen size={12} />
                        {language === 'hr' ? 'Povijest i Podrijetlo' : (language === 'de' ? 'Geschichte' : 'History & Origin')}
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {getField('description')}
                    </p>
                </div>
            </div>
        </div>
    );
}
