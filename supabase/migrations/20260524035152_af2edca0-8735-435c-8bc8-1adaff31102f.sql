-- ============================================================
-- ROLES SYSTEM
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- updated_at trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- SITE SETTINGS (single row)
-- ============================================================
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, data) VALUES (1, '{
  "name": "Istiak Ahmad",
  "url": "https://istiakahmad.com",
  "title": "Istiak Ahmad | Product Hunt Launch Expert",
  "description": "I help founders rank Top #1 on Product Hunt. SaaS founder, verified hunter, and launch strategist with 6+ top-ranked launches.",
  "contactEmail": "",
  "links": {
    "gumroad": "https://istiakahmad.gumroad.com/l/PH-launch-success-playbook",
    "upwork": "https://www.upwork.com/freelancers/~01f5ac9cdcaaad7afb",
    "consultation": "https://www.upwork.com/services/product/marketing-istiak-1967903406702102605?ref=project_share",
    "producthunt": "https://www.producthunt.com/@istiakahmad",
    "linkedin": "https://www.linkedin.com/in/istiak-ahmad/",
    "youtube": "https://www.youtube.com/@istiakahmadyoutube",
    "whatsapp": "https://wa.me/447480676782",
    "whatsappChannel": "https://whatsapp.com/channel/0029VbB5eyAGOj9gQgSQGC1F",
    "tidycal": "https://tidycal.com/istiakahmad/consultation",
    "ebookVideo": "https://www.youtube.com/embed/8U_mE4SaiHI",
    "lancepilot": "https://www.producthunt.com/products/lancepilot/launches/lancepilot"
  }
}'::jsonb);

-- ============================================================
-- LAUNCHES
-- ============================================================
CREATE TABLE public.launches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  launch_date text NOT NULL,
  rank text NOT NULL,
  extras text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  href text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.launches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read launches" ON public.launches
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage launches" ON public.launches
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER launches_updated_at
  BEFORE UPDATE ON public.launches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.launches (name, role, launch_date, rank, extras, description, href, featured, sort_order) VALUES
  ('Lancepilot', 'Founder & Maker', 'April 8, 2024', '#1 Product of the Day',
   ARRAY['#2 Week', '#1 Marketing / Week', '#1 Marketing / Month'],
   'WhatsApp marketing software for campaigns, tracking, scheduling & CRM. My own SaaS, launched to the top of Product Hunt.',
   'https://www.producthunt.com/products/lancepilot/launches/lancepilot', true, 10),
  ('Nomie', 'Hunter', 'March 23, 2026', '#5 Product of the Day', ARRAY[]::text[],
   'Hunted and managed launch to a featured Top 5 finish.',
   'https://www.producthunt.com/products/nomie', false, 20),
  ('Simply', 'Hunter', 'March 9, 2026', '#4 Product of the Day', ARRAY[]::text[],
   'End-to-end launch management, secured a Top 5 finish.',
   'https://www.producthunt.com/products/simply-4', false, 30),
  ('ToolSpend', 'Hunter', 'February 16, 2026', '#2 Product of the Day', ARRAY[]::text[],
   'Outreach + launch-day execution to a runner-up finish.',
   'https://www.producthunt.com/products/toolspend', false, 40),
  ('Jector AI', 'Hunter', 'May 27, 2024', '#3 Product of the Day', ARRAY[]::text[],
   'Hunted AI image generator to a podium finish on launch day.',
   'https://www.producthunt.com/products/jector-ai-2/launches/jector-ai', false, 50),
  ('Ginix', 'Hunter', 'June 2, 2024', '#1 Product of the Day', ARRAY[]::text[],
   'Review monitoring platform. Hunted to #1 of the day.',
   'https://www.producthunt.com/products/free-platform-for-monitoring-reviews/launches/ginix', false, 60);

