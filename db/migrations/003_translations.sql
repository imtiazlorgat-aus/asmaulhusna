-- 003_translations.sql
-- One row per (name, language) pair, holding both the transliteration
-- (Latin-script phonetic rendering) and the meaning in that language.
--
-- Separating transliteration from translation in the same row — rather
-- than splitting into two tables — matches how users think: "English
-- transliteration + English meaning" is one conceptual unit per name.

BEGIN;

CREATE TABLE IF NOT EXISTS translations (
  id               SERIAL PRIMARY KEY,
  name_id          SMALLINT NOT NULL REFERENCES names(id) ON DELETE CASCADE,
  language_code    TEXT     NOT NULL REFERENCES languages(code),
  transliteration  TEXT,
  translation      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_translations_lang    ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_name_id ON translations(name_id);

-- Keep updated_at accurate on edits. Useful when you hand the DB to a
-- scholar for review and want to see which rows changed last.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_translations_updated_at ON translations;
CREATE TRIGGER trg_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  translations IS 'Transliteration + translation for each name in each language.';
COMMENT ON COLUMN translations.transliteration IS 'Latin-script phonetic rendering (e.g., "Ar-Rahman").';
COMMENT ON COLUMN translations.translation     IS 'Meaning rendered in the target language.';

COMMIT;
