import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch YouTube page. Status: ${res.status}`);
    }

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"\s*\/?>/i) || 
                       html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : 'Unknown Title';

    // Extract description (default to meta)
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"\s*\/?>/i) ||
                      html.match(/<meta\s+property="og:description"\s+content="([^"]+)"\s*\/?>/i);
    
    let description = descMatch ? descMatch[1] : '';

    // Advanced: extract from ytInitialPlayerResponse for full description
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/);
    if (playerResponseMatch) {
      try {
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const detailedDesc = playerResponse?.microformat?.playerMicroformatRenderer?.description?.simpleText;
        if (detailedDesc) {
          description = detailedDesc;
        }
      } catch (e) {
        console.warn('Failed to parse ytInitialPlayerResponse JSON');
      }
    }

    // Extract tags
    const tagsMatch = html.match(/<meta\s+property="og:video:tag"\s+content="([^"]+)"\s*\/?>/gi);
    const tags = tagsMatch 
      ? tagsMatch.map(t => {
          const m = t.match(/content="([^"]+)"/i);
          return m ? m[1] : '';
        }).filter(Boolean)
      : [];

    // Extract hashtags from description
    const hashtags = description.match(/#[\w\u0590-\u05ff]+/g) || [];

    return NextResponse.json({
      success: true,
      data: {
        title,
        description,
        tags,
        hashtags: Array.from(new Set(hashtags))
      }
    });

  } catch (error) {
    console.error('YouTube Description Extractor Error:', error);
    return NextResponse.json({ error: 'Failed to extract description. Check if the link is correct.' }, { status: 500 });
  }
}
