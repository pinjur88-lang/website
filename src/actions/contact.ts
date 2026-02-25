'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendContactEmail } from '@/lib/mail';

export async function sendMessage(formData: FormData) {
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const message = formData.get('message') as string;
    const isAnonymous = formData.get('is_anonymous') === 'true';

    if (!message || (!email && !isAnonymous)) {
        return { error: "Message is required, and Email is required unless sending anonymously." };
    }

    try {
        // 1. Save to Database
        const { error: dbError } = await supabaseAdmin
            .from('contact_messages')
            .insert([{
                user_email: isAnonymous ? null : email,
                category,
                subject,
                message,
                is_anonymous: isAnonymous
            }]);

        if (dbError) {
            console.error("[Contact] Database save failed:", dbError);
            throw dbError;
        }

        // 2. Send Email via helper
        const result = await sendContactEmail({ email, category, subject, message });

        return {
            success: true,
            emailSent: result.success,
            emailError: result.error,
            message: result.success ? "Message sent and email delivered." : "Message saved to DB, but email delivery failed."
        };
    } catch (error: any) {
        console.error("[Contact] General error:", error);
        return { error: error.message };
    }
}
