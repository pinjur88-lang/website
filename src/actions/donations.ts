'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function uploadDonationReport(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !title) return { error: "Missing required fields" };

    try {
        // 1. Upload File
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // 3. Insert into Database
        const { error: dbError } = await supabase
            .from('donation_reports')
            .insert({
                title,
                description,
                file_url: publicUrl,
                created_by: userId
            });

        if (dbError) throw dbError;

        revalidatePath('/dashboard/donations');
        return { success: true };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { error: error.message };
    }
}

export async function getDonationReports() {
    try {
        const { data, error } = await supabase
            .from('donation_reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteDonationReport(id: string, fileUrl: string) {
    try {
        // 1. Delete from DB
        const { error: dbError } = await supabase
            .from('donation_reports')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        // 2. Delete from Storage (Optional but good for cleanup)
        // Extract filename from URL
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
            await supabase.storage
                .from('documents')
                .remove([fileName]);
        }

        revalidatePath('/dashboard/donations');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
