-- Allow anon users to insert into requests
create policy "Allow Public Insert Requests"
on requests for insert
to anon
with check (true);

-- Ensure RLS is enabled
alter table requests enable row level security;
