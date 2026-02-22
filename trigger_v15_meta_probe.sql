-- ==========================================
-- METADATA STRESS TEST (v15)
-- ==========================================
-- 1. CLEAN LOGS
DELETE FROM public.ghost_logs;
-- 2. TRY INSERT WITH FULL UI-STYLE METADATA
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
            {"full_name": "Child 1", "date_of_birth": "2015-05-05", "relationship": "child"},
            {"full_name": "Spouse 1", "date_of_birth": "1992-02-02", "relationship": "spouse"}
        ]
    }'::jsonb;
BEGIN
INSERT INTO auth.users (id, email, raw_user_meta_data, confirmed_at)
VALUES (
        gen_random_uuid(),
        'meta_test_' || extract(
            epoch
            from now()
        ) || '@test.com',
        complex_meta,
        now()
    );
RAISE EXCEPTION 'META_PROBE_SUCCESS';
EXCEPTION
WHEN OTHERS THEN GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT,
err_code = RETURNED_SQLSTATE;
IF err_msg = 'META_PROBE_SUCCESS' THEN
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Complex Metadata Insert',
        'SUCCESS',
        'Insert allowed with full metadata.'
    );
ELSE
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES ('Complex Metadata Insert', err_code, err_msg);
END IF;
END $$;
-- 3. DISPLAY THE FINDINGS
SELECT *
FROM public.ghost_logs;