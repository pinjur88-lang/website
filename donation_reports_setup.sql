/**
 * DONATION REPORTS SETUP
 * Run this in Supabase SQL Editor
 */

-- 1. Create the table
create table if not exists donation_reports (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- 2. Enable RLS
alter table donation_reports enable row level security;

-- 3. Policies
-- Everyone (authenticated) can view
create policy "Members can view reports"
on donation_reports for select
to authenticated
using (true);

-- Authenticated users (we rely on UI hiding for admins) can upload
create policy "Authenticated can upload reports"
on donation_reports for insert
to authenticated
with check (true);

-- Authenticated users can delete
create policy "Authenticated can delete reports"
on donation_reports for delete
to authenticated
using (true);

-- 4. NOTE: You must also create a Storage Bucket named 'documents' in the Supabase Dashboard.
-- Make it a public bucket.
