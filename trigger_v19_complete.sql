-- ==========================================
-- COMPLETE REGISTRATION TRIGGER (v19)
-- ==========================================
-- 1. Ensure the Role Constraint covers all bases
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'member', 'pending', 'user'));
-- 2. THE MASTER TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE _member_json jsonb;
_company_json jsonb;
BEGIN -- A. CREATE PRIMARY PROFILE
-- Mapping fields from SignUp metadata to the Profiles table
INSERT INTO public.profiles (
        id,
        role,
        full_name,
        display_name,
        oib,
        date_of_birth,
        address,
        phone,
        fathers_name,
        family_nickname,
        consents
    )
VALUES (
        new.id,
        'pending',
        COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'),
        COALESCE(
            new.raw_user_meta_data->>'display_name',
            'No Name'
        ),
        new.raw_user_meta_data->>'oib',
        (new.raw_user_meta_data->>'date_of_birth')::date,
        new.raw_user_meta_data->>'address',
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'fathers_name',
        new.raw_user_meta_data->>'nickname',
        -- 'nickname' in UI maps to 'family_nickname'
        '{"statute": true, "data": true, "marketing": false}'::jsonb -- Default consents
    ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name,
    address = EXCLUDED.address;
-- B. CREATE ADMIN REQUEST
-- This ensures the user shows up in the "Pending Approval" dashboard
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
-- C. HANDLE FAMILY MEMBERS (If present)
IF new.raw_user_meta_data ? 'family_members' THEN FOR _member_json IN
SELECT *
FROM jsonb_array_elements(new.raw_user_meta_data->'family_members') LOOP
INSERT INTO public.family_members (
        head_of_household,
        full_name,
        date_of_birth,
        relationship
    )
VALUES (
        new.id,
        _member_json->>'full_name',
        (_member_json->>'date_of_birth')::date,
        _member_json->>'relationship'
    );
END LOOP;
END IF;
-- D. HANDLE CORPORATE DATA (If present)
IF new.raw_user_meta_data ? 'company' THEN _company_json := new.raw_user_meta_data->'company';
INSERT INTO public.companies (
        representative_id,
        company_name,
        company_oib,
        address
    )
VALUES (
        new.id,
        _company_json->>'name',
        _company_json->>'oib',
        _company_json->>'address'
    );
END IF;
INSERT INTO public.registration_debug_log (email, context)
VALUES (new.email, 'Registration Complete v19');
RETURN new;
EXCEPTION
WHEN OTHERS THEN -- Log the failure but don't let the whole system crash if possible
-- However, for auth triggers, returning NULL or raising and exception is standard.
INSERT INTO public.registration_debug_log (email, error_message, context)
VALUES (new.email, SQLERRM, 'FAILED at v19 Trigger');
RAISE EXCEPTION 'REGISTRATION_SYSTEM_ERROR: %',
SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 3. ATTACH
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 4. VERIFY LOGS TABLE EXISTENCE
CREATE TABLE IF NOT EXISTS public.registration_debug_log (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT,
    error_message TEXT,
    context TEXT
);
SELECT 'SUCCESS: System ready for registration.' as status;