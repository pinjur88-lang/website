'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendContactEmail } from '@/lib/mail';

export async function sendMessage(formData: FormData) {
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const message = formData.get('message') as string;

    if (!message || !email) {
        return { error: "Email and Message are required" };
    }

    try {
        // 1. Save to Database
        const { error: dbError } = await supabaseAdmin
            .from('contact_messages')
            .insert([{
                user_email: email,
                category,
                subject,
                message
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
