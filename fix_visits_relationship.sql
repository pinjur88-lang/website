-- FIX: Link Visits to Profiles for correct Join
-- The UI tries to fetch visits with user profiles (user:profiles(...))
-- This requires a Foreign Key between visits.user_id and profiles.id

-- 1. Add FK constraint
ALTER TABLE visits
ADD CONSTRAINT visits_user_id_profile_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 2. Grant permissions just in case
GRANT SELECT, INSERT, DELETE ON TABLE visits TO authenticated;
