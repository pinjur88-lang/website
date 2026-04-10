import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    // 1. Verify Authentication
    // Vercel Cron sends a generic Authorization header: Bearer <CRON_SECRET>
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Perform a lightweight query to Supabase to "keep it alive"
        // We select the count of rows in the profiles table.
        const { count, error } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase Ping Error:', error);
            throw error;
        }

        console.log(`Supabase keep-alive success. Profile count: ${count}`);

        return NextResponse.json({ 
            success: true, 
            message: 'Supabase pinged successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
