-- ==========================================
-- REGISTRATION CLEANUP & DIAGNOSTIC (v10)
-- ==========================================
-- 1. Identify all current triggers on auth.users
-- (Run this to see if there are conflicting triggers with different names)
SELECT trigger_name,
    event_manipulation,
    event_object_schema,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
    AND event_object_schema = 'auth';
-- 2. WIPE EXISTING (Using CASCADE to be sure)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- If you see other trigger names in step 1, drop them too!
-- DROP TRIGGER IF EXISTS [OTHER_NAME] ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- 3. CREATE DEBUG LOG (Force existence)
CREATE TABLE IF NOT EXISTS public.registration_debug_log (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT,
    error_message TEXT,
    error_state TEXT,
    context TEXT,
    metadata JSONB
);
-- 4. MINIMALIST HYPER-DIAGNOSTIC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE _step text := 'INIT';
BEGIN -- Insert a log entry immediately to show we entered the function
INSERT INTO public.registration_debug_log (email, context)
VALUES (new.email, 'Entered Trigger v10');
BEGIN -- STEP 1: PROFILES
_step := 'STEP1_PROFILES';
INSERT INTO public.profiles (id, role, full_name, display_name)
VALUES (
        new.id,
        'pending',
        COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'),
        COALESCE(
            new.raw_user_meta_data->>'display_name',
            'No Name'
        )
    ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name;
-- STEP 2: REQUESTS
_step := 'STEP2_REQUESTS';
IF NOT EXISTS (
    SELECT 1
    FROM public.requests
    WHERE email = new.email
) THEN
INSERT INTO public.requests (email, name, status)
VALUES (
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        'pending'
    );
END IF;
-- STEP 3: LOG SUCCESS
INSERT INTO public.registration_debug_log (email, context)
VALUES (new.email, 'Success v10');
EXCEPTION
WHEN OTHERS THEN
INSERT INTO public.registration_debug_log (email, error_message, error_state, context)
VALUES (
        new.email,
        SQLERRM,
        SQLSTATE,
        'v10 FAILED at ' || _step
    );
RAISE EXCEPTION 'V10_ERROR at %: %',
_step,
SQLERRM;
END;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 5. RE-ATTACH
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- FINAL CHECK: Output the test row we just added
SELECT *
FROM public.registration_debug_log
ORDER BY created_at DESC
LIMIT 1;