'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

import { verifyAdmin } from '@/lib/auth-admin';

// Helper to reliably find a user by email, even if they aren't in the first 50 results
async function getAuthUserByEmail(email: string) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const { data: userData, error } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage: 1000
        });

        if (error) throw error;

        const user = userData.users.find(u => u.email === email);
        if (user) return user;

        if (userData.users.length < 1000) {
            hasMore = false;
        } else {
            page++;
        }
    }

    return null;
}

export async function getUserStatus(email: string) {
    if (!email) return null;
    try {
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('status')
            .eq('email', email)
            .maybeSingle();
        if (error) throw error;
        return data?.status || 'pending';
    } catch {
        return 'pending';
    }
}

// MEMBERSHIP REQUESTS
export async function getAdminRequests() {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { data, error } = await supabaseAdmin
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Simplify Date Mapping
        return {
            data: data.map((item: any) => ({
                ...item,
                date: new Date(item.created_at).toLocaleDateString('hr-HR')
            }))
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
export async function approveRequest(requestId: string, email: string, name: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        // 1. Update Request Status
        const { error: updateError } = await supabaseAdmin
            .from('requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // 2. [NEW] Promote the actual User Profile if it exists
        // In the new Standard Flow, the user likely already created an account with 'pending' role.
        if (email) {
            // Find the user using our reliable paginated helper
            const user = await getAuthUserByEmail(email);

            if (user) {
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({ role: 'member' })
                    .eq('id', user.id);

                if (profileError) {
                    console.error("Failed to promote user profile:", profileError);
                }
            } else {
                console.error("User not found in Auth Admin for email:", email);
            }
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

// FORUM MODERATION
export async function deleteTopic(topicId: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_posts')
            .delete()
            .eq('id', topicId);
        if (error) throw error;
        revalidatePath('/dashboard/community');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteComment(commentId: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_comments')
            .delete()
            .eq('id', commentId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateTopic(topicId: string, content: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_posts')
            .update({ content })
            .eq('id', topicId);
        if (error) throw error;
        revalidatePath(`/dashboard/community/${topicId}`);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateComment(commentId: string, content: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('community_comments')
            .update({ content })
            .eq('id', commentId);
        if (error) throw error;
        // No path to revalidate easily for dynamic comments, client reload handles it
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
// TIER MANAGEMENT
export async function updateMemberTier(email: string, tier: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const user = await getAuthUserByEmail(email);
        if (!user) return { error: "User not found (has not registered yet)" };

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ membership_tier: tier })
            .eq('id', user.id);

        if (profileError) throw profileError;

        // Optionally clear the payment notification now that we assigned a tier
        await supabaseAdmin
            .from('requests')
            .update({ payment_notification: null })
            .eq('email', email);

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
// ADMIN NOTES, DONATIONS & PAYMENTS
export async function notifyAdminPayment(email: string, tier: string, note: string) {
    // A regular user calls this to notify admin they paid
    try {
        const timestamp = new Date().toLocaleString('hr-HR');
        const notification = `[${timestamp}] User declared payment for ${tier.toUpperCase()}: ${note || 'No additional notes'}`;

        const { error } = await supabaseAdmin
            .from('requests')
            .update({ payment_notification: notification })
            .eq('email', email);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function saveAdminNotes(requestId: string, notes: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const { error } = await supabaseAdmin
            .from('requests')
            .update({ admin_notes: notes })
            .eq('id', requestId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function addAdminDonation(requestId: string, amount: number, description: string) {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        // 1. Get current donations
        const { data: request, error: fetchError } = await supabaseAdmin
            .from('requests')
            .select('donations')
            .eq('id', requestId)
            .single();

        if (fetchError) throw fetchError;

        const currentDonations = request.donations || [];
        const newDonation = {
            id: Math.random().toString(36).substring(7),
            request_id: requestId,
            amount,
            description,
            date: new Date().toISOString()
        };

        const updatedDonations = [newDonation, ...currentDonations];

        // 2. Update request
        const { error: updateError } = await supabaseAdmin
            .from('requests')
            .update({ donations: updatedDonations })
            .eq('id', requestId);

        if (updateError) throw updateError;

        return { success: true, data: newDonation };
    } catch (error: any) {
        return { error: error.message };
    }
}

// REGISTRY EXPORT
export async function getAllMembersForRegistry() {
    if (!await verifyAdmin()) return { error: "Unauthorized" };
    try {
        const [profilesRes, familyRes, companiesRes, authUsersRes] = await Promise.all([
            supabaseAdmin.from('profiles').select('*'),
            supabaseAdmin.from('family_members').select('*'),
            supabaseAdmin.from('companies').select('*'),
            supabaseAdmin.auth.admin.listUsers()
        ]);

        if (profilesRes.error) throw profilesRes.error;
        if (familyRes.error) throw familyRes.error;
        if (companiesRes.error) throw companiesRes.error;
        if (authUsersRes.error) throw authUsersRes.error;

        // Create a fast lookup for Auth emails
        const authMap = new Map();
        authUsersRes.data.users.forEach(u => {
            authMap.set(u.id, u.email);
        });

        // Merge emails into profiles
        const enrichedProfiles = profilesRes.data.map(p => ({
            ...p,
            email: authMap.get(p.id) || 'unknown'
        }));

        return {
            data: {
                profiles: enrichedProfiles,
                family: familyRes.data,
                companies: companiesRes.data
            }
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
