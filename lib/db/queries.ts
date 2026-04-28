import { sql } from './client';
import type {
  DefaultRecitation,
  LanguageRow,
  NameWithTranslations,
  RecitationRow,
} from './types';

/**
 * Fetch all active languages. Used by the settings page to populate
 * the transliteration and translation language selectors.
 */
export async function getActiveLanguages(): Promise<LanguageRow[]> {
  return sql<LanguageRow[]>`
    SELECT code, name, direction, is_active, countrycode
    FROM languages
    WHERE is_active = TRUE
    ORDER BY name
  `;
}

/**
 * Fetch all 99 names with transliteration from `translitLang` and
 * translation from `transLang`.
 *
 * We do two LEFT JOINs against `translations` rather than using a
 * self-join with CASE expressions — clearer, and the planner handles
 * it well given the UNIQUE(name_id, language_code) index.
 *
 * If a translation row is missing for the requested language, the
 * respective column comes back as NULL — the UI should fall back to
 * the English version or hide the section.
 */
export async function getNamesWithTranslations(
  translitLang: string,
  transLang: string,
): Promise<NameWithTranslations[]> {
  return sql<NameWithTranslations[]>`
    SELECT
      n.id,
      n.arabic,
      n.slug,
      n.sequence,
      t_translit.transliteration AS transliteration,
      t_trans.translation         AS translation
    FROM names n
    LEFT JOIN translations t_translit
      ON t_translit.name_id = n.id
     AND t_translit.language_code = ${translitLang}
    LEFT JOIN translations t_trans
      ON t_trans.name_id = n.id
     AND t_trans.language_code = ${transLang}
    ORDER BY n.sequence
  `;
}

/**
 * Enumerate every (translitLang, transLang) combination from active
 * languages. Used by `generateStaticParams` to pre-render the viewer
 * pages at build time.
 *
 * Arabic is excluded as a transliteration target (transliterating Arabic
 * to Arabic is nonsensical) but kept as a valid translation target for
 * future tafsir-style Arabic meanings.
 */
export async function getLanguagePairs(): Promise<
  Array<{ translitLang: string; transLang: string }>
> {
  const langs = await getActiveLanguages();
  const translitCandidates = langs.filter((l) => l.code !== 'ar');
  const transCandidates    = langs;

  const pairs: Array<{ translitLang: string; transLang: string }> = [];
  for (const a of translitCandidates) {
    for (const b of transCandidates) {
      pairs.push({ translitLang: a.code, transLang: b.code });
    }
  }
  return pairs;
}

/**
 * Fetch the default recitation and its 99 timings. Returns null if no
 * recitation is flagged default — viewer pages handle this gracefully
 * by hiding the Listen button.
 *
 * One round-trip rather than two: we use a LEFT JOIN to pull the
 * recitation and its timings together. The first row holds recitation
 * metadata; all rows hold timing data.
 */
export async function getDefaultRecitation(): Promise<DefaultRecitation | null> {
  const rows = await sql<
    Array<RecitationRow & { name_id: number | null; start_ms: number | null; end_ms: number | null }>
  >`
    SELECT
      r.id,
      r.title,
      r.reciter,
      r.audio_url,
      r.duration_ms,
      r.license_note,
      r.is_default,
      t.name_id,
      t.start_ms,
      t.end_ms
    FROM recitations r
    LEFT JOIN recitation_timings t ON t.recitation_id = r.id
    WHERE r.is_default = TRUE
    ORDER BY t.name_id
  `;

  if (rows.length === 0) return null;

  const first = rows[0];
  const recitation: RecitationRow = {
    id: first.id,
    title: first.title,
    reciter: first.reciter,
    audio_url: first.audio_url,
    duration_ms: first.duration_ms,
    license_note: first.license_note,
    is_default: first.is_default,
  };

  const timings = rows
    .filter((r) => r.name_id !== null)
    .map((r) => ({
      name_id: r.name_id as number,
      start_ms: r.start_ms as number,
      end_ms: r.end_ms as number,
    }));

  return { recitation, timings };
}
