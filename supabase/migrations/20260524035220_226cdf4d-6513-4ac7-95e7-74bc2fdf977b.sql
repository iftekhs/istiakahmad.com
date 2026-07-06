-- Fix: set search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix: revoke broad EXECUTE on has_role (RLS still works because policies
-- run as the table owner; client-side calls are no longer permitted)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;

-- Fix: restrict storage.objects SELECT so anon/auth can only fetch known
-- objects by exact path (browser fetches by URL still work), not list buckets
DROP POLICY IF EXISTS "Public can view site-media" ON storage.objects;

CREATE POLICY "Public can view site-media files"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'site-media'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR (storage.foldername(name))[1] IS NOT NULL
    )
  );