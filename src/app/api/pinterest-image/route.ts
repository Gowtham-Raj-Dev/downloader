import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    
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
    const unescapedHtml = htmlData.replace(/\\(?:u002F|\/)/g, '/');

    let bestImageUrl = '';
    let caption = 'Pinterest Image Download';
    
    // Strategy 1: OG Image Tag (Most reliable for the main pin image)
    const ogImageMatch = unescapedHtml.match(/<meta property="og:image"[^>]*content="([^"]+)"/i) || unescapedHtml.match(/<meta name="og:image"[^>]*content="([^"]+)"/i);
    if (ogImageMatch && ogImageMatch[1] && !ogImageMatch[1].includes('default_image')) {
      bestImageUrl = ogImageMatch[1];
    }

    // Check title/caption from OG tag
    const ogTitleMatch = unescapedHtml.match(/<meta property="og:title"[^>]*content="([^"]+)"/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      caption = ogTitleMatch[1];
    }
    
    // Strategy 2: __PWS_DATA__ specific extraction
    if (!bestImageUrl) {
      try {
        const pwsDataMatch = htmlData.match(/<script id="__PWS_DATA__" type="application\/json">(.+?)<\/script>/);
        if (pwsDataMatch) {
          const pwsData = JSON.parse(pwsDataMatch[1]);
          
          if (pwsData.props?.initialReduxState?.pins) {
            const pins = pwsData.props.initialReduxState.pins;
            const pinKeys = Object.keys(pins);
            if (pinKeys.length > 0) {
              const firstPin = pins[pinKeys[0]];
              if (firstPin.images?.orig?.url) {
                bestImageUrl = firstPin.images.orig.url;
              }
              if (firstPin.description || firstPin.title) {
                caption = firstPin.description || firstPin.title;
              }
            }
          }
        }
      } catch (e) {
        // Ignore JSON parse errors and continue to fallback strategies
      }
    }

    // Strategy 3: Fallback Regex using 736x as source of truth
    if (!bestImageUrl) {
      const fallbackMatches = unescapedHtml.match(/https:\/\/i\.pinimg\.com\/736x\/[^\s"'<>]+\.(?:jpg|png)/gi) || [];
      const validFallbacks = fallbackMatches.filter((url: string) => !url.includes('default_image') && !url.includes('avatars'));
      
      if (validFallbacks.length > 0) {
        // We found the main pin image in 736x preview size! Now upgrade it to originals size for max quality.
        bestImageUrl = validFallbacks[0].replace('736x', 'originals');
      } else {
        // Last resort: check originals directly
        const jpgMatches = unescapedHtml.match(/https:\/\/i\.pinimg\.com\/originals\/[^\s"'<>]+\.(?:jpg|png)/gi) || [];
        const validJpgs = jpgMatches.filter((url: string) => !url.includes('default_image') && !url.includes('avatars') && !url.includes('d5/3b/01')); // Ignore common gradient
        if (validJpgs.length > 0) {
          bestImageUrl = validJpgs[0];
        }
      }
    }

    if (!bestImageUrl) {
      return NextResponse.json({ error: 'Could not find any image in this Pinterest link.' }, { status: 404 });
    }

    const data = {
      media_details: [
        {
          url: bestImageUrl,
          thumbnail: bestImageUrl,
        }
      ],
      post_info: {
        likes: 0,
        caption: caption || 'Pinterest Image Download',
      }
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Pinterest Image API Scraper Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Pinterest image. Please check the link and try again.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
