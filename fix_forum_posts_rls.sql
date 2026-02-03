-- FIX: Ensure Forum Posts are writable by members
-- The previous setup might have missed policies for the main 'community_posts' table.

-- 1. Ensure RLS is enabled
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 2. Allow Viewing (Select)
DROP POLICY IF EXISTS "Members can view posts" ON community_posts;
CREATE POLICY "Members can view posts"
ON community_posts FOR SELECT
TO authenticated
USING (true);

-- 3. Allow Posting (Insert)
DROP POLICY IF EXISTS "Members can create posts" ON community_posts;
CREATE POLICY "Members can create posts"
ON community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Allow Author Delete
DROP POLICY IF EXISTS "Members can delete own posts" ON community_posts;
CREATE POLICY "Members can delete own posts"
ON community_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
