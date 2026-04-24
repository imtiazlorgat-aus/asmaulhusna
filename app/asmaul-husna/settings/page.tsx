import type { Metadata } from 'next';
import {
  getActiveLanguages,
  getNamesWithTranslations,
} from '@/lib/db/queries';
import { SettingsForm } from '@/components/settings/SettingsForm';

export const metadata: Metadata = {
  title: 'Settings — Asmaul Husna',
  description: 'Customize display, languages, fonts, and backgrounds.',
};

/**
 * The settings page has no language params in its URL — it operates
 * on whatever is in the store. For the live preview we fetch a single
 * name (Ar-Rahman, id=1) in every active language so we always have
 * something valid to show regardless of what the user has selected.
 *
 * ISR so changes to translations propagate without a rebuild.
 */
export const revalidate = 86400;

export default async function SettingsPage() {
  const languages = await getActiveLanguages();

  // We fetch with both language codes as 'en' just to have a baseline.
  // The client component re-fetches on language change by navigating
  // to the viewer route, so this is only the initial preview data.
  const [firstName] = await getNamesWithTranslations('en', 'en');

  // Find directions for the default languages. The client component
  // assumes these are correct for the initial render; when the user
  // changes languages, router.push handles the transition and the
  // viewer page will look up fresh directions.
  const en = languages.find((l) => l.code === 'en');
  const defaultDirection = en?.direction ?? 'ltr';

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <SettingsForm
        languages={languages}
        previewName={firstName}
        previewTransliterationDirection={defaultDirection}
        previewTranslationDirection={defaultDirection}
      />
    </main>
  );
}
