'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

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

        if (dbError) throw dbError;

        // 2. Send Email
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: 'udrugabaljci@gmail.com',
                subject: `[Web Kontakt] ${category}: ${subject}`,
                text: `Poruka od: ${email}\nKategorija: ${category}\nPredmet: ${subject}\n\nPoruka:\n${message}`,
                replyTo: email
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.warn("Email variables missing, only saved to database.");
        }

        return { success: true };
    } catch (error: any) {
        console.error("Contact error:", error);
        return { error: error.message };
    }
}
