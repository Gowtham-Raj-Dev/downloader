import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Every indexable page. /pinterest is left out because it only redirects to /pinterest/video.
const ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/instagram', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/instagram/multi-url', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pinterest/video', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pinterest/video/multi-url', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/pinterest/image', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pinterest/image/multi-url', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
