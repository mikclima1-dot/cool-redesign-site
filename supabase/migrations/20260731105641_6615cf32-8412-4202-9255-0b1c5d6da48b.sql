UPDATE products SET description = btrim(
  regexp_replace(
    regexp_replace(description, '\s*Открийте го в(ъв|в)\s*Vimax(\.bg)?\.?', '', 'gi'),
    '\s*Поръчайте онлайн в(ъф|ъв|в)\s*Vimax(\.bg)?\.?', '', 'gi'
  )
) WHERE description ILIKE '%vimax%';