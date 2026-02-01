-- Allow public read access to gallery bucket (so images can be seen)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'gallery' );

-- Allow ANY authenticated member to upload to the "gallery" bucket
create policy "Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'gallery' );

-- Update the bucket to be public just in case
update storage.buckets
set public = true
where id = 'gallery';
