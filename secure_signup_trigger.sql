-- ==========================================
-- SECURE SIGNUP TRIGGER (ULTRA-ROBUST v7)
-- Includes Debug Logging & Strict Validation
-- ==========================================
-- 0. Create Debug Log Table
CREATE TABLE IF NOT EXISTS public.registration_debug_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  error_message TEXT,
  error_state TEXT,
  context TEXT,
  metadata JSONB
);
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE m_full_name text;
m_display_name text;
m_oib text;
m_address text;
m_phone text;
m_reg_type text;
m_fathers_name text;
m_nickname text;
m_dob text;
BEGIN -- 1. Extract Metadata Safely
m_full_name := COALESCE(
  new.raw_user_meta_data->>'full_name',
  new.raw_user_meta_data->>'display_name'
);
m_display_name := COALESCE(
  new.raw_user_meta_data->>'display_name',
  new.raw_user_meta_data->>'full_name'
);
m_oib := new.raw_user_meta_data->>'oib';
m_address := new.raw_user_meta_data->>'address';
m_phone := new.raw_user_meta_data->>'phone';
m_reg_type := new.raw_user_meta_data->>'request_type';
m_fathers_name := new.raw_user_meta_data->>'fathers_name';
m_nickname := new.raw_user_meta_data->>'nickname';
m_dob := new.raw_user_meta_data->>'date_of_birth';
BEGIN -- 2. Insert into PROFILES
-- Profiles table verified to have 'full_name' but NO 'email'
INSERT INTO public.profiles (
    id,
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
    'pending',
    m_full_name,
    m_display_name,
    m_oib,
    m_address,
    m_phone,
    m_fathers_name,
    m_nickname,
    NULLIF(m_dob, '')::date
  ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name,
  role = 'pending';
-- 3. Insert into REQUESTS
-- Requests table verified to have 'name' AND 'email' (NOT NULL)
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
    COALESCE(m_full_name, new.email),
    'pending',
    COALESCE(m_reg_type, 'individual'),
    now()
  );
END IF;
-- 4. Handle Family Members (Type Guarded & Filtered)
-- Schema requires 'full_name' and 'date_of_birth' to be NOT NULL
IF jsonb_typeof(new.raw_user_meta_data->'family_members') = 'array' THEN
INSERT INTO public.family_members (
    head_of_household,
    full_name,
    date_of_birth,
    relationship
  )
SELECT new.id,
  fm->>'full_name',
  (fm->>'date_of_birth')::date,
  COALESCE(fm->>'relationship', 'child')
FROM jsonb_array_elements(new.raw_user_meta_data->'family_members') as fm
WHERE (fm->>'full_name') IS NOT NULL
  AND (fm->>'full_name') != ''
  AND (fm->>'date_of_birth') IS NOT NULL
  AND (fm->>'date_of_birth') != '';
END IF;
-- 5. Handle Company (Type Guarded & Filtered)
-- Schema requires 'company_name', 'company_oib', 'address' to be NOT NULL
IF jsonb_typeof(new.raw_user_meta_data->'company') = 'object' THEN
INSERT INTO public.companies (
    representative_id,
    company_name,
    company_oib,
    address
  )
SELECT new.id,
  (new.raw_user_meta_data->'company'->>'name'),
  (new.raw_user_meta_data->'company'->>'oib'),
  COALESCE(
    (new.raw_user_meta_data->'company'->>'address'),
    m_address
  )
WHERE (new.raw_user_meta_data->'company'->>'name') IS NOT NULL
  AND (new.raw_user_meta_data->'company'->>'oib') IS NOT NULL;
END IF;
EXCEPTION
WHEN OTHERS THEN -- Persistent Log for Admin Review
INSERT INTO public.registration_debug_log (
    email,
    error_message,
    error_state,
    context,
    metadata
  )
VALUES (
    new.email,
    SQLERRM,
    SQLSTATE,
    'Registration Trigger Failed',
    new.raw_user_meta_data
  );
-- Re-raise to stop the transaction and show error in UI
RAISE EXCEPTION 'Database error saving new user (Trigger v7): %',
SQLERRM;
END;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;