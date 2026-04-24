-- 001_languages.sql
-- Supported languages for transliteration and translation.
-- `direction` controls per-language text flow (rtl for Arabic/Urdu, ltr for Latin-script).

BEGIN;

CREATE TABLE IF NOT EXISTS languages (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  direction   TEXT NOT NULL CHECK (direction IN ('ltr', 'rtl')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  languages IS 'Supported languages for transliteration and translation.';
COMMENT ON COLUMN languages.code      IS 'ISO 639-1 code (e.g., en, ur, id, ms).';
COMMENT ON COLUMN languages.direction IS 'Text direction: ltr or rtl.';
COMMENT ON COLUMN languages.is_active IS 'Whether this language is offered in the UI.';

COMMIT;
