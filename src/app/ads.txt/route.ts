import { ADSENSE_CLIENT } from '@/lib/adsense';

export const dynamic = 'force-static';

export function GET() {
  const body = ADSENSE_CLIENT
    ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense publisher ID not configured yet - set ADSENSE_CLIENT in src/lib/adsense.ts\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
