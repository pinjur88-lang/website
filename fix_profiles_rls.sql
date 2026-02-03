-- FIX: Ensure Profiles are readable by everyone (authenticated)
-- This is necessary for the Visitor Calendar and Forum to show author names.

-- 1. Check/Add SELECT policy for profiles
-- (Safe to run multiple times, we'll drop if exists first to be sure)

DROP POLICY IF EXISTS "Public profiles are viewable by members" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Public profiles are viewable by members"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- 2. Ensure Visits are insertable (Double check)
-- This was already in visits_setup.sql but let's re-affirm.
DROP POLICY IF EXISTS "Users can add their own visits" ON visits;
CREATE POLICY "Users can add their own visits"
ON visits FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Ensure Visits are viewable
DROP POLICY IF EXISTS "Members can view visits" ON visits;
CREATE POLICY "Members can view visits"
ON visits FOR SELECT
TO authenticated
USING (true);
