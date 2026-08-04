import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport(
    process.env.SMTP_HOST 
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

// Helper for the sender email
const getFromEmail = () => process.env.EMAIL_FROM || 'info@baljci.org';
const getAdminEmail = () => 'udrugabaljci@gmail.com';

export async function sendAdminNotification(data: any) {
    if (!getFromEmail()) return;
    return transporter.sendMail({
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
    });
}

export async function sendContactEmail(data: { email: string, category: string, subject: string, message: string }) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const info = await transporter.sendMail({
            from: getFromEmail(),
            to: getAdminEmail(),
            subject: `[Web Kontakt] ${data.category}: ${data.subject}`,
            text: `Poruka od: ${data.email}\nKategorija: ${data.category}\nPredmet: ${data.subject}\n\nPoruka:\n${data.message}`,
            replyTo: data.email
        });
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function sendPaymentNotificationEmail(data: { email: string, tier: string, note: string }) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const info = await transporter.sendMail({
            from: getFromEmail(),
            to: getAdminEmail(),
            subject: `[Članarina Uplata] Od: ${data.email}`,
            text: `Korisnik je prijavio uplatu za članarinu!\n\n` +
                `Email korisnika: ${data.email}\n` +
                `Odabrani Sloj (Tier): ${data.tier.toUpperCase()}\n` +
                `Napomena: ${data.note || 'Nema napomene'}\n\n` +
                `Prijavite se na admin panel (https://www.baljci.com/admin) i provjerite bankovni račun kako biste odobrili pristup (ažurirali Tier).`,
            replyTo: data.email
        });
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function sendApprovalEmail(toEmail: string, name: string) {
    if (!getFromEmail()) return { success: false, error: 'Missing environment variables' };
    try {
        const info = await transporter.sendMail({
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
                    <p style="color: #888; font-size: 12px;">Udruga Baljci - info@baljci.com</p>
                </div>
            `
        });
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
