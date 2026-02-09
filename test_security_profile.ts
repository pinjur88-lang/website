
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testSignupAndProfile() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("URL:", supabaseUrl);

    if (!supabaseUrl || !anonKey) return;

    const supabase = createClient(supabaseUrl, anonKey);

    const email = `audit_${Date.now()}@test.com`;
    const password = 'TestPassword123!';

    console.log(`1. Signing up ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: 'Audit Bot' }
        }
    });

    if (authError) {
        console.error("Signup Error:", authError.message);
        return;
    }

    const userId = authData.user?.id;
    console.log("Signup Success. User ID:", userId);

    if (!userId) return;

    // 2. Check Profile immediately
    console.log("2. Checking Profile...");
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error("Profile Fetch Error:", profileError.message);
    } else {
        console.log("Profile Found:", profile);
    }
}

testSignupAndProfile();
