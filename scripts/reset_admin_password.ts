
import { supabaseAdmin } from '../src/lib/supabase-admin';

async function resetAdminPassword() {
    const email = 'udrugabaljci@gmail.com';
    const newPassword = 'Jojlolomoj2026!';

    console.log(`Attempting to reset password for ${email}...`);

    try {
        // List users to find ID first
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) throw listError;

        const adminUser = users.find(u => u.email === email);

        if (!adminUser) {
            console.error(`User ${email} not found!`);
            // Optional: Create if missing?
            return;
        }

        console.log(`Found user ${adminUser.id}. Updating password...`);

        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            adminUser.id,
            { password: newPassword, email_confirm: true }
        );

        if (updateError) {
            console.error('Error updating password:', updateError);
        } else {
            console.log('Password updated successfully!');
            console.log('User:', updateData.user.email);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

resetAdminPassword();
