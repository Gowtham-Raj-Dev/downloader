import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COBALT_INSTANCES = [
  "https://rue-cobalt.xenon.zone",
  "https://nuko-c.meowing.de",
  "https://melon.clxxped.lol",
  "https://cobalt.omega.wolfy.love",
  "https://subito-c.meowing.de",
  "https://lime.clxxped.lol"
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '1080';

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching YouTube metadata via oEmbed for:', url, 'with quality:', quality);
    
    // 1. Fetch metadata via oEmbed
    const metadata = {
      title: 'YouTube Video',
      author: 'YouTube Creator',
      thumbnail: 'https://i.ytimg.com/vi/3nvHyakGSZI/hq2.jpg'
    };

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const oembedRes = await fetch(oembedUrl);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        metadata.title = oembedData.title || metadata.title;
        metadata.author = oembedData.author_name || metadata.author;
        metadata.thumbnail = oembedData.thumbnail_url || metadata.thumbnail;
      }
    } catch (metaErr) {
      console.warn('Failed to fetch oEmbed metadata:', metaErr);
    }

    // 2. Fetch direct download link from Cobalt instances
    let downloadUrl = null;
    const errorMsg = 'Failed to extract download link from all Cobalt instances.';

    for (const instance of COBALT_INSTANCES) {
      try {
        console.log(`Trying Cobalt instance: ${instance} for URL: ${url} (quality: ${quality})`);
        const res = await fetch(instance, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            videoQuality: quality, // Selected quality format (e.g. 1080, 720, 480, 360, 240)
            alwaysProxy: false
          }),
          signal: AbortSignal.timeout(6000) // 6 second timeout per instance
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.url) {
            downloadUrl = json.url;
            console.log(`Success with Cobalt instance ${instance}! URL: ${downloadUrl}`);
            break;
          }
        } else {
          const errBody = await res.text();
          console.warn(`Cobalt instance ${instance} returned status ${res.status}: ${errBody}`);
        }
      } catch (instErr) {
        console.warn(`Error connecting to Cobalt instance ${instance}:`, instErr instanceof Error ? instErr.message : instErr);
      }
    }

    if (!downloadUrl) {
      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }

    // 3. Return combined response
    return NextResponse.json({
      success: true,
      data: {
        title: metadata.title,
        author: metadata.author,
        thumbnail: metadata.thumbnail,
        videoUrl: downloadUrl
      }
    });

  } catch (error) {
    console.error('YouTube Downloader API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch YouTube details.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
