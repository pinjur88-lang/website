/**
 * MEMORIAL ARCHIVE SETUP (MULTI-LANGUAGE)
 * Run this in Supabase SQL Editor
 */

-- 1. Create Clans Table with Multi-Language Support
-- Note: If table exists, we are altering it. For setup simplicity, we drop and recreate.
drop table if exists clans cascade;

create table clans (
  id uuid default gen_random_uuid() primary key,
  surname text not null unique,
  
  -- CROATIAN (Default)
  prevalence_hr text, 
  world_distribution_hr text, 
  description_hr text, 

  -- ENGLISH
  prevalence_en text, 
  world_distribution_en text, 
  description_en text,

  -- GERMAN
  prevalence_de text, 
  world_distribution_de text, 
  description_de text,

  coat_of_arms_url text,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table clans enable row level security;

-- 3. Policies
drop policy if exists "Members can view clans" on clans;
drop policy if exists "Admins can manage clans" on clans;

create policy "Members can view clans"
on clans for select
to authenticated
using (true);

create policy "Admins can manage clans"
on clans for all
to authenticated
using (
  auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);
