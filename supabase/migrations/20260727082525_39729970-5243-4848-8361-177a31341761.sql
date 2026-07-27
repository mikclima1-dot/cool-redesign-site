CREATE OR REPLACE FUNCTION public.normalize_dashes(data jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN data IS NULL THEN NULL
    WHEN jsonb_typeof(data) = 'object' THEN COALESCE(
      (SELECT jsonb_object_agg(key, public.normalize_dashes(value)) FROM jsonb_each(data)),
      '{}'
    )
    WHEN jsonb_typeof(data) = 'array' THEN COALESCE(
      (SELECT jsonb_agg(public.normalize_dashes(value)) FROM jsonb_array_elements(data)),
      '[]'
    )
    WHEN jsonb_typeof(data) = 'string' THEN to_jsonb(replace(replace(data #>> '{}', '—', '-'), '–', '-'))
    ELSE data
  END;
$$;

UPDATE public.products
SET
  title = replace(replace(title, '—', '-'), '–', '-'),
  description = replace(replace(description, '—', '-'), '–', '-'),
  specs = CASE
    WHEN specs IS NOT NULL THEN public.normalize_dashes(specs)
    ELSE specs
  END
WHERE title ~ '[—–]' OR description ~ '[—–]' OR specs::text ~ '[—–]';

DROP FUNCTION IF EXISTS public.normalize_dashes(jsonb);