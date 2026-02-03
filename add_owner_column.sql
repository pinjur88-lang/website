-- Add owner_name column to map_locations
ALTER TABLE map_locations ADD COLUMN IF NOT EXISTS owner_name TEXT;

-- Policy to allow admins to update map_locations
-- (Assuming we had a policy, but let's make sure 'public' can read and only 'admin' can update)
-- First, enable RLS if not enabled
ALTER TABLE map_locations ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on map_locations"
ON map_locations FOR SELECT
USING (true);

-- Allow update access to admins only
-- Note: We check if the user is the admin email
CREATE POLICY "Allow admin update on map_locations"
ON map_locations FOR UPDATE
USING (auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com');

-- (Optional) If you want to use the simpler 'service_role' or check profiles table, 
-- but checking the specific email is the most robust simple way given our current auth setup.
