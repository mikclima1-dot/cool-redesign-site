CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  brand text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  btu integer,
  image_url text NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  original_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX products_brand_idx ON public.products (brand);
CREATE INDEX products_slug_idx ON public.products (slug);