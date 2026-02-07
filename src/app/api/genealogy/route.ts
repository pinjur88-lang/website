import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/genealogy?search=Surname
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (id) {
        // Fetch specific person and their immediate family for graph
        const { data: person, error } = await supabase
            .from('people')
            .select('*')
            .eq('original_id', id)
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Fetch parents
        const parentIds = [person.father_id, person.mother_id].filter(Boolean);
        const { data: parents } = await supabase
            .from('people')
            .select('*')
            .in('original_id', parentIds);

        // Fetch children
        const { data: children } = await supabase
            .from('people')
            .select('*')
            .or(`father_id.eq.${id},mother_id.eq.${id}`);

        return NextResponse.json({ person, parents, children });
    }

    if (search) {
        // Search by surname or name
        const { data, error } = await supabase
            .from('people')
            .select('original_id, name, surname, birth_year, origin')
            .ilike('surname', `%${search}%`)
            .limit(50);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    // Default: Return random sample or top nodes to start visualization
    const { data, error } = await supabase
        .from('people')
        .select('original_id, name, surname, birth_year')
        .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
