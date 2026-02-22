-- ==========================================
-- GHOST TRIGGER HUNTER
-- ==========================================
-- 1. Find EVERY trigger on auth.users and the EXACT function it calls
SELECT tgname AS trigger_name,
    proname AS function_name,
    nspname AS schema_name,
    prosrc AS function_code
FROM pg_trigger
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
WHERE tgrelid = 'auth.users'::regclass;
-- 2. Check for any other versions of handle_new_user
SELECT n.nspname as schema_name,
    p.proname as function_name
FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user';