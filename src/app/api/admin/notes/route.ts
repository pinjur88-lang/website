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
        if (authError || !supabaseAdmin) return NextResponse.json({ error: authError }, { status });


        const { requestId, notes } = await request.json();

        const { error } = await supabaseAdmin
            .from('requests')
            .update({ admin_notes: notes })
            .eq('id', requestId);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
