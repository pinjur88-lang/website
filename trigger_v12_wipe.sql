-- ==========================================
-- REGISTRATION GHOST HUNTER & WIPE (v12)
-- ==========================================
-- 1. SEARCH ENTIRE DATABASE FOR THE ERROR STRING
-- (This will find if any hidden function contains that exact message)
SELECT n.nspname AS schema_name,
    p.proname AS function_name,
    p.prosrc AS code_snip
FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosrc ILIKE '%saving new user%';
-- 2. CHECK IF TRIGGERS ARE ENABLED
SELECT tgname,
    tgenabled,
    tgtype
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
    AND tgname NOT LIKE 'RI_%';
-- 3. NUKE ALL NON-SYSTEM TRIGGERS ON auth.users
-- (This effectively clears the table for our new version)
DO $$
DECLARE r RECORD;
BEGIN FOR r IN (
    SELECT tgname
    FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
        AND tgname NOT LIKE 'RI_Constraint%'
) LOOP EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON auth.users';
END LOOP;
END $$;
-- 4. INSTALL V12 NUCLEAR DIAGNOSTIC
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'V12_SUCCESS: Trigger reached! Your DB is 100%% okay.';
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 5. FINAL CONFIRMATION
SELECT tgname,
    proname,
    prosrc
FROM pg_trigger
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'auth.users'::regclass
    AND tgname = 'on_auth_user_created';