-- 001_languages.sql (seed)
-- v1 supports English, Urdu, and Indonesian/Malay for translations.
-- Arabic is present as a language record for completeness and future use
-- (e.g., a future "Arabic meaning" tafsir-style column), but Arabic text
-- of the names themselves lives on `names.arabic`, not in translations.

BEGIN;

INSERT INTO languages (code, name, direction, is_active) VALUES
  ('ar', 'Arabic',     'rtl', TRUE),
  ('en', 'English',    'ltr', TRUE),
  ('ur', 'Urdu',       'rtl', TRUE),
  ('id', 'Indonesian', 'ltr', TRUE),
  ('ms', 'Malay',      'ltr', TRUE)
ON CONFLICT (code) DO UPDATE
  SET name       = EXCLUDED.name,
      direction  = EXCLUDED.direction,
      is_active  = EXCLUDED.is_active;

COMMIT;
