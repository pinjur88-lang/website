import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Create bucket if it doesn't exist
        await supabaseAdmin.storage.createBucket('gallery', { public: true });

        // Update bucket to be public if it already exists
        const { error: updateError } = await supabaseAdmin.storage.updateBucket('gallery', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });

        return NextResponse.json({ success: true, updateError });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
