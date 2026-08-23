ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;