import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getActiveLanguages,
  getLanguagePairs,
  getNamesWithTranslations,
} from '@/lib/db/queries';
import { NameGrid } from '@/components/viewer/NameGrid';

// Revalidate at most once a day. Translations don't change often; when
// they do, a rebuild or revalidation will pick them up.
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ translitLang: string; transLang: string }>;
}

/**
 * Enumerate every valid language pair at build time. Each becomes a
 * statically-generated HTML page — fast loads, SEO-friendly, no
 * per-request DB work in production.
 */
export async function generateStaticParams() {
  return getLanguagePairs();
}

/**
 * Per-page metadata. Uses the language's display name to keep titles
 * distinguishable when a user has multiple tabs open.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { translitLang, transLang } = await params;
  const langs = await getActiveLanguages();
  const translit = langs.find((l) => l.code === translitLang);
  const trans = langs.find((l) => l.code === transLang);

  if (!translit || !trans) {
    return { title: 'Asmaul Husna' };
  }

  return {
    title: `Asmaul Husna — ${translit.name} transliteration, ${trans.name} translation`,
    description:
      'Read and reflect on the 99 Names of Allah in Arabic, with transliteration and translation.',
  };
}

export default async function ViewerPage({ params }: PageProps) {
  const { translitLang, transLang } = await params;

  // Validate the language codes are both active. We pull languages
  // once and inspect rather than making two separate existence checks.
  const langs = await getActiveLanguages();
  const translit = langs.find((l) => l.code === translitLang);
  const trans = langs.find((l) => l.code === transLang);

  if (!translit || !trans) {
    notFound();
  }

  const names = await getNamesWithTranslations(translitLang, transLang);

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">Asmaul Husna</h1>
      <NameGrid
        names={names}
        transliterationDirection={translit.direction}
        translationDirection={trans.direction}
      />
    </main>
  );
}
