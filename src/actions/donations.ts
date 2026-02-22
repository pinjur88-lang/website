'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin, verifyUser } from '@/lib/auth-admin';

// 1. GET PROJECTS
export async function getProjects() {
    try {
        const { data, error } = await supabaseAdmin
            .from('projects')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch projects error:", error);
            return { error: error.message };
        }

        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

// 2. GET RECENT DONATIONS (For Ticker)
export async function getDonations(projectId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('donations')
            .select('donor_name, amount, currency, message, created_at')
            .eq('project_id', projectId)
            .eq('is_anonymous', false) // Only public ones
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error("Fetch donations error:", error);
            // Don't break the UI if ticker fails
            return { data: [] };
        }

        return { data };
    } catch (err: any) {
        return { data: [] };
    }
}

// 3. CREATE DONATION
export async function createDonation(donationData: {
    projectId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    message: string;
    isAnonymous: boolean;
    // userId is NO LONGER accepted from client for security
}) {
    try {
        // Validation
        if (!donationData.amount || donationData.amount <= 0) {
            return { error: "Invalid amount" };
        }
        if (!donationData.donorName) {
            return { error: "Name is required" };
        }

        // Resolve User Server-Side
        const user = await verifyUser();
        const userId = user ? user.id : null;

        const { error } = await supabaseAdmin
            .from('donations')
            .insert([{
                project_id: donationData.projectId,
                amount: donationData.amount,
                donor_name: donationData.donorName,
                donor_email: donationData.donorEmail, // Saved privately
                message: donationData.message,
                user_id: userId, // Securely derived
                is_anonymous: donationData.isAnonymous
            }]);

        if (error) {
            console.error("Donation error:", error);
            return { error: error.message };
        }

        revalidatePath('/donate');

        // Return success + isGuest flag to trigger Upsell
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { error: err.message };
    }
}

// 4. GET DONATION REPORTS (Legacy/Admin)
export async function getDonationReports() {
    if (!await verifyAdmin()) return { error: "Unauthorized" };

    try {
        const { data, error } = await supabaseAdmin
            .from('donation_reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

// 5. UPLOAD DONATION REPORT
export async function uploadDonationReport(formData: FormData) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };

    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('file') as File;
        // userId from client is IGNORED directly, we use the session user (who is admin)
        const user = await verifyUser();
        const userId = user?.id;

        if (!file || !title) return { error: "Missing file or title" };

        const fileName = `${Date.now()}_${file.name}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('documents')
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseAdmin.storage.from('documents').getPublicUrl(fileName);
        const fileUrl = publicUrlData.publicUrl;

        const { error: dbError } = await supabaseAdmin
            .from('donation_reports')
            .insert([{
                title,
                description,
                file_url: fileUrl,
                created_by: userId
            }]);

        if (dbError) throw dbError;

        revalidatePath('/dashboard/donations');
        return { success: true };
    } catch (err: any) {
        console.error("Upload error:", err);
        return { error: err.message };
    }
}

// 6. DELETE DONATION REPORT
export async function deleteDonationReport(id: string, fileUrl: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };

    try {
        // Extract filename from URL
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
            await supabaseAdmin.storage.from('documents').remove([fileName]);
        }

        const { error } = await supabaseAdmin
            .from('donation_reports')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/dashboard/donations');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
