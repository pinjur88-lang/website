-- Create People Table
create table if not exists people (
  id uuid primary key default gen_random_uuid(), -- We might want to use the CSV ID if it's stable, but CSV uses string IDs (e.g. "p1"). Let's use text for ID to match CSV or stick to UUID and map it. 
  -- The CSV ids are like 'p1', 'p2'. It's better to keep them to preserve relationships easily without complex mapping.
  -- So let's change id to text or keep uuid and have a separate `original_id` column. 
  -- Actually, using text for ID is fine for this specific dataset.
  original_id text not null unique, 
  name text not null,
  surname text not null,
  birth_year text, -- CSV has years as strings sometimes (e.g. "c. 1850"?), let's check. If strictly numbers, integer is better.
  death_year text,
  sex text,
  father_id text references people(original_id), -- Self-reference
  mother_id text references people(original_id),
  father_name text, -- For ghost nodes/unlinked parents
  mother_name text,
  origin text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for searching and graph traversal
create index if not exists people_surname_idx on people(surname);
create index if not exists people_father_id_idx on people(father_id);
create index if not exists people_mother_id_idx on people(mother_id);
create index if not exists people_origin_idx on people(origin);

-- Enable RLS (read-only for public, restricted write)
alter table people enable row level security;

create policy "Enable read access for all users"
on people for select
to public
using (true);

-- Only service role can insert/update/delete (implicit if no other policy exists, but good to be explicit or just leave as is for "no public write")
