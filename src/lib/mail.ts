import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendAdminNotification(data: any) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Mail environment variables missing.");
        return;
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'udrugabaljci@gmail.com',
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

    return transporter.sendMail(mailOptions);
}

export async function sendContactEmail(data: { email: string, category: string, subject: string, message: string }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Mail environment variables missing.");
        return { success: false, error: "Missing environment variables" };
    }

    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'udrugabaljci@gmail.com',
            subject: `[Web Kontakt] ${data.category}: ${data.subject}`,
            text: `Poruka od: ${data.email}\nKategorija: ${data.category}\nPredmet: ${data.subject}\n\nPoruka:\n${data.message}`,
            replyTo: data.email
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        console.error("Email sending failed:", err);
        return { success: false, error: err.message };
    }
}

export async function sendPaymentNotificationEmail(data: { email: string, tier: string, note: string }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Mail environment variables missing.");
        return { success: false, error: "Missing environment variables" };
    }

    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'udrugabaljci@gmail.com',
            subject: `[Članarina Uplata] Od: ${data.email}`,
            text: `Korisnik je prijavio uplatu za članarinu!\n\n` +
                `Email korisnika: ${data.email}\n` +
                `Odabrani Sloj (Tier): ${data.tier.toUpperCase()}\n` +
                `Napomena: ${data.note || 'Nema napomene'}\n\n` +
                `Prijavite se na admin panel (https://www.baljci.com/admin) i provjerite bankovni račun kako biste odobrili pristup (ažurirali Tier).`,
            replyTo: data.email
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (err: any) {
        console.error("Payment notification email failed:", err);
        return { success: false, error: err.message };
    }
}
