import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, videoQuality, instance } = body;

    if (!url || !instance) {
      return NextResponse.json({ error: 'URL and instance are required' }, { status: 400 });
    }

    const res = await fetch(instance, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Force h264 so Cobalt returns a proper progressive MP4 with a readable
      // duration/moov atom. Without it Cobalt may hand back a remuxed VP9/AV1
      // stream whose metadata mobile players can't parse -> 0:00 duration.
      body: JSON.stringify({
        url,
        videoQuality,
        youtubeVideoCodec: 'h264',
        downloadMode: 'auto',
        filenameStyle: 'basic'
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      const text = await res.text();
      return NextResponse.json({ error: 'Cobalt API error', details: text, status: res.status }, { status: res.status });
    }
  } catch (error) {
    console.error('Cobalt Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to proxy request to Cobalt' }, { status: 500 });
  }
}
