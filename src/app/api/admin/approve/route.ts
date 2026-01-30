import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, requestId, name } = await request.json();

        // 1. Initialize Supabase Admin with Service Role Key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            return NextResponse.json(
                { error: 'Server misconfiguration: Missing Service Role Key' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 2. Invite User via Email
        // This sends an email with a link to set their password
        const { data: userData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: { display_name: name, role: 'member' }
        });

        if (inviteError) {
            // If user already exists, that's okay, just proceed to update status
            console.warn('Invite warning (user might exist):', inviteError.message);
        }

        // 3. Update Request Status in Database
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
