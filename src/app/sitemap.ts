import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Routes that have a page.tsx but must not be listed:
// /pinterest only redirects to /pinterest/video.
const EXCLUDED = new Set(['/pinterest']);

// Walks src/app at build time and returns every static page route, so new pages are
// picked up automatically. Skips API routes, private (_folder) and dynamic ([slug]) segments;
// route groups like (single) don't add a URL segment.
function findPageRoutes(dir: string, route = ''): string[] {
  const routes: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = entry.name;
    if (entry.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(name)) {
      routes.push(route);
      continue;
    }
    if (!entry.isDirectory()) continue;
    if (name === 'api' || name.startsWith('_') || name.startsWith('[') || name.startsWith('@')) continue;
    const isGroup = name.startsWith('(') && name.endsWith(')');
    routes.push(...findPageRoutes(path.join(dir, name), isGroup ? route : `${route}/${name}`));
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [...new Set(findPageRoutes(path.join(process.cwd(), 'src', 'app')))]
    .filter((route) => !EXCLUDED.has(route))
    .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 1,
  }));
}
