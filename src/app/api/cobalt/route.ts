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
      body: JSON.stringify({ url, videoQuality }),
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
