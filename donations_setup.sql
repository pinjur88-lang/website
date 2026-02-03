-- ==========================================
-- DONATION & CROWDFUNDING SETUP
-- ==========================================

-- 1. Create PROJECTS table (Campaigns)
CREATE TABLE IF NOT EXISTS projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    goal_amount decimal NOT NULL DEFAULT 0,
    current_amount decimal NOT NULL DEFAULT 0,
    image_url text, -- Can be a storage path or full URL
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at timestamptz DEFAULT now()
);

-- 2. Create DONATIONS table (The Transactions)
CREATE TABLE IF NOT EXISTS donations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    amount decimal NOT NULL,
    currency text DEFAULT 'EUR',
    donor_name text NOT NULL, -- "Guests" type this in manually
    donor_email text,         -- Important for receipt/upsell
    message text,             -- "In Memory Of..."
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id), -- NULLABLE (Crucial for Guests)
    is_anonymous boolean DEFAULT false
);

-- 3. ENABLE RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES

-- PROJECTS: Public Read, Admin Write
DROP POLICY IF EXISTS "Public view projects" ON projects;
CREATE POLICY "Public view projects"
ON projects FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins manage projects" ON projects;
CREATE POLICY "Admins manage projects"
ON projects FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
    OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

-- DONATIONS: Public Read (Wall of Thanks), Public Insert (Guest Checkout)
-- Note: We allow INSERT from 'anon' (unauthenticated) role for guests.

DROP POLICY IF EXISTS "Public view non-anonymous donations" ON donations;
CREATE POLICY "Public view non-anonymous donations"
ON donations FOR SELECT
USING (is_anonymous = false);

-- Important: Guests need to INSERT.
-- If Supabase 'anon' key is used, we need this policy for public.
DROP POLICY IF EXISTS "Everyone can donate" ON donations;
CREATE POLICY "Everyone can donate"
ON donations FOR INSERT
WITH CHECK (true);

-- 5. TRIGGER: Auto-update Project Current Amount
CREATE OR REPLACE FUNCTION update_project_amount()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_donation_added ON donations;
CREATE TRIGGER on_donation_added
AFTER INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION update_project_amount();

-- 6. INSERT SEED DATA (Example Project)
INSERT INTO projects (title, description, goal_amount, current_amount, status)
VALUES (
    'Obnova Kamenog Puta do Crkve',
    'Prikupljamo sredstva za sanaciju starog puta. Svaki kamen je dio naše povijesti.',
    5000,
    1200, -- Simulated initial amount
    'active'
);
