import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        // Check Admin Role
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
        }

        const { requestId } = await request.json();

        // Fetch Request
        const { data: reqData, error: reqError } = await supabaseAdmin
            .from('requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (reqError) throw reqError;

        // Fetch Donations
        const { data: donations, error: donError } = await supabaseAdmin
            .from('donations')
            .select('*')
            .eq('request_id', requestId)
            .order('date', { ascending: false });

        if (donError) throw donError;

        return NextResponse.json({
            data: { ...reqData, donations }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
