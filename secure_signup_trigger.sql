-- ==========================================
-- SECURE SIGNUP TRIGGER (ULTRA-SAFE VERSION)
-- Handles transactional user creation (Profile + Request)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE meta_full_name text;
meta_oib text;
meta_address text;
meta_phone text;
meta_reg_type text;
meta_fathers_name text;
meta_nickname text;
meta_dob text;
BEGIN -- 1. Extract Metadata Safely
meta_full_name := COALESCE(
  new.raw_user_meta_data->>'full_name',
  new.raw_user_meta_data->>'display_name'
);
meta_oib := new.raw_user_meta_data->>'oib';
meta_address := new.raw_user_meta_data->>'address';
meta_phone := new.raw_user_meta_data->>'phone';
meta_reg_type := new.raw_user_meta_data->>'request_type';
meta_fathers_name := new.raw_user_meta_data->>'fathers_name';
meta_nickname := new.raw_user_meta_data->>'nickname';
meta_dob := new.raw_user_meta_data->>'date_of_birth';
-- 2. Insert into PROFILES
-- IMPORTANT: Removed 'email' column as it often causes 'column does not exist' in profiles
-- Using ON CONFLICT (id) to handle potential orphans
INSERT INTO public.profiles (
    id,
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
    'pending',
    meta_full_name,
    meta_oib,
    meta_address,
    meta_phone,
    meta_fathers_name,
    meta_nickname,
    NULLIF(meta_dob, '')::date
  ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name,
  role = 'pending';
-- 3. Insert into REQUESTS
-- Check if request exists first to avoid unique constraint crashes
IF NOT EXISTS (
  SELECT 1
  FROM public.requests
  WHERE email = new.email
) THEN
INSERT INTO public.requests (
    email,
    name,
    status,
    request_type,
    created_at
  )
VALUES (
    new.email,
    COALESCE(meta_full_name, new.email),
    'pending',
    COALESCE(meta_reg_type, 'individual'),
    now()
  );
END IF;
-- 4. Handle Family Members (if present in metadata)
IF new.raw_user_meta_data->'family_members' IS NOT NULL THEN
INSERT INTO public.family_members (
    head_of_household,
    full_name,
    date_of_birth,
    relationship
  )
SELECT new.id,
  (fm->>'full_name'),
  NULLIF(fm->>'date_of_birth', '')::date,
  (fm->>'relationship')
FROM jsonb_array_elements(new.raw_user_meta_data->'family_members') as fm;
END IF;
-- 5. Handle Company (if present)
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