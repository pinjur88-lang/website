import { createServerClient } from "@supabase/ssr";
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
