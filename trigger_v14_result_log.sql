-- ==========================================
-- THE SILENCE BREAKER: LOGGING THE GHOST (v14)
-- ==========================================
-- 1. Create a table to store our findings
CREATE TABLE IF NOT EXISTS public.ghost_logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    test_name TEXT,
    result_code TEXT,
    result_message TEXT
);
-- 2. RUN THE PROBE AND LOG IT
DO $$
DECLARE err_msg TEXT;
err_code TEXT;
BEGIN -- Attempt a direct insert to see what bites
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
        gen_random_uuid(),
        'ghost_hunter_' || extract(
            epoch
            from now()
        ) || '@test.com',
        '{"full_name": "Ghost Test"}'::jsonb
    );
-- If we reach here, the insert worked! We rollback to keep the DB clean.
RAISE EXCEPTION 'TEST_SUCCESS_REACHED_TRIGGER';
EXCEPTION
WHEN OTHERS THEN GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT,
err_code = RETURNED_SQLSTATE;
IF err_msg = 'TEST_SUCCESS_REACHED_TRIGGER' THEN -- Success path
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Direct Insert to auth.users',
        'SUCCESS',
        'Insert allowed - Trigger should have hit.'
    );
ELSE -- Failure path: This is where the REAL error is captured
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES ('Direct Insert to auth.users', err_code, err_msg);
END IF;
END $$;
-- 3. DISPLAY THE FINDINGS
SELECT *
FROM public.ghost_logs
ORDER BY created_at DESC
LIMIT 5;