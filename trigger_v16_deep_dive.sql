-- ==========================================
-- DEEP DIVE: auth.users STRUCTURE (v16)
-- ==========================================
-- 1. INSPECT ALL COLUMNS of auth.users
-- (Look for NOT NULL columns without defaults)
SELECT column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
    AND table_name = 'users'
ORDER BY ordinal_position;
-- 2. INSPECT ALL CONSTRAINTS on auth.users
SELECT conname as constraint_name,
    contype as type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;
-- 3. INSPECT ALL TRIGGERS (including BEFORE)
SELECT tgname as trigger_name,
    CASE
        WHEN (tgtype::int & 2) > 0 THEN 'BEFORE'
        ELSE 'AFTER'
    END as timing,
    proname as function_name
FROM pg_trigger
    JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'auth.users'::regclass
    AND tgname NOT LIKE 'RI_%';
-- 4. FIXED METADATA PROBE (No confirmed_at)
DELETE FROM public.ghost_logs;
DO $$
DECLARE err_msg TEXT;
err_code TEXT;
complex_meta JSONB := '{
        "display_name": "Test User",
        "full_name": "Test User",
        "oib": "12345678901",
        "address": "Test Street 123",
        "phone": "+3851234567",
        "fathers_name": "Test Father",
        "nickname": "Tester",
        "date_of_birth": "1990-01-01",
        "request_type": "family",
        "family_members": [
            {"full_name": "Child 1", "date_of_birth": "2015-05-05", "relationship": "child"}
        ]
    }'::jsonb;
BEGIN
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
        gen_random_uuid(),
        'deep_dive_' || extract(
            epoch
            from now()
        ) || '@test.com',
        complex_meta
    );
RAISE EXCEPTION 'DEEP_DIVE_SUCCESS';
EXCEPTION
WHEN OTHERS THEN GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT,
err_code = RETURNED_SQLSTATE;
IF err_msg = 'DEEP_DIVE_SUCCESS' THEN
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Deep Dive Probe',
        'SUCCESS',
        'Insert allowed - Trigger should have hit.'
    );
ELSE
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES ('Deep Dive Probe', err_code, err_msg);
END IF;
END $$;
-- 5. FINAL RESULTS
SELECT *
FROM public.ghost_logs;