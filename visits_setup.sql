/**
 * VISITS CALENDAR SETUP
 * Run this in Supabase SQL Editor
 */

-- 1. Create the table
create table if not exists visits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table visits enable row level security;

-- 3. Policies
-- Everyone can view visits
create policy "Members can view visits"
on visits for select
to authenticated
using (true);

-- Users can insert their own visits
create policy "Users can add their own visits"
on visits for insert
to authenticated
with check (auth.uid() = user_id);

-- Users can delete their own visits
create policy "Users can delete their own visits"
on visits for delete
to authenticated
using (auth.uid() = user_id);
