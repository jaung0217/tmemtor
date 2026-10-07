-- 009_media_storage.sql
-- Storage bucket + RLS for `media` (SPEC 7, 19장 Media/Storage).
--
-- 006_media.sql only added RLS for the `public.media` metadata table, but
-- never provisioned the actual Supabase Storage bucket or its
-- `storage.objects` policies. Found by manual QA: with RLS enabled and zero
-- policies on `storage.objects`, uploads/deletes were rejected for every
-- role (including `authenticated` admins), and `getPublicUrl()`
-- (src/actions/media.ts) only serves content when the bucket itself is
-- public, so this migration creates the bucket (idempotent) and makes it
-- public-read while keeping writes admin-only.
--
-- Public(anon) can read objects in this bucket (needed so Public pages can
-- display post thumbnails / site logo / etc. via the stored public URL).
-- Public(anon) cannot list/insert/update/delete -- those require
-- `authenticated`, matching the `media` table's admin-only RLS.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "media_bucket_admin_write" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "media_bucket_admin_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "media_bucket_admin_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');

create policy "media_bucket_admin_select" on storage.objects
  for select
  to authenticated
  using (bucket_id = 'media');
