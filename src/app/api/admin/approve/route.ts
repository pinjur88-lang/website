import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth-admin';

export async function POST(request: Request) {
    try {
        // 1. Verify Auth Header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        // 2 & 3. Verify Admin Token and Initialize Supabase
        const { supabaseAdmin, error: authError, status } = await verifyAdminToken(token);
        if (authError || !supabaseAdmin) {
            return NextResponse.json({ error: authError }, { status });
        }


        // 4. Update Request Status in Database
        const { requestId } = await request.json();

        const { error: dbError } = await supabaseAdmin
            .from('requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

        if (dbError) {
            throw new Error(`Database error: ${dbError.message}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Approval Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
