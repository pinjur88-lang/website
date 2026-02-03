-- ==========================================
-- UNIFIED FIX: Forum & Gallery Visibility
-- ==========================================

-- 1. Fix community_posts schema
-- Add missing columns if they don't exist
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id),
ADD COLUMN IF NOT EXISTS is_anonymous boolean default false;

-- 2. Ensure RLS is enabled for Forum
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 3. Reset & Apply Forum Policies
DROP POLICY IF EXISTS "Members can view posts" ON community_posts;
DROP POLICY IF EXISTS "Members can create posts" ON community_posts;
DROP POLICY IF EXISTS "Members can delete own posts" ON community_posts;

CREATE POLICY "Members can view posts"
ON community_posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Members can create posts"
ON community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can delete own posts"
ON community_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Fix Gallery Storage Visibility
-- Allow public read access to gallery bucket (so images can be seen)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

-- Allow ANY authenticated member to upload to the "gallery" bucket
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'gallery' );

-- Ensure the bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'gallery';
