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

    console.log(`[Contact] Processing message from ${email}. Category: ${category}`);

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

        console.log("[Contact] Message saved to database successfully.");

        // 2. Send Email
        let emailSent = false;
        let emailError = null;

        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            try {
                // Verify connection configuration
                await transporter.verify();
                console.log("[Contact] SMTP transporter verified.");

                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: 'udrugabaljci@gmail.com',
                    subject: `[Web Kontakt] ${category}: ${subject}`,
                    text: `Poruka od: ${email}\nKategorija: ${category}\nPredmet: ${subject}\n\nPoruka:\n${message}`,
                    replyTo: email
                };

                const info = await transporter.sendMail(mailOptions);
                console.log("[Contact] Email sent successfully:", info.messageId);
                emailSent = true;
            } catch (err: any) {
                console.error("[Contact] Email sending failed:", err);
                emailError = err.message;
            }
        } else {
            console.warn("[Contact] Email variables (GMAIL_USER/GMAIL_APP_PASSWORD) missing. Check environment variables.");
            emailError = "Missing environment variables";
        }

        return {
            success: true,
            emailSent,
            emailError,
            message: emailSent ? "Message sent and email delivered." : "Message saved to DB, but email delivery was skipped or failed."
        };
    } catch (error: any) {
        console.error("[Contact] General error:", error);
        return { error: error.message };
    }
}
