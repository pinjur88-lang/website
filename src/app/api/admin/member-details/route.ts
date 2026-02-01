import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth-admin';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];

        const { supabaseAdmin, error: authError, status } = await verifyAdminToken(token);
        if (authError || !supabaseAdmin) {
            return NextResponse.json({ error: authError }, { status });
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
