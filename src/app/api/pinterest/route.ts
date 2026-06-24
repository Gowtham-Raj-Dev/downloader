import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching Pinterest URL via API:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`Failed! HTTP error! status: ${response.status}`);
    }

    const htmlData = await response.text();

    // Unescape HTML to handle escaped characters like \/
    const unescapedHtml = htmlData.replace(/\\(?:u002F|\/)/g, '/');

    // 1. Try to extract from __PWS_DATA__ json if present
    let bestVideoUrl = '';
    let bestThumbnail = '';
    
    try {
      const pwsDataMatch = htmlData.match(/<script id="__PWS_DATA__" type="application\/json">(.+?)<\/script>/);
      if (pwsDataMatch) {
        const pwsData = JSON.parse(pwsDataMatch[1]);
        // Recursively search for video URLs in the JSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const findVideo = (obj: any) => {
          if (!obj) return;
          if (typeof obj === 'string') {
            if (obj.startsWith('http') && (obj.includes('.mp4') || obj.includes('.m3u8')) && obj.includes('.pinimg.com')) {
              if (obj.includes('720p') || obj.includes('1080p') || obj.includes('V_720P')) {
                 bestVideoUrl = obj;
              } else if (!bestVideoUrl) {
                 bestVideoUrl = obj;
              }
            }
            if (obj.startsWith('http') && obj.includes('.jpg') && obj.includes('i.pinimg.com')) {
               if (!bestThumbnail) bestThumbnail = obj;
            }
          } else if (Array.isArray(obj)) {
            obj.forEach(findVideo);
          } else if (typeof obj === 'object') {
            // Check for specific video structures
            if (obj.video_list) {
              const vList = obj.video_list;
              if (vList['V_720P']) bestVideoUrl = vList['V_720P'].url;
              else if (vList['V_1080P']) bestVideoUrl = vList['V_1080P'].url;
              else {
                const keys = Object.keys(vList);
                if (keys.length > 0) bestVideoUrl = vList[keys[0]].url;
              }
            }
            Object.values(obj).forEach(findVideo);
          }
        };
        findVideo(pwsData);
      }
    } catch (e) {
      console.log('Error parsing __PWS_DATA__:', e);
    }

    // 2. Fallback to regex on unescaped HTML if JSON extraction failed
    if (!bestVideoUrl) {
      const mp4Matches = unescapedHtml.match(/https:\/\/[^\s"'<>]+\.(?:mp4|m3u8)/gi) || [];
      const jpgMatches = unescapedHtml.match(/https:\/\/[^\s"'<>]+\.jpg/gi) || [];

      // Filter for .pinimg.com which is their video CDN
      const videoMatches = mp4Matches.filter((url: string) => url.includes('.pinimg.com'));
      const uniqueVideos: string[] = Array.from(new Set(videoMatches.length > 0 ? videoMatches : (mp4Matches as string[])));

      if (uniqueVideos.length > 0) {
        bestVideoUrl = uniqueVideos[0];
        for (const vid of uniqueVideos) {
            if (vid.includes('720') || vid.includes('1080') || vid.includes('V_720P')) {
                bestVideoUrl = vid;
                break;
            }
        }
      }
      
      if (!bestThumbnail && jpgMatches.length > 0) {
        bestThumbnail = jpgMatches[0];
      }
    }

    if (!bestVideoUrl) {
      return NextResponse.json({ error: 'Could not find any video in this Pinterest link. It might be an image pin or a protected video.' }, { status: 404 });
    }

    const data = {
      media_details: [
        {
          url: bestVideoUrl,
          thumbnail: bestThumbnail,
          duration_s: 15,
          video_view_count: 0,
        }
      ],
      post_info: {
        likes: 0,
        caption: 'Pinterest Download',
      }
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Pinterest API Scraper Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Pinterest video. Please check the link and try again.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
