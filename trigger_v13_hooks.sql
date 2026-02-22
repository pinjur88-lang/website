-- ==========================================
-- GHOST HUNTER: HOOKS & BEFORE TRIGGERS (v13)
-- ==========================================
-- 1. Check for ANY trigger that is NOT an "AFTER" trigger
-- (This will find BEFORE or INSTEAD OF triggers)
SELECT tgname,
    proname,
    CASE
        WHEN (tgtype::int & 2) > 0 THEN 'BEFORE'
        ELSE 'AFTER'
    END as timing,
    prosrc as code
FROM pg_trigger
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'auth.users'::regclass
    AND (tgtype::int & 2) > 0;
-- Only BEFORE triggers
-- 2. Check for ANY check constraints that might have custom messages
SELECT conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;
-- 3. Check for any functions in the 'auth' schema
-- (Supabase Auth Hooks often live there)
SELECT n.nspname as schema_name,
    p.proname as function_name,
    p.prosrc as code_snip
FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth'
    AND p.prosrc ILIKE '%save%'
    OR p.prosrc ILIKE '%error%';
-- 4. Check for any 'INSTEAD OF' triggers or Rules
SELECT *
FROM pg_rules
WHERE tablename = 'users'
    AND schemaname = 'auth';
-- 5. THE ULTIMATE PROBE: Try a direct insert into auth.users (Simulation)
-- This will tell us if Postgres allows the insert at all.
DO $$ BEGIN
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
        gen_random_uuid(),
        'diagnostic@test.com',
        '{"full_name": "Diagnostic"}'::jsonb
    );
RAISE NOTICE 'SUCCESS: Direct insert into auth.users works.';
-- We rollback so we don't actually create a junk user
RAISE EXCEPTION 'ROLLBACK_SUCCESS';
EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'FAILURE: Direct insert failed with: % (Code: %)',
SQLERRM,
SQLSTATE;
END $$;