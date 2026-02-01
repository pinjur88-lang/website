/**
 * FORUM UPDATE SETUP
 * Run this in Supabase SQL Editor
 */

-- 1. Create Comments table
create table if not exists community_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table community_comments enable row level security;

-- 3. Policies
create policy "Members can view comments"
on community_comments for select
to authenticated
using (true);

create policy "Members can add comments"
on community_comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Members can delete own comments"
on community_comments for delete
to authenticated
using (auth.uid() = user_id);
