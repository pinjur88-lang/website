-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- Enable 'spomenar_uploads' bucket for photo submissions
-- ==========================================

-- 1. Create Bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('spomenar_uploads', 'spomenar_uploads', true) -- Public readable (for preview), upload restricted
on conflict (id) do nothing;

-- 2. Policy: Allow Anyone (Authenticated) to Upload
-- Or maybe even Anon if we want broad access, but Auth is safer.
-- Let's stick to Authenticated users (members/pending).
create policy "Allow Authenticated Uploads"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'spomenar_uploads' );

-- 3. Policy: Allow Public to View (for Admin/Preview)
create policy "Allow Public Viewing"
  on storage.objects for select
  to public
  using ( bucket_id = 'spomenar_uploads' );
