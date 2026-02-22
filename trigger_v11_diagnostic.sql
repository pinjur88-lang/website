-- ==========================================
-- REGISTRATION NUCLEAR DIAGNOSTIC (v11)
-- ==========================================
-- 1. Identify current trigger state (Diagnostic)
SELECT tgname AS trigger_name,
    proname AS function_name,
    prosrc AS function_code
FROM pg_trigger
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'auth.users'::regclass;
-- 2. FORCE REPLACEMENT WITH NUCLEAR EXCEPTION
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN -- Raise an exception immediately at the very first line.
    -- This will prove 100% if this function is being called.
    RAISE EXCEPTION 'V11_NUCLEAR_DIAGNOSTIC_HIT: Trigger reached! Your DB is working.';
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 3. ENSURE ATTACHMENT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- FINAL CHECK: If registration still says "Database error saving new user" 
-- after this, then the error is NOT coming from this trigger!