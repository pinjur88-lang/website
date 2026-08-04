import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== 'baljci-clean-2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Get all pending requests
        const { data: pendingRequests, error: reqError } = await supabaseAdmin
            .from('requests')
            .select('*')
            .eq('status', 'pending');

        if (reqError) throw reqError;
        if (!pendingRequests || pendingRequests.length === 0) {
            return NextResponse.json({ message: 'No pending requests found.' });
        }

        const deletedEmails: string[] = [];
        let errorCount = 0;

        for (const req of pendingRequests) {
            const email = req.email;
            if (!email) continue;

            // Delete from Auth if exists
            let page = 1;
            let hasMore = true;
            let authUserId = null;

            while (hasMore) {
                const { data: userData } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
                if (!userData || !userData.users) break;

                const user = userData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
                if (user) {
                    authUserId = user.id;
                    break;
                }
                if (userData.users.length < 1000) hasMore = false;
                else page++;
            }

            if (authUserId) {
                await supabaseAdmin.auth.admin.deleteUser(authUserId);
            }

            // Delete from profiles
            await supabaseAdmin.from('profiles').delete().eq('email', email);

            // Delete from requests
            await supabaseAdmin.from('requests').delete().eq('email', email);

            deletedEmails.push(email);
        }

        return NextResponse.json({ 
            message: `Successfully deleted ${deletedEmails.length} pending bots.`,
            deletedEmails,
            errors: errorCount
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
