-- ==========================================
-- SECURE SIGNUP TRIGGER (NUCLEAR RESET v9)
-- ==========================================
-- 1. FORCE RESET DEBUG TABLE (Clean slate)
DROP TABLE IF EXISTS public.registration_debug_log;
CREATE TABLE public.registration_debug_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  error_message TEXT,
  error_state TEXT,
  context TEXT,
  metadata JSONB
);
-- 2. MANUAL TEST ENTRY (Verify script execution reached here)
INSERT INTO public.registration_debug_log (email, context)
VALUES (
    'system@test.com',
    'v9 Script Loaded Successfully'
  );
-- 3. CREATE HYPER-VIGILANT FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE _step text := 'BOOT';
m_full_name text;
m_display_name text;
m_oib text;
m_address text;
m_phone text;
m_reg_type text;
m_fathers_name text;
m_nickname text;
m_dob text;
BEGIN BEGIN _step := 'METADATA_EXTRACTION';
m_full_name := COALESCE(
  new.raw_user_meta_data->>'full_name',
  new.raw_user_meta_data->>'display_name',
  'Unknown User'
);
m_display_name := COALESCE(
  new.raw_user_meta_data->>'display_name',
  new.raw_user_meta_data->>'full_name',
  'No Name'
);
m_oib := new.raw_user_meta_data->>'oib';
m_address := COALESCE(
  new.raw_user_meta_data->>'address',
  'No Address Provided'
);
m_phone := new.raw_user_meta_data->>'phone';
m_reg_type := COALESCE(
  new.raw_user_meta_data->>'request_type',
  'individual'
);
m_fathers_name := new.raw_user_meta_data->>'fathers_name';
m_nickname := new.raw_user_meta_data->>'nickname';
m_dob := new.raw_user_meta_data->>'date_of_birth';
-- STEP: PROFILES
_step := 'INSERT_PROFILES';
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
    NULLIF(TRIM(m_dob), '')::date
  ) ON CONFLICT (id) DO
UPDATE
SET full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name;
-- STEP: REQUESTS
_step := 'INSERT_REQUESTS';
IF NOT EXISTS (
  SELECT 1
  FROM public.requests
  WHERE email = new.email
) THEN
INSERT INTO public.requests (email, name, status, request_type, created_at)
VALUES (
    new.email,
    m_full_name,
    'pending',
    m_reg_type,
    now()
  );
END IF;
-- STEP: FAMILY
_step := 'INSERT_FAMILY_LOOP';
IF jsonb_typeof(new.raw_user_meta_data->'family_members') = 'array' THEN
INSERT INTO public.family_members (
    head_of_household,
    full_name,
    date_of_birth,
    relationship
  )
SELECT new.id,
  fm->>'full_name',
  NULLIF(TRIM(fm->>'date_of_birth'), '')::date,
  COALESCE(fm->>'relationship', 'child')
FROM jsonb_array_elements(new.raw_user_meta_data->'family_members') as fm
WHERE fm->>'full_name' IS NOT NULL
  AND fm->>'full_name' != ''
  AND fm->>'date_of_birth' IS NOT NULL
  AND fm->>'date_of_birth' != '';
END IF;
-- STEP: COMPANY
_step := 'INSERT_COMPANY_OBJ';
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
WHEN OTHERS THEN -- Fallback logging
BEGIN
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
    'v9 FAIL at: ' || _step,
    new.raw_user_meta_data
  );
EXCEPTION
WHEN OTHERS THEN NULL;
END;
RAISE EXCEPTION 'CRITICAL REG ERROR at %: %',
_step,
SQLERRM;
END;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 4. RE-ATTACH TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();