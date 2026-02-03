-- ==========================================
-- VOTING HALL SETUP
-- ==========================================

-- 1. Add membership_tier to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS membership_tier text DEFAULT 'free';

-- 2. Create Polls table
CREATE TABLE IF NOT EXISTS polls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  options text[] NOT NULL, -- Array of strings for choices
  created_at timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id)
);

-- 3. Create Poll Votes table
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id) -- Ensure one vote per user per poll
);

-- 4. Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Polls
DROP POLICY IF EXISTS "Anyone authenticated can view polls" ON polls;
CREATE POLICY "Anyone authenticated can view polls"
ON polls FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage polls" ON polls;
CREATE POLICY "Admins can manage polls"
ON polls FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

-- 6. Policies for Votes
DROP POLICY IF EXISTS "Members can view votes" ON poll_votes;
CREATE POLICY "Members can view votes"
ON poll_votes FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Silver members can vote" ON poll_votes;
CREATE POLICY "Silver members can vote"
ON poll_votes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.membership_tier = 'silver' OR profiles.membership_tier = 'gold' OR profiles.role = 'admin')
  )
);

-- 7. Insert a sample poll
INSERT INTO polls (title, description, options, end_date)
VALUES (
  'Kako utrošiti prikupljena sredstva?',
  'Sakupili smo 2.000 €. Koji projekt bi trebao biti prioritet?',
  ARRAY['Čišćenje puta do crkve', 'Popravak zida oko groblja', 'Nova ulična rasvjeta u Gornjim Baljcima'],
  now() + interval '30 days'
);
