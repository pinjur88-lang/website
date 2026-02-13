
import { supabaseAdmin } from '../src/lib/supabase-admin';

async function inspectRequestsTable() {
    console.log("Inspecting 'requests' table...");
    // Just try to select one item to see if it works and maybe properties
    try {
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error selecting from requests:', error);
        } else {
            console.log('Successfully selected from requests:', data);
        }

        // Also check if we can insert as admin
        // const { error: insertError } = await supabaseAdmin.from('requests').insert([{ email: 'test@test.com', full_name: 'Test', status: 'pending' }]);
        // if (insertError) console.error('Insert Error:', insertError);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

inspectRequestsTable();
