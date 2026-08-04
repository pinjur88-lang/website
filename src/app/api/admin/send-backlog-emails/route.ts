import { NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/lib/mail';

const MEMBERS = [
  { name: "radivoj basic", email: "radivojradebasic@gmail.com" },
  { name: "Milan Bešević", email: "mbesevic@gmail.com" },
  { name: "Predrag Bibic", email: "pbibic3@gmail.com" },
  { name: "Slavko Josic", email: "slavko79@hotmail.co.uk" },
  { name: "Snežana Bogdanović", email: "snezanabogdanovic1970@gmail.com" },
  { name: "Anica Klisurić", "email": "klisuricanica@gmail.com" },
  { name: "Jelena Jankovic", "email": "j.jecaj@yahoo.com" },
  { name: "Anka Milankovic", "email": "ana_milankovic@hotmail.com" },
  { name: "Zeljko Besevic", "email": "zeljko.besevic@yahoo.de" },
  { name: "Jelena Trzin", "email": "trzin.m@gmail.com" },
  { name: "Goran Milankovic", "email": "levanthg4@gmail.com" },
  { name: "Bojan Kim Un Barac", "email": "bbarac@gmail.com" }
];

export async function GET(request: Request) {
    try {
        const results = [];
        for (const member of MEMBERS) {
            const emailRes = await sendApprovalEmail(member.email, member.name);
            results.push({ name: member.name, email: member.email, status: emailRes });
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return NextResponse.json({ 
            success: true, 
            message: "Emails sent successfully!", 
            results 
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
