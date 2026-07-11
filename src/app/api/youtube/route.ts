import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_COBALT_INSTANCES = [
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

    let exactDuration = null;
    let exactSizeMb = 0;
    try {
      const ytRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, signal: AbortSignal.timeout(4000) });
      if (ytRes.ok) {
        const html = await ytRes.text();
        const dm = html.match(new RegExp('approxDurationMs.:.(\\d+)'));
        if (dm && dm[1]) {
           const durationSec = Math.round(parseInt(dm[1]) / 1000);
           const m = Math.floor(durationSec / 60);
           const s = durationSec % 60;
           exactDuration = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        const smMatches = [...html.matchAll(new RegExp('contentLength.:.(\\d+)', 'g'))].map(m => parseInt(m[1]));
        if (smMatches.length > 0) {
           exactSizeMb = Math.max(...smMatches) / (1024 * 1024);
        }
      }
    } catch (e) {
      console.warn('Failed to extract exact stats from YT source:', e);
    }

    // 1. Try Cobalt API instances first (high speed, supports direct CDN tunneling)
    let cobaltInstances = [...FALLBACK_COBALT_INSTANCES];
    try {
      const directoryRes = await fetch("https://cobalt.directory/api/working?type=api", {
        signal: AbortSignal.timeout(4000)
      });
      if (directoryRes.ok) {
        const dirJson = await directoryRes.json();
        if (dirJson.data && Array.isArray(dirJson.data.youtube) && dirJson.data.youtube.length > 0) {
          const fetchedList = dirJson.data.youtube;
          cobaltInstances = Array.from(new Set([...fetchedList, ...FALLBACK_COBALT_INSTANCES]));
          console.log(`Successfully fetched ${fetchedList.length} dynamic Cobalt instances for YouTube.`);
        }
      }
    } catch (dirErr) {
      console.warn("Failed to fetch dynamic Cobalt instances, using fallback list:", dirErr);
    }

    let downloadUrl = null;
    const errorMsg = 'Failed to extract download link from all Cobalt instances.';

    for (const instance of cobaltInstances) {
      try {
        console.log(`Trying Cobalt instance: ${instance} for URL: ${url} (quality: ${quality})`);
        const res = await fetch(instance, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Origin': 'https://downloader.codelove.in',
            'Referer': 'https://downloader.codelove.in/'
          },
          body: JSON.stringify({
            url: url,
            videoQuality: quality
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

    // Fallback: If Cobalt fails and it is standard quality, use our local yt-dlp proxy stream
    const isHighQuality = ['1080', '1440', '2160', '4320', 'max'].includes(quality);
    if (!downloadUrl && !isHighQuality) {
      downloadUrl = `/api/youtube/proxy?url=${encodeURIComponent(url)}`;
      console.log(`Using yt-dlp proxy stream for standard quality fallback: ${downloadUrl}`);
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
        videoUrl: downloadUrl,
        sizeMb: exactSizeMb || null,
        exactDuration: exactDuration
      }
    });

  } catch (error) {
    console.error('YouTube Downloader API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch YouTube details.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
