-- =================================================================
-- FIX DATABASE LINTS
-- Run this script in Supabase SQL Editor to resolve linter warnings.
-- =================================================================
-- 1. FIX RLS ENABLED WITH NO POLICY (ghost_logs, registration_debug_log)
-- These tables are likely internal, but to silence warnings we explicitly
-- allow the service_role (backend) to access them, or admin users.
-- ghost_logs
ALTER TABLE IF EXISTS public.ghost_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role full access" ON public.ghost_logs;
CREATE POLICY "Allow service_role full access" ON public.ghost_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
-- registration_debug_log
ALTER TABLE IF EXISTS public.registration_debug_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service_role full access" ON public.registration_debug_log;
CREATE POLICY "Allow service_role full access" ON public.registration_debug_log FOR ALL TO service_role USING (true) WITH CHECK (true);
-- 2. ADD MISSING FOREIGN KEY INDEXES
-- Supabase warns if FKs don't have indexes, which can hurt performance on cascading deletes or joins.
-- family_members
CREATE INDEX IF NOT EXISTS idx_family_members_head ON public.family_members(head_of_household);
-- companies
CREATE INDEX IF NOT EXISTS idx_companies_representative ON public.companies(representative_id);
-- donations
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON public.donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
-- requests (if table exists)
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
-- 3. OPTIMIZE RLS POLICIES (auth.uid() -> (select auth.uid()))
-- This prevents Postgres from executing the function for every row in some plans.
-- Family Members
DROP POLICY IF EXISTS "Head of household manages family" ON public.family_members;
CREATE POLICY "Head of household manages family" ON public.family_members FOR ALL TO authenticated USING (
    (
        select auth.uid()
    ) = head_of_household
) WITH CHECK (
    (
        select auth.uid()
    ) = head_of_household
);
DROP POLICY IF EXISTS "Admins view all family members" ON public.family_members;
CREATE POLICY "Admins view all family members" ON public.family_members FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = (
                    select auth.uid()
                )
                AND role = 'admin'
        )
        OR (
            select auth.jwt()->>'email'
        ) = 'udrugabaljci@gmail.com'
    );
-- Companies
DROP POLICY IF EXISTS "Representative manages company" ON public.companies;
CREATE POLICY "Representative manages company" ON public.companies FOR ALL TO authenticated USING (
    (
        select auth.uid()
    ) = representative_id
) WITH CHECK (
    (
        select auth.uid()
    ) = representative_id
);
DROP POLICY IF EXISTS "Admins view all companies" ON public.companies;
CREATE POLICY "Admins view all companies" ON public.companies FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = (
                    select auth.uid()
                )
                AND role = 'admin'
        )
        OR (
            select auth.jwt()->>'email'
        ) = 'udrugabaljci@gmail.com'
    );
-- Projects
DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = (
                select auth.uid()
            )
            AND role = 'admin'
    )
    OR (
        select auth.jwt()->>'email'
    ) = 'udrugabaljci@gmail.com'
);
-- Community Posts/Comments (Assuming they exist from previous context)
-- We should also ensure is_anonymous allows viewing
-- (This part assumes standard policies exist, if not, this might fail if tables overlap, 
-- but DROP IF EXISTS is safe).