import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function verifyAdmin() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return false;
    }

    // Check for hardcoded admin email
    if (user.email === 'udrugabaljci@gmail.com') {
        return true;
    }

    // Ideally we also check 'role' in public.profiles or app_metadata,
    // but for now relying on email is the requested strict check.
    // If you add other admins later, add DB check here.
    return false;
}

/**
 * Checks admin privileges using a Bearer token (for API routes)
 */
export async function verifyAdminToken(token: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return { error: 'Unauthorized', status: 401 };

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();

    if (profile?.role === 'admin' || user.email === 'udrugabaljci@gmail.com') {
        return { user, supabaseAdmin };
    }

    return { error: 'Forbidden', status: 403 };
}

export async function verifyUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
