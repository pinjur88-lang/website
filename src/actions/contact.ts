'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as string;
    const message = formData.get('message') as string;

    if (!message || !email) {
        return { error: "Email and Message are required" };
    }

    try {
        const { error } = await supabaseAdmin
            .from('contact_messages')
            .insert([{
                user_email: email,
                category,
                subject,
                message
            }]);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Contact error:", error);
        return { error: error.message };
    }
}
