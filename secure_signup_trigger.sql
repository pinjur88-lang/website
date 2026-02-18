-- ==========================================
-- SECURE SIGNUP TRIGGER
-- Handles transactional user creation (Profile + Request)
-- Works even if Email Verification is enabled (Auth flows)
-- ==========================================
-- 1. Ensure 'requests' table has all needed columns (Schema Fix)
-- We align 'profiles' (full_name) and 'requests' (name) usage
ALTER TABLE public.requests
ADD COLUMN IF NOT EXISTS request_type text DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS full_name text;
-- Alias for name if needed, or we just map it
-- 2. The Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE meta_full_name text;
meta_oib text;
meta_address text;
meta_phone text;
meta_reg_type text;
meta_fathers_name text;
meta_nickname text;
meta_dob text;
BEGIN -- Extract Metadata
meta_full_name := new.raw_user_meta_data->>'display_name';
if meta_full_name is null then meta_full_name := new.raw_user_meta_data->>'full_name';
end if;
meta_oib := new.raw_user_meta_data->>'oib';
meta_address := new.raw_user_meta_data->>'address';
meta_phone := new.raw_user_meta_data->>'phone';
meta_reg_type := new.raw_user_meta_data->>'request_type';
meta_fathers_name := new.raw_user_meta_data->>'fathers_name';
meta_nickname := new.raw_user_meta_data->>'nickname';
meta_dob := new.raw_user_meta_data->>'date_of_birth';
-- A. Insert into PROFILES
INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    oib,
    address,
    phone,
    fathers_name,
    family_nickname,
    date_of_birth
  )
VALUES (
    new.id,
    new.email,
    'pending',
    meta_full_name,
    meta_oib,
    meta_address,
    meta_phone,
    meta_fathers_name,
    meta_nickname,
    meta_dob::date
  ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name,
  role = 'pending';
-- Reset role if they try to re-register? Maybe safer to keep existing.
-- B. Insert into REQUESTS (Atomic Request Creation)
INSERT INTO public.requests (
    email,
    name,
    -- DB uses 'name'
    status,
    request_type,
    created_at
  )
VALUES (
    new.email,
    COALESCE(meta_full_name, new.email),
    -- Fallback
    'pending',
    COALESCE(meta_reg_type, 'individual'),
    now()
  );
-- C. Handle Family Members (if present in metadata)
IF new.raw_user_meta_data->'family_members' IS NOT NULL THEN
INSERT INTO public.family_members (
    head_of_household,
    full_name,
    date_of_birth,
    relationship
  )
SELECT new.id,
  (fm->>'full_name'),
  (fm->>'date_of_birth')::date,
  (fm->>'relationship')
FROM jsonb_array_elements(new.raw_user_meta_data->'family_members') as fm;
END IF;
-- D. Handle Company (if present)
IF new.raw_user_meta_data->'company' IS NOT NULL THEN
INSERT INTO public.companies (
    representative_id,
    company_name,
    company_oib,
    address
  )
SELECT new.id,
  (new.raw_user_meta_data->'company'->>'name'),
  (new.raw_user_meta_data->'company'->>'oib'),
  (new.raw_user_meta_data->'company'->>'address');
END IF;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 3. Re-Create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 4. Permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.requests TO service_role;