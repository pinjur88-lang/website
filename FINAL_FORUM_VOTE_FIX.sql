-- 1. Standardize community_posts
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id);
-- 2. Standardize community_comments
ALTER TABLE community_comments
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id);
-- Ensure user_id also exists (backup)
ALTER TABLE community_comments
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
-- 3. Update existing records if any have null author_id but valid user_id
UPDATE community_posts
SET author_id = user_id
WHERE author_id IS NULL;
UPDATE community_comments
SET author_id = user_id
WHERE author_id IS NULL;
-- 4. Clear Polls as requested
DELETE FROM poll_votes;
DELETE FROM polls;
-- 5. Ensure RLS for comments allows admin to delete everything
DROP POLICY IF EXISTS "Admins can delete any comment" ON community_comments;
CREATE POLICY "Admins can delete any comment" ON community_comments FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'udrugabaljci@gmail.com'
);
-- Same for posts
DROP POLICY IF EXISTS "Admins can delete any post" ON community_posts;
CREATE POLICY "Admins can delete any post" ON community_posts FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
    )
    OR auth.jwt()->>'email' = 'udrugabaljci@gmail.com'
);