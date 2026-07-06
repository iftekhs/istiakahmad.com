CREATE TABLE public.discounted_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  banner_url text,
  original_price numeric(12,2) NOT NULL DEFAULT 0,
  discounted_price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  whatsapp_message text,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.discounted_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active deals"
ON public.discounted_deals
FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "Admins can manage deals"
ON public.discounted_deals
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_discounted_deals_updated_at
BEFORE UPDATE ON public.discounted_deals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_discounted_deals_active_sort ON public.discounted_deals (active, sort_order);