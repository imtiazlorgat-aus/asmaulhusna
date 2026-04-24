import { sql } from './client';
import type { LanguageRow, NameWithTranslations } from './types';

/**
 * Fetch all active languages. Used by the settings page to populate
 * the transliteration and translation language selectors.
 */
export async function getActiveLanguages(): Promise<LanguageRow[]> {
  return sql<LanguageRow[]>`
    SELECT code, name, direction, is_active
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
