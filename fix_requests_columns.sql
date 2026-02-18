-- Add CRM columns to requests table
-- Run this in your Supabase SQL Editor to fix the "column requests.donations does not exist" error.
ALTER TABLE requests
ADD COLUMN IF NOT EXISTS admin_notes text,
    ADD COLUMN IF NOT EXISTS donations jsonb DEFAULT '[]';
-- Comment: This enables admins to record manual donations and member notes directly in the admin panel.