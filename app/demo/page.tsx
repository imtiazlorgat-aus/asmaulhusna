import { getNamesWithTranslations } from '@/lib/db/queries';
import { NameGrid } from '@/components/viewer/NameGrid';

export default async function DemoPage() {
  // Fetch all 99 names with English transliteration + translation.
  const names = await getNamesWithTranslations('en', 'en');

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Asmaul Husna — Demo
      </h1>
      <NameGrid names={names} />
    </main>
  );
}
