
-- Restrict media table SELECT to admins only (was: public read exposed uploaded_by UUIDs)
DROP POLICY IF EXISTS "Public can read media" ON public.media;
CREATE POLICY "Admins can read media"
  ON public.media
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Restrict page_seo SELECT to admins only (was: public read)
DROP POLICY IF EXISTS "Public can read page seo" ON public.page_seo;
CREATE POLICY "Admins can read page seo"
  ON public.page_seo
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
