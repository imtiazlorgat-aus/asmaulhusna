-- 001_languages.sql (seed)
-- v1 supports English, Urdu, and Indonesian/Malay for translations.
-- Arabic is present as a language record for completeness and future use
-- (e.g., a future "Arabic meaning" tafsir-style column), but Arabic text
-- of the names themselves lives on `names.arabic`, not in translations.

BEGIN;

INSERT INTO languages (code, name, direction, is_active, countrycode) VALUES
  ('ar', 'Arabic',     'rtl', TRUE, 'SAU'),
  ('en', 'English',    'ltr', TRUE, 'GBR'),
  ('ur', 'Urdu',       'rtl', TRUE, 'PAK'),
  ('id', 'Indonesian', 'ltr', TRUE, 'IDN'),
  ('ms', 'Malay',      'ltr', TRUE, 'MYS'),
  ('af', 'Afrikaans', 'ltr', TRUE, 'ZAF),
  ('xa', 'Xhosa', 'ltr', TRUE, 'ZAF'),
  ('zu)
ON CONFLICT (code) DO UPDATE
  SET name        = EXCLUDED.name,
      direction   = EXCLUDED.direction,
      is_active   = EXCLUDED.is_active,
      countrycode = EXCLUDED.countrycode;

COMMIT;