-- ============================================================
-- PAGE CONTENT (one row per page; admin edits JSON)
-- ============================================================
CREATE TABLE public.page_content (
  page_key text PRIMARY KEY,
  label text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read page content" ON public.page_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage page content" ON public.page_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.page_content (page_key, label, content) VALUES
  ('home', 'Home', '{
    "heroBadge": "Verified Product Hunt Hunter",
    "heroTitleStart": "Rank ",
    "heroTitleAccent": "#1",
    "heroTitleEnd": " on Product Hunt.",
    "heroSubtitleStrong": "No guesswork.",
    "heroSubtitleSoft": "Just proven launches.",
    "heroDescription": "I''m Istiak Ahmad, a SaaS founder who launched Lancepilot to #1 of the day, then helped 5+ founders do the same. End-to-end launch strategy, outreach, and execution.",
    "ctaPrimary": "Get the Playbook",
    "ctaSecondary": "Book a Call",
    "stats": [
      {"value": 6, "suffix": "+", "label": "Top-ranked launches"},
      {"value": 2000, "suffix": "+", "label": "Founder network"},
      {"value": 1, "prefix": "#", "label": "Product of the Day"}
    ]
  }'::jsonb),
  ('about', 'About', '{}'::jsonb),
  ('services', 'Services', '{}'::jsonb),
  ('playbook', 'Playbook', '{}'::jsonb),
  ('contact', 'Contact', '{}'::jsonb),
  ('portfolio', 'Portfolio', '{}'::jsonb);

-- ============================================================
-- PAGE SEO (overrides per route)
-- ============================================================
CREATE TABLE public.page_seo (
  page_key text PRIMARY KEY,
  title text,
  description text,
  og_title text,
  og_description text,
  og_image_url text,
  canonical_path text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read page seo" ON public.page_seo
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage page seo" ON public.page_seo
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER page_seo_updated_at
  BEFORE UPDATE ON public.page_seo
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.page_seo (page_key, title, description, og_title, og_description, canonical_path) VALUES
  ('home', 'Istiak Ahmad | Rank #1 on Product Hunt',
   'Proven Product Hunt launch expert. SaaS founder, verified hunter, 6+ Top 5 launches. Get the playbook, book a call, or launch with me.',
   'Istiak Ahmad | Rank #1 on Product Hunt',
   'I help founders launch and rank Top #1 on Product Hunt. Get the playbook or book a 1:1 strategy call.', '/'),
  ('about', 'About | Istiak Ahmad',
   'SaaS founder, verified Product Hunt hunter, and launch strategist behind 6+ top-ranked launches.',
   'About | Istiak Ahmad',
   'My story, philosophy, and how I help founders win on Product Hunt.', '/about'),
  ('services', 'Services | Istiak Ahmad',
   'Launch strategy, hunter services, full launch management, and the PH Launch Success Playbook.',
   'Services | Istiak Ahmad', 'Ways to work with me.', '/services'),
  ('playbook', 'Product Hunt Launch Playbook | Istiak Ahmad',
   'The complete 6-week playbook to rank Top #1 on Product Hunt. Templates, scripts, timelines.',
   'PH Launch Success Playbook', 'The complete 6-week playbook to rank Top #1 on Product Hunt.', '/playbook'),
  ('contact', 'Contact | Istiak Ahmad',
   'Reach out to discuss your Product Hunt launch.',
   'Contact | Istiak Ahmad', 'Reach out about your launch.', '/contact'),
  ('portfolio', 'Launch Portfolio | Istiak Ahmad',
   '6 Product Hunt launches, all ranked Top 5. Lancepilot, Ginix, Jector AI, ToolSpend, Simply, Nomie.',
   'Launch Portfolio | Istiak Ahmad',
   'Every product I''ve hunted has finished Top 5 on Product Hunt.', '/portfolio');

-- ============================================================
-- MEDIA
-- ============================================================
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  alt text,
  size_bytes int,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media" ON public.media
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage media" ON public.media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- ADMIN AUDIT LOG
-- ============================================================
CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit log" ON public.admin_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- STORAGE BUCKET (public read, admin write)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view site-media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media');

CREATE POLICY "Admins can upload site-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site-media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site-media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));