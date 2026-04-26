/**
 * Hand-written row types that mirror the SQL schema.
 *
 * Keep these in sync with db/migrations/* manually. This is the tradeoff
 * we accept for not using an ORM — it's cheap for a 3-table schema.
 */

export interface LanguageRow {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
}

export interface NameRow {
  id: number;
  arabic: string;
  slug: string;
  sequence: number;
}

export interface TranslationRow {
  id: number;
  name_id: number;
  language_code: string;
  transliteration: string | null;
  translation: string | null;
}

/**
 * The shape returned by the main viewer query — one row per name with
 * both the transliteration-language and translation-language content
 * joined in.
 */
export interface NameWithTranslations {
  id: number;
  arabic: string;
  slug: string;
  sequence: number;
  transliteration: string | null;
  translation: string | null;
}

/**
 * A recitation's metadata. Audio file path, duration, and licence
 * information.
 */
export interface RecitationRow {
  id: number;
  title: string;
  reciter: string | null;
  audio_url: string;
  duration_ms: number;
  license_note: string | null;
  is_default: boolean;
}

/**
 * A single name's start/end timestamps within a specific recitation,
 * in milliseconds.
 */
export interface RecitationTiming {
  name_id: number;
  start_ms: number;
  end_ms: number;
}

/**
 * The default recitation plus its timings — one bundle the client
 * needs to drive playback.
 */
export interface DefaultRecitation {
  recitation: RecitationRow;
  timings: RecitationTiming[];
}
