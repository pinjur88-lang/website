-- Add is_anonymous column to community_posts
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;
-- Add is_anonymous column to community_comments
ALTER TABLE community_comments
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;
-- Add is_anonymous column to contact_messages
ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;