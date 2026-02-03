-- SECURITY HARDENING SCRIPT
-- Run this in your Supabase SQL Editor to tighten security.

-- 1. Tighten donation_reports policies
-- Delete overly permissive policies
DROP POLICY IF EXISTS "Authenticated can upload reports" ON donation_reports;
DROP POLICY IF EXISTS "Authenticated can delete reports" ON donation_reports;
DROP POLICY IF EXISTS "Admins can upload reports" ON donation_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON donation_reports;

-- Create secure admin-only policies
CREATE POLICY "Admins can upload reports"
ON donation_reports FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

CREATE POLICY "Admins can delete reports"
ON donation_reports FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

-- 2. Tighten donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view donations" ON donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON donations;
DROP POLICY IF EXISTS "Members can view own donations" ON donations;
DROP POLICY IF EXISTS "Admins can insert donations" ON donations;

CREATE POLICY "Members can view own donations"
ON donations FOR SELECT
TO authenticated
USING (
  email = auth.jwt() ->> 'email'
  OR 
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

CREATE POLICY "Admins can insert donations"
ON donations FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

-- 3. Secure profiles table (Anti-Privilege Escalation)
-- Ensure users cannot update their own 'role'
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own display_name only" ON profiles;

CREATE POLICY "Users can update own display_name only"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  -- This ensures the role stays the same unless an admin changes it (via dashboard)
  (role = (SELECT role FROM profiles WHERE id = auth.uid()))
  OR 
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ))
  OR auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);
