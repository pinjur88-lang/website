
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const cookieStore = await cookies();
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    flowType: 'pkce',
                    detectSessionInUrl: false,
                    autoRefreshToken: true,
                    persistSession: true,
                    storage: {
                        getItem: (key) => {
                            const cookie = cookieStore.get(key);
                            return cookie?.value ?? null;
                        },
                        setItem: (key, value) => {
                            cookieStore.set(key, value);
                        },
                        removeItem: (key) => {
                            cookieStore.delete(key);
                        },
                    },
                }
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=AuthCodeError`);
}
