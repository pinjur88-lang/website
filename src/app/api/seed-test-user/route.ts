import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'No Service Role Key' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const email = 'Test@test.com';
        const password = 'password';
        const name = 'Test User';

        // 1. Ensure Request Exists and is Approved
        const { error: reqError } = await supabase
            .from('requests')
            .upsert({
                name,
                email,
                reason: 'Test Account',
                status: 'approved',
                contact_method: 'Email',
                date: new Date().toLocaleDateString('hr-HR'),
                accepted_statute: true,
                address: 'Test Address',
                dob: '1990-01-01'
            }, { onConflict: 'email' });

        if (reqError) throw new Error('Request DB Error: ' + reqError.message);

        // 2. Create Auth User
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { display_name: name, role: 'member' }
        });

        if (createError) {
            // If user exists, we might want to update password, but for now just return info
            return NextResponse.json({ warning: 'User might already exist', details: createError.message });
        }

        return NextResponse.json({ success: true, user: userData });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
