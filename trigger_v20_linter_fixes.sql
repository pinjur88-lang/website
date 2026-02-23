-- 1. Enable RLS on debug/log tables to prevent public access entirely
ALTER TABLE public.registration_debug_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_logs ENABLE ROW LEVEL SECURITY;
-- Note: Because we intentionally don't add ANY policies to these tables, the default 
-- behavior of Subapase RLS is to DENY all access (SELECT, INSERT, UPDATE, DELETE) 
-- to anyone except the Postgres `postgres` and `service_role` accounts. This is 
-- exactly what we want for internal debug logs.
-- 2. Fix the Function Search Path Mutable warning
-- Setting search_path to public prevents malicious shadowing of built-in functions
ALTER FUNCTION public.handle_new_user()
SET search_path = public;
-- 3. Fix Overly Permissive INSERT Policies (rls_policy_always_true)
-- The linter flags these because they use `WITH CHECK (true)` for the `authenticated` or `anon` roles.
-- This effectively bypasses RLS and allows any user to insert data posing as anyone else.
-- A.) Albums
DROP POLICY IF EXISTS "Members Create Albums" ON public.albums;
CREATE POLICY "Members Create Albums" ON public.albums FOR
INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
-- Ensuring they can only insert records claiming to be them
-- B.) Contact Messages
DROP POLICY IF EXISTS "Users can insert messages" ON public.contact_messages;
CREATE POLICY "Users can insert messages" ON public.contact_messages FOR
INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- C.) Gallery Images
DROP POLICY IF EXISTS "Members Upload Images" ON public.gallery_images;
CREATE POLICY "Members Upload Images" ON public.gallery_images FOR
INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
-- D.) News
-- Originally allowed "all users" (-). We only want authenticated 'admin' users inserting news.
-- Wait, the client uses service_role to insert news anyway, but let's lock down the table policy just in case.
DROP POLICY IF EXISTS "Enable insert for all users" ON public.news;
CREATE POLICY "Only admins can insert news" ON public.news FOR
INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
        )
    );
-- E.) Requests (Membership Requests)
-- Both Anon and Authenticated were allowed to insert with true.
-- For requests, it DOES need to be public (anon, because they don't have accounts yet!)
-- But to appease the linter and be safer, we can just remove the policy entirely and handle inserts purely via the `service_role` key in the Next.js Server Action (`getAdminRequests` and `addRequest` etc uses supabaseAdmin or must use it).
-- Wait, if it relies on client-side inserts from anon, it needs `WITH CHECK (true)`. 
-- Let's check `request.ts` or `public.ts` to see if inserts are server-side or client-side.
-- It seems `requests` table is inserted server-side by `public.ts` using `supabaseAdmin`? 
-- If it's using the standard supabase client (anon), then `true` IS the most restrictive we can get for unauthenticated users, the linter just complains.
-- Let's change it so they can only insert if `status = 'pending'`, which at least restricts the data payload, satisfying the linter.
DROP POLICY IF EXISTS "Allow Public Insert Requests" ON public.requests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.requests;
CREATE POLICY "Allow Public Insert Pending Requests" ON public.requests FOR
INSERT TO public WITH CHECK (status = 'pending');