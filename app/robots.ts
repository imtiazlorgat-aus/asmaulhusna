import type { MetadataRoute } from 'next';

const BASE_URL = 'https://asmaulhusna.co.za';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Settings is a client-interactive page with no crawlable content.
      // Excluding it keeps search results clean.
      disallow: ['/asmaul-husna/settings'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
