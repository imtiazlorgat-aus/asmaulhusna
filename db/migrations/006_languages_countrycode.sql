-- 006_languages_countrycode.sql
-- Adds a countrycode column (ISO 3166-1 alpha-3) to languages so the UI
-- can display a representative national flag alongside each language name.

BEGIN;

ALTER TABLE languages
  ADD COLUMN IF NOT EXISTS countrycode TEXT;

COMMENT ON COLUMN languages.countrycode IS 'ISO 3166-1 alpha-3 country code for the representative flag (e.g., GBR for English).';

update languages set countrycode = 'SAU' where code='ar';
update languages set countrycode = 'GBR' where code='en';
update languages set countrycode = 'PAK' where code='ur';
update languages set countrycode = 'IDN' where code='id';
update languages set countrycode = 'MYS' where code='ms';
update languages set countrycode = 'ZAF' where code='af';
update languages set countrycode = 'ZAF' where code='xa';
update languages set countrycode = 'ZAF' where code='zu';

COMMIT;
