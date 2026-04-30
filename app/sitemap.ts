import type { MetadataRoute } from 'next';
import { getActiveLanguages } from '@/lib/db/queries';

const BASE_URL = 'https://asmaulhusna.co.za';

/**
 * Generate a sitemap entry for every static route so search engines
 * can index all language pages. The viewer pages are the
 * primary content; About and Settings are secondary.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const langs = await getActiveLanguages();
  const now = new Date();

  const viewerUrls: MetadataRoute.Sitemap = langs
    .filter((l) => l.code !== 'ar')
    .map((l) => ({
      url: `${BASE_URL}/asmaul-husna/${l.code}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: l.code === 'en' ? 1.0 : 0.8,
    }));

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
