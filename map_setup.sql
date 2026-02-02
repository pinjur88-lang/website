/**
 * INTERACTIVE VILLAGE MAP SETUP
 * Run this in Supabase SQL Editor
 */

-- 1. Create Map Locations Table
create table if not exists map_locations (
  id uuid default gen_random_uuid() primary key,
  lat double precision not null,
  lng double precision not null,
  title text not null,
  description text,
  image_url text,
  claimed_by uuid references auth.users(id) default null,
  created_at timestamptz default now()
);

-- 2. Enable RLS
alter table map_locations enable row level security;

-- 3. Policies
-- Drop existing policies first to avoid "already exists" errors
drop policy if exists "Members can view map locations" on map_locations;
drop policy if exists "Admins can manage map locations" on map_locations;
drop policy if exists "Users can claim houses" on map_locations;

create policy "Members can view map locations"
on map_locations for select
to authenticated
using (true);

create policy "Admins can manage map locations"
on map_locations for all
to authenticated
using (
  auth.jwt() ->> 'email' = 'udrugabaljci@gmail.com'
);

create policy "Users can claim houses"
on map_locations for update
to authenticated
using (claimed_by is null)
with check (claimed_by = auth.uid());

-- 4. Initial Seed Data (Only insert if table is empty to avoid duplicates)
-- Note: This is a simple check. If you want to force reset data, run: DELETE FROM map_locations; first.
insert into map_locations (lat, lng, title, description, image_url)
select 43.9502, 16.2005, 'Kuća Obitelji Genda', 'Tradicionalna kamena kuća izgrađena 1920-ih.', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
where not exists (select 1 from map_locations limit 1);

insert into map_locations (lat, lng, title, description, image_url)
select 43.9515, 16.1985, 'Stara Mlinica', 'Vodenica koja je nekada služila cijelom selu.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
where not exists (select 1 from map_locations limit 1);

insert into map_locations (lat, lng, title, description, image_url)
select 43.9485, 16.2020, 'Guvno kod Crkve', 'Mjesto okupljanja i vršidbe žita.', 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80'
where not exists (select 1 from map_locations limit 1);
