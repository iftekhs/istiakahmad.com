
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  category text,
  short_description text,
  long_description text,
  banner_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  youtube_url text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing_mode text NOT NULL DEFAULT 'quote_only',
  price numeric,
  currency text NOT NULL DEFAULT 'USD',
  whatsapp_message text,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_active_sort ON public.products(active, sort_order);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
