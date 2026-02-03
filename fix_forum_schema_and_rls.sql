-- FIX: Upgrade community_posts schema and Apply RLS

-- 1. Add missing columns if they don't exist
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id),
ADD COLUMN IF NOT EXISTS is_anonymous boolean default false;

-- 2. Ensure RLS is enabled
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 3. Reset Policies
DROP POLICY IF EXISTS "Members can view posts" ON community_posts;
DROP POLICY IF EXISTS "Members can create posts" ON community_posts;
DROP POLICY IF EXISTS "Members can delete own posts" ON community_posts;

-- 4. Create Policies
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
