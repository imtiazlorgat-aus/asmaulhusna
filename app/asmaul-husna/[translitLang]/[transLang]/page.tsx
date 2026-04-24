import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Settings as SettingsIcon } from 'lucide-react';
import {
  getActiveLanguages,
  getLanguagePairs,
  getNamesWithTranslations,
} from '@/lib/db/queries';
import { NameGrid } from '@/components/viewer/NameGrid';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ translitLang: string; transLang: string }>;
}

export async function generateStaticParams() {
  return getLanguagePairs();
}

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

  const langs = await getActiveLanguages();
  const translit = langs.find((l) => l.code === translitLang);
  const trans = langs.find((l) => l.code === transLang);

  if (!translit || !trans) {
    notFound();
  }

  const names = await getNamesWithTranslations(translitLang, transLang);

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Asmaul Husna</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/asmaul-husna/settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      <NameGrid
        names={names}
        transliterationDirection={translit.direction}
        translationDirection={trans.direction}
      />
    </main>
  );
}
