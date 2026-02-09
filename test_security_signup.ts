
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function attemptUnauthorizedSignup() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        console.error("Missing credentials");
        return;
    }

    const supabase = createClient(supabaseUrl, anonKey);

    const testEmail = `intruder_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    console.log(`Attempting signup with: ${testEmail} ...`);

    const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
    });

    if (error) {
        console.log("Signup Failed (Expected if Signups disabled):", error.message);
    } else {
        console.log("Signup SUCCESS (VULNERABILITY FOUND):", data.user?.id);
        console.log("User created but not approved in 'requests' table.");
    }
}

attemptUnauthorizedSignup();
