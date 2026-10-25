import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Search and AI crawlers we explicitly welcome. Everyone gets the same rules.
const CRAWLERS = [
  '*',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Bingbot',
];

// Plain route handler instead of robots.ts so the file can carry a comment.
export function GET() {
  const rules = CRAWLERS.map((agent) => `User-agent: ${agent}\nAllow: /\nDisallow: /api/`).join('\n\n');
  const body = [
    '# Insta Downloader is updated often. All pages are open to crawl; only /api/ is off limits.',
    '',
    rules,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
