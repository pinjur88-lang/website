-- ==========================================
-- MASTER DIAGNOSTIC (v17): THE DEEP AUDIT
-- ==========================================
-- 1. AUDIT TABLE STRUCTURES (Focus on NOT NULL)
SELECT table_name,
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name IN (
        'profiles',
        'requests',
        'family_members',
        'registration_debug_log'
    )
    AND table_schema = 'public'
ORDER BY table_name,
    ordinal_position;
-- 2. AUDIT TRIGGERS on public tables
SELECT event_object_table as table_name,
    tgname as trigger_name,
    proname as function_name
FROM information_schema.triggers
    JOIN pg_trigger ON tgname = trigger_name
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE event_object_table IN ('profiles', 'requests', 'family_members')
    AND event_object_schema = 'public';
-- 3. SIMULATE FULL REGISTRATION FLOW (with error trapping)
DELETE FROM public.ghost_logs;
DO $$
DECLARE err_msg TEXT;
err_code TEXT;
new_id UUID := gen_random_uuid();
test_email TEXT := 'master_test_' || extract(
    epoch
    from now()
) || '@test.com';
BEGIN -- STEP 1: Attempt Profile Creation
INSERT INTO public.profiles (id, full_name, role)
VALUES (new_id, 'Master Test User', 'pending');
-- STEP 2: Attempt Request Creation
INSERT INTO public.requests (email, name, status)
VALUES (test_email, 'Master Test User', 'pending');
RAISE EXCEPTION 'MASTER_PROBE_SUCCESS';
EXCEPTION
WHEN OTHERS THEN GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT,
err_code = RETURNED_SQLSTATE;
IF err_msg = 'MASTER_PROBE_SUCCESS' THEN
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Full Flow Simulation',
        'SUCCESS',
        'All public tables inserted successfully.'
    );
ELSE
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Full Flow Simulation',
        err_code,
        'FAILED at step: ' || err_msg
    );
END IF;
END $$;
-- 4. DISPLAY RESULTS
SELECT *
FROM public.ghost_logs;