import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Proxying stream request for:', url);
    
    const range = request.headers.get('range');
    const fetchHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
    };
    
    if (range) {
      fetchHeaders['Range'] = range;
      console.log(`Forwarding Range header: ${range}`);
    }

    const response = await fetch(url, {
      headers: fetchHeaders,
    });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: `Failed to fetch video stream from source: ${response.statusText}` },
        { status: response.status }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    const isDownload = searchParams.get('download') === '1';
    const filename = searchParams.get('filename') || 'video.mp4';
    
    if (isDownload) {
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Error proxying video stream:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error streaming video content';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
