-- ==========================================
-- MEMBERSHIP SYSTEM OVERHAUL
-- ==========================================

-- 1. UPDATE profiles (Legal Fields)
-- Adding columns as per Zakon o udrugama requirements
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS oib text, -- Can be null for foreign members
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS place_of_birth text,
ADD COLUMN IF NOT EXISTS address text, -- Mandatory
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS fathers_name text, -- "Ime Oca" for identity
ADD COLUMN IF NOT EXISTS family_nickname text, -- "Obiteljski Nadimak"
ADD COLUMN IF NOT EXISTS house_number text, -- Link to map
ADD COLUMN IF NOT EXISTS consents jsonb DEFAULT '{"statute": false, "data": false, "marketing": false}'; -- GDPR

-- 2. CREATE family_members (For "Family Bundle")
-- Stores children/spouses who don't have their own login
CREATE TABLE IF NOT EXISTS family_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    head_of_household uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    date_of_birth date NOT NULL,
    oib text,
    relationship text NOT NULL, -- 'child', 'spouse', etc.
    legal_guardian text, -- Auto-filled from Head of Household's name
    created_at timestamptz DEFAULT now()
);

-- 3. CREATE companies (For "Corporate" members)
-- Linking the representative (auth.user) to the company entity
CREATE TABLE IF NOT EXISTS companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    representative_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name text NOT NULL,
    company_oib text NOT NULL, -- MBS
    address text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 4. ENABLE RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES

-- Family Members Scopes
DROP POLICY IF EXISTS "Head of household manages family" ON family_members;
CREATE POLICY "Head of household manages family"
ON family_members FOR ALL
TO authenticated
USING (auth.uid() = head_of_household)
WITH CHECK (auth.uid() = head_of_household);

DROP POLICY IF EXISTS "Admins view all family members" ON family_members;
CREATE POLICY "Admins view all family members"
ON family_members FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
    OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

-- Corporate Scopes
DROP POLICY IF EXISTS "Representative manages company" ON companies;
CREATE POLICY "Representative manages company"
ON companies FOR ALL
TO authenticated
USING (auth.uid() = representative_id)
WITH CHECK (auth.uid() = representative_id);

DROP POLICY IF EXISTS "Admins view all companies" ON companies;
CREATE POLICY "Admins view all companies"
ON companies FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
    OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);
