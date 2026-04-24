import type { MetadataRoute } from 'next';
import { getLanguagePairs } from '@/lib/db/queries';

const BASE_URL = 'https://asmaulhusna.co.za';

/**
 * Generate a sitemap entry for every static route so search engines
 * can index all language combinations. The viewer pages are the
 * primary content; About and Settings are secondary.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pairs = await getLanguagePairs();
  const now = new Date();

  const viewerUrls: MetadataRoute.Sitemap = pairs.map(
    ({ translitLang, transLang }) => ({
      url: `${BASE_URL}/asmaul-husna/${translitLang}/${transLang}`,
      lastModified: now,
      changeFrequency: 'weekly',
      // English pair gets higher priority since it's the default.
      priority: translitLang === 'en' && transLang === 'en' ? 1.0 : 0.8,
    }),
  );

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...viewerUrls, ...staticUrls];
}
