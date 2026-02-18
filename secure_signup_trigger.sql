-- ==========================================
-- SECURE SIGNUP TRIGGER (MASTER-SAFE v4)
-- Handles transactional user creation (Profile + Request)
-- Adopts pre-existing profiles by email to avoid crashes.
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE meta_full_name text;
meta_display_name text;
meta_oib text;
meta_address text;
meta_phone text;
meta_reg_type text;
meta_fathers_name text;
meta_nickname text;
meta_dob text;
existing_id uuid;
BEGIN -- 1. Extract Metadata Safely
meta_full_name := COALESCE(
  new.raw_user_meta_data->>'full_name',
  new.raw_user_meta_data->>'display_name'
);
meta_display_name := COALESCE(
  new.raw_user_meta_data->>'display_name',
  new.raw_user_meta_data->>'full_name'
);
meta_oib := new.raw_user_meta_data->>'oib';
meta_address := new.raw_user_meta_data->>'address';
meta_phone := new.raw_user_meta_data->>'phone';
meta_reg_type := new.raw_user_meta_data->>'request_type';
meta_fathers_name := new.raw_user_meta_data->>'fathers_name';
meta_nickname := new.raw_user_meta_data->>'nickname';
meta_dob := new.raw_user_meta_data->>'date_of_birth';
-- 2. HANDLE PROFILES (Adopt or Create)
-- Check if a profile already exists for this email (common for manually approved members)
-- We include both columns 'id' and 'email' to satisfy all schema variations.
SELECT id INTO existing_id
FROM public.profiles
WHERE email = new.email
LIMIT 1;
IF existing_id IS NOT NULL THEN -- ADOPT: Update existing record with the new Auth ID and metadata
UPDATE public.profiles
SET id = new.id,
  -- Force sync with Auth ID
  full_name = COALESCE(meta_full_name, full_name),
  display_name = COALESCE(meta_display_name, display_name),
  oib = COALESCE(meta_oib, oib),
  address = COALESCE(meta_address, address),
  phone = COALESCE(meta_phone, phone),
  fathers_name = COALESCE(meta_fathers_name, fathers_name),
  family_nickname = COALESCE(meta_nickname, family_nickname),
  date_of_birth = COALESCE(NULLIF(meta_dob, '')::date, date_of_birth),
  role = 'pending'
WHERE id = existing_id
  OR email = new.email;
ELSE -- CREATE: Normal registration path
INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    display_name,
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
    meta_display_name,
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
END IF;
-- 3. Insert into REQUESTS (Safe Check)
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
-- 4. Handle Family Members
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
-- 5. Handle Company
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