import nodemailer from 'nodemailer';

const getFromEmail = () => process.env.EMAIL_FROM || 'info@baljci.org';
const getAdminEmail = () => 'udrugabaljci@gmail.com';

const isResend = process.env.SMTP_HOST === 'smtp.resend.com';
const resendApiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASSWORD;

// Fallback transporter for Gmail or other SMTP
export const transporter = nodemailer.createTransport(
    process.env.SMTP_HOST && !isResend
    ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_PORT === '465' || process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    } 
    : {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    }
);

async function sendViaResend(data: { from: string, to: string | string[], subject: string, text?: string, html?: string, replyTo?: string }) {
    if (!resendApiKey) throw new Error("Missing Resend API Key / SMTP Password");
    
    const payload: any = {
        from: data.from,
        to: Array.isArray(data.to) ? data.to : [data.to],
        subject: data.subject,
    };
    if (data.html) payload.html = data.html;
    if (data.text) payload.text = data.text;
    if (data.replyTo) payload.reply_to = data.replyTo;

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || 'Failed to send via Resend REST API');
    }
    return { messageId: json.id };
}

export async function sendAdminNotification(data: any) {
    if (!getFromEmail()) return;
    const mailData = {
        from: getFromEmail(),
        to: getAdminEmail(),
        subject: `[Novi Zahtjev] ${data.name}`,
        text: `Novi zahtjev za pristup/članstvo:\n\n` +
            `Ime: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Mobitel: ${data.phone}\n` +
            `Adresa: ${data.address}\n` +
            `Razlog: ${data.reason}\n\n` +
            `Prijavite se na admin panel za odobrenje: https://www.baljci.org/admin`,
        replyTo: data.email
    };
    if (isResend) {
        return sendViaResend(mailData).catch(err => console.error(err));
    }
    return transporter.sendMail(mailData).catch(err => console.error(err));
}

export async function sendContactEmail(data: { email: string, category: string, subject: string, message: string }) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const mailData = {
            from: getFromEmail(),
            to: getAdminEmail(),
            subject: `[Web Kontakt] ${data.category}: ${data.subject}`,
            text: `Poruka od: ${data.email}\nKategorija: ${data.category}\nPredmet: ${data.subject}\n\nPoruka:\n${data.message}`,
            replyTo: data.email
        };
        const info = isResend ? await sendViaResend(mailData) : await transporter.sendMail(mailData);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function sendPaymentNotificationEmail(data: { email: string, tier: string, note: string }) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const mailData = {
            from: getFromEmail(),
            to: getAdminEmail(),
            subject: `[Članarina Uplata] Od: ${data.email}`,
            text: `Korisnik je prijavio uplatu za članarinu!\n\n` +
                `Email korisnika: ${data.email}\n` +
                `Odabrani Sloj (Tier): ${data.tier.toUpperCase()}\n` +
                `Napomena: ${data.note || 'Nema napomene'}\n\n` +
                `Prijavite se na admin panel (https://www.baljci.org/admin) i provjerite bankovni račun kako biste odobrili pristup (ažurirali Tier).`,
            replyTo: data.email
        };
        const info = isResend ? await sendViaResend(mailData) : await transporter.sendMail(mailData);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function sendApprovalEmail(toEmail: string, name: string) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const mailData = {
            from: `Udruga Baljci <${getFromEmail()}>`,
            to: toEmail,
            subject: 'Vaš zahtjev za članstvo je odobren! / Membership Approved!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #1a1a1a;">Poštovani/a ${name},</h2>
                    <p>Zadovoljstvo nam je obavijestiti vas da je vaš zahtjev za pristup stranici <strong>Udruga Baljci</strong> odobren.</p>
                    <p>Sada se možete prijaviti sa svojim podacima i pristupiti svim arhivama, rodoslovima i galerijama.</p>
                    <p><a href="https://www.baljci.org/login" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Prijavite se ovdje</a></p>
                    <br/>
                    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <h2 style="color: #1a1a1a;">Dear ${name},</h2>
                    <p>We are pleased to inform you that your request for access to the <strong>Udruga Baljci</strong> website has been approved.</p>
                    <p>You can now log in with your credentials and access all archives, genealogies, and galleries.</p>
                    <p><a href="https://www.baljci.org/login" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Log in here</a></p>
                    <br/>
                    <p style="color: #888; font-size: 12px;">Udruga Baljci - info@baljci.org</p>
                </div>
            `
        };
        const info = isResend ? await sendViaResend(mailData) : await transporter.sendMail(mailData);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
