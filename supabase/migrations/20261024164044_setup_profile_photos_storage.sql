
-- Create a public bucket for profile photos.
-- Public access permits image retrieval; write operations remain protected by RLS.
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Object naming convention:
-- profile-photos/{authenticated-user-id}/{filename}

-- Allow users to upload only into their own folder.
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Allow users to replace or update objects in their own folder.
CREATE POLICY "Users can update their own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Allow users to delete objects in their own folder.
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Allow authenticated users to list objects in their own folder.
CREATE POLICY "Users can list their own profile photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);
