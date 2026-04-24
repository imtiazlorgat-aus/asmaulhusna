import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import {
  getActiveLanguages,
  getNamesWithTranslations,
} from '@/lib/db/queries';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const metadata: Metadata = {
  title: 'Settings — Asmaul Husna',
  description: 'Customize display, languages, fonts, and backgrounds.',
};

export const revalidate = 86400;

export default async function SettingsPage() {
  const languages = await getActiveLanguages();
  const [firstName] = await getNamesWithTranslations('en', 'en');
  const en = languages.find((l) => l.code === 'en');
  const defaultDirection = en?.direction ?? 'ltr';

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild aria-label="Back to viewer">
            <Link href="/asmaul-husna">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
        <ThemeToggle />
      </div>
      <SettingsForm
        languages={languages}
        previewName={firstName}
        previewTransliterationDirection={defaultDirection}
        previewTranslationDirection={defaultDirection}
      />
    </main>
  );
}
