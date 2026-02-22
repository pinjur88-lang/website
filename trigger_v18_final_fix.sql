-- ==========================================
-- FINAL FIX: THE SMOKING GUN (v18)
-- ==========================================
-- 1. FIX THE ROLE CONSTRAINT
-- We need to ensure 'pending' is allowed in the profiles table.
DO $$ BEGIN -- Drop the old constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- Re-add it with 'pending' included
-- Based on the error, it was likely missing 'pending'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'member', 'pending', 'user'));
END $$;
-- 2. RE-INSTALL STABLE TRIGGER (handle_new_user)
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN -- Insert into profiles
INSERT INTO public.profiles (id, full_name, display_name, role)
VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'),
        COALESCE(
            new.raw_user_meta_data->>'display_name',
            'No Name'
        ),
        'pending'
    ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name;
-- Insert into requests (if not already there)
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
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 3. FINAL PROBE: TEST THE WHOLE STACK
DELETE FROM public.ghost_logs;
DO $$
DECLARE err_msg TEXT;
err_code TEXT;
new_id UUID := gen_random_uuid();
BEGIN -- This should now SUCCEED because constraint is fixed
INSERT INTO public.profiles (id, full_name, role)
VALUES (new_id, 'Final Test User', 'pending');
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES (
        'Final Constraint Check',
        'SUCCESS',
        'Role "pending" is now ACCEPTED!'
    );
EXCEPTION
WHEN OTHERS THEN GET STACKED DIAGNOSTICS err_msg = MESSAGE_TEXT,
err_code = RETURNED_SQLSTATE;
INSERT INTO public.ghost_logs (test_name, result_code, result_message)
VALUES ('Final Constraint Check', err_code, err_msg);
END $$;
-- 4. DISPLAY SUCCESS
SELECT *
FROM public.ghost_logs;