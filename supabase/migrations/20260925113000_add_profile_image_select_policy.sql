create policy "Users can read their own profile image metadata"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-images'
  and owner_id = (select auth.uid()::text)
);
