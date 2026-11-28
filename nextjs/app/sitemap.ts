import type { MetadataRoute } from 'next';
import { MOVIE_ROUTES, SITE_URL } from '../lib/movies';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const movieEntries: MetadataRoute.Sitemap = MOVIE_ROUTES.map((entry) => ({
    url: `${SITE_URL}/${entry.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: entry.slug === 'menu' ? 0.9 : 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...movieEntries,
  ];
}
