import { NextRequest, NextResponse } from 'next/server';
import { instagramGetUrl } from 'instagram-url-direct';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching Instagram URL via API:', url);
    const data = await instagramGetUrl(url);
    if (!data || !data.media_details || data.media_details.length === 0) {
      return NextResponse.json({ error: 'No media found for the provided URL. Make sure it is a public post/reel.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Instagram API Scraper Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Instagram video. Please check the link and try again.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
