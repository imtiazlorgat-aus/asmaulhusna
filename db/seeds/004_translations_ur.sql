-- 004_translations_ur.sql (seed)
-- Urdu transliteration and meanings for all 99 names.
-- TO BE COMPLETED — awaiting scholarly contribution.
--
-- When filling this in, follow the same shape as 003_translations_en.sql:
--   INSERT INTO translations (name_id, language_code, transliteration, translation) VALUES
--     (1, 'ur', '<urdu transliteration in latin or urdu script>', '<urdu meaning>'),
--     ...
--
-- Direction note: Urdu is RTL. The `languages.direction` column already
-- handles per-row direction rendering in the UI; no special handling needed
-- in this file.

BEGIN;

-- INSERT statements go here once content is available.

COMMIT;
