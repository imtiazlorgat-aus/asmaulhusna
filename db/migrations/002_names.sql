-- 002_names.sql
-- The 99 names of Allah (Asmaul Husna). Language-independent data only.
-- `id` and `sequence` are both 1..99 but kept separate so traditional ordering
-- can evolve without breaking foreign keys.

BEGIN;

CREATE TABLE IF NOT EXISTS names (
  id         SMALLINT PRIMARY KEY,
  arabic     TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  sequence   SMALLINT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT names_id_range  CHECK (id BETWEEN 1 AND 99),
  CONSTRAINT names_seq_range CHECK (sequence BETWEEN 1 AND 99)
);

CREATE INDEX IF NOT EXISTS idx_names_sequence ON names(sequence);

COMMENT ON TABLE  names IS 'The 99 names of Allah — Arabic text and routing slugs.';
COMMENT ON COLUMN names.arabic   IS 'Arabic text in Uthmanic script.';
COMMENT ON COLUMN names.slug     IS 'URL-safe slug, e.g., ar-rahman.';
COMMENT ON COLUMN names.sequence IS 'Traditional ordering (Tirmidhi list).';

COMMIT;
