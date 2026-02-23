import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Parse .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function investigateUser() {
    const rawEmail = 'tigajaa@gmail.com';
    const emailLower = rawEmail.toLowerCase();

    console.log(`\n--- Investigating User: ${rawEmail} ---`);

    // 1. Get from Requests (to check the status) - Exact Match
    const { data: requestExact } = await supabaseAdmin
        .from('requests')
        .select('*')
        .eq('email', rawEmail);

    console.log(`\nExact email match (${requestExact?.length || 0}):`, requestExact);

    // 2. Get from Requests - Case Insensitive Match (ilike)
    const { data: requestIlike } = await supabaseAdmin
        .from('requests')
        .select('*')
        .ilike('email', emailLower);

    console.log(`\nILike email match (${requestIlike?.length || 0}):`, requestIlike);
}

investigateUser();
