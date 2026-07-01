import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const FALLBACK_COBALT_INSTANCES = [
  "https://rue-cobalt.xenon.zone",
  "https://cobaltapi.kittycat.boo",
  "https://dog.kittycat.boo",
  "https://cobalt.omega.wolfy.love",
  "https://melon.clxxped.lol",
  "https://lime.clxxped.lol"
];

// Helper to decode base64url JWT payload from snapcdn URLs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Helper to scrape SaveInsta as a backup fallback
async function fetchFromSaveInsta(instaUrl: string): Promise<{ url: string; thumbnail?: string; caption?: string; isImage?: boolean }> {
  const domains = ["https://saveinsta.to", "https://saveclip.app"];
  let lastError = null;

  for (const domain of domains) {
    try {
      console.log(`Trying SaveInsta scraper domain: ${domain}`);
      
      // 1. Fetch homepage
      const homeRes = await fetch(`${domain}/en/highlights`, {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(6000)
      });

      if (!homeRes.ok) {
        throw new Error(`Failed to fetch homepage: ${homeRes.status}`);
      }

      const html = await homeRes.text();
      const kExpMatch = html.match(/k_exp\s*=\s*"([^"]+)"/);
      const kTokenMatch = html.match(/k_token\s*=\s*"([^"]+)"/);

      if (!kExpMatch || !kTokenMatch) {
        throw new Error("k_exp or k_token not found in HTML");
      }

      const k_exp = kExpMatch[1];
      const k_token = kTokenMatch[1];

      // Delay
      await new Promise(r => setTimeout(r, 500));

      // 2. Userverify
      const verifyRes = await fetch(`${domain}/api/userverify`, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": domain,
          "Referer": `${domain}/en/highlights`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: new URLSearchParams({ url: instaUrl }),
        signal: AbortSignal.timeout(6000)
      });

      if (!verifyRes.ok) {
        throw new Error(`Verify failed: ${verifyRes.status}`);
      }

      const verifyJson = await verifyRes.json();
      if (!verifyJson || !verifyJson.token) {
        throw new Error("No token returned in verify");
      }

      const cftoken = verifyJson.token;

      // Delay
      await new Promise(r => setTimeout(r, 500));

      // 3. ajaxSearch
      const searchRes = await fetch(`${domain}/api/ajaxSearch`, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Origin": domain,
          "Referer": `${domain}/en/highlights`,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: new URLSearchParams({
          k_exp: k_exp,
          k_token: k_token,
          q: instaUrl,
          t: "media",
          lang: "en",
          v: "v2",
          cftoken: cftoken
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (!searchRes.ok) {
        throw new Error(`Search failed: ${searchRes.status}`);
      }

      const searchJson = await searchRes.json();
      if (searchJson.status === "ok" && searchJson.data) {
        const dataHtml = searchJson.data;

        // 1. Find all anchor tags in the HTML to analyze link text
        const aTagRegex = /<a\s+[^>]*href=["'](https:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
        const links: { url: string; text: string }[] = [];
        let match;
        while ((match = aTagRegex.exec(dataHtml)) !== null) {
          links.push({
            url: match[1],
            text: match[2].toLowerCase()
          });
        }

        const videoUrls: string[] = [];
        const imageUrls: string[] = [];

        const classifyUrl = (u: string, text: string = '') => {
          const lowerText = text.toLowerCase();
          const lowerUrl = u.toLowerCase();
          
          // Try to extract and decode JWT token from snapcdn url
          let jwtFilename = '';
          let jwtUrl = '';
          try {
            const urlObj = new URL(u);
            const tokenVal = urlObj.searchParams.get('token');
            if (tokenVal) {
              const payload = decodeJwtPayload(tokenVal);
              if (payload) {
                jwtFilename = (payload.filename || '').toLowerCase();
                jwtUrl = (payload.url || '').toLowerCase();
              }
            }
          } catch (err) {
            // Ignore parsing errors
          }

          // Check JWT payload first (highest accuracy)
          if (jwtFilename) {
            const isVid = jwtFilename.endsWith('.mp4') || jwtFilename.endsWith('.mov') || jwtFilename.endsWith('.webm') || jwtUrl.includes('.mp4') || jwtUrl.includes('.mov') || jwtUrl.includes('.webm');
            const isImg = jwtFilename.endsWith('.jpg') || jwtFilename.endsWith('.jpeg') || jwtFilename.endsWith('.png') || jwtFilename.endsWith('.webp') || jwtUrl.includes('.jpg') || jwtUrl.includes('.jpeg') || jwtUrl.includes('.png') || jwtUrl.includes('.webp');
            
            if (isVid) {
              videoUrls.push(u);
              return;
            } else if (isImg) {
              imageUrls.push(u);
              return;
            }
          }

          // Fallback 1: Classify by anchor text content
          const hasVideoText = lowerText.includes('video') || lowerText.includes('mp4') || lowerText.includes('download-mp4') || lowerText.includes('download video') || lowerText.includes('download mp4');
          const hasImageText = lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('jpg') || lowerText.includes('jpeg') || lowerText.includes('png') || lowerText.includes('download photo') || lowerText.includes('download image') || lowerText.includes('download jpg');
          
          if (hasVideoText) {
            videoUrls.push(u);
          } else if (hasImageText) {
            imageUrls.push(u);
          } else {
            // Fallback 2: Classify by URL path / queries
            const isVidExt = lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm') || lowerUrl.includes('format=mp4') || lowerUrl.includes('type=video');
            const isImg = !isVidExt && (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.webp'));
            const isDownloadDomain = lowerUrl.includes('dl.snapcdn.app') || lowerUrl.includes('saveinsta.to/download') || lowerUrl.includes('saveclip.app');
            
            if (isVidExt || (isDownloadDomain && !isImg)) {
              videoUrls.push(u);
            } else if (isImg) {
              imageUrls.push(u);
            }
          }
        };

        // Classify all anchor links
        for (const link of links) {
          classifyUrl(link.url, link.text);
        }

        // 2. Fallback: If no links were extracted via anchor tags, extract all hrefs directly
        if (videoUrls.length === 0 && imageUrls.length === 0) {
          const hrefRegex = /href=["'](https:\/\/[^"']+)["']/gi;
          let rawMatch;
          while ((rawMatch = hrefRegex.exec(dataHtml)) !== null) {
            classifyUrl(rawMatch[1]);
          }
        }

        const thumbnailMatch = dataHtml.match(/src=["'](https:\/\/[^"']+\.jpg[^"']*)["']/i) ||
                               dataHtml.match(/src=["'](https:\/\/[^"']+)["']/i);

        if (videoUrls.length > 0) {
          return {
            url: videoUrls[0],
            thumbnail: thumbnailMatch ? thumbnailMatch[1] : '',
            caption: "Instagram Video"
          };
        } else if (imageUrls.length > 0) {
          return {
            url: imageUrls[0],
            thumbnail: imageUrls[0],
            caption: "Instagram Image",
            isImage: true
          };
        } else {
          // Ultimate fallback matching patterns if list filtering didn't match
          const fallbackVideoMatch = dataHtml.match(/href=["'](https:\/\/dl\.snapcdn\.app\/[^"']+)["']/i) ||
                                     dataHtml.match(/href=["'](https:\/\/[^"']+\.mp4[^"']*)["']/i) ||
                                     dataHtml.match(/href=["'](https:\/\/saveinsta\.to\/download\/[^"']+)["']/i);
          
          if (fallbackVideoMatch) {
            return {
              url: fallbackVideoMatch[1],
              thumbnail: thumbnailMatch ? thumbnailMatch[1] : '',
              caption: "Instagram Video"
            };
          }

          if (searchJson.mess) {
            throw new Error(searchJson.mess);
          }
          throw new Error("No download link found in parsed HTML");
        }
      } else {
        throw new Error(searchJson.mess || "Invalid status from SaveInsta");
      }
    } catch (err) {
      console.warn(`SaveInsta scraper domain ${domain} failed:`, err instanceof Error ? err.message : err);
      lastError = err;
    }
  }

  throw lastError || new Error("All SaveInsta scraper domains failed");
}

// Helper to scrape SnapClip as a high-reliability fallback
async function fetchFromSnapClip(instaUrl: string): Promise<{ url: string; thumbnail?: string; caption?: string; isImage?: boolean }> {
  const domain = "https://snapclip.app";
  const res = await fetch(`${domain}/api/ajaxSearch`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': domain,
      'Referer': `${domain}/`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: new URLSearchParams({
      q: instaUrl,
      t: "media",
      v: "v2",
      lang: "en",
      cftoken: ""
    }),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    throw new Error(`SnapClip API failed with status: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'ok' || !json.data) {
    throw new Error("Invalid response status from SnapClip");
  }

  const script = json.data;
  let html = '';
  try {
    const runnableScript = script.replace(/eval\(/, 'return (');
    const getHtml = new Function(runnableScript);
    html = getHtml();
  } catch (unpackErr) {
    throw new Error("Failed to unpack SnapClip script: " + (unpackErr instanceof Error ? unpackErr.message : unpackErr));
  }

  if (!html) {
    throw new Error("Unpacked HTML is empty");
  }

  const hrefRegex = /href=\\"(https:\/\/[^\\]+)\\"/g;
  const links: string[] = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  const videoUrls: string[] = [];
  const imageUrls: string[] = [];

  const classifyUrl = (u: string) => {
    const lowerUrl = u.toLowerCase();
    let jwtFilename = '';
    let jwtUrl = '';
    try {
      const urlObj = new URL(u);
      const tokenVal = urlObj.searchParams.get('token');
      if (tokenVal) {
        const payload = decodeJwtPayload(tokenVal);
        if (payload) {
          jwtFilename = (payload.filename || '').toLowerCase();
          jwtUrl = (payload.url || '').toLowerCase();
        }
      }
    } catch (err) {
      // Ignore parsing errors
    }

    if (jwtFilename) {
      const isVid = jwtFilename.endsWith('.mp4') || jwtFilename.endsWith('.mov') || jwtFilename.endsWith('.webm') || jwtUrl.includes('.mp4') || jwtUrl.includes('.mov') || jwtUrl.includes('.webm');
      const isImg = jwtFilename.endsWith('.jpg') || jwtFilename.endsWith('.jpeg') || jwtFilename.endsWith('.png') || jwtFilename.endsWith('.webp') || jwtUrl.includes('.jpg') || jwtUrl.includes('.jpeg') || jwtUrl.includes('.png') || jwtUrl.includes('.webp');
      
      if (isVid) {
        videoUrls.push(u);
        return;
      } else if (isImg) {
        imageUrls.push(u);
        return;
      }
    }

    const isVidExt = lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm') || lowerUrl.includes('format=mp4') || lowerUrl.includes('type=video');
    const isImg = !isVidExt && (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.webp'));
    const isDownloadDomain = lowerUrl.includes('dl.snapcdn.app') || lowerUrl.includes('saveinsta.to/download') || lowerUrl.includes('saveclip.app') || lowerUrl.includes('media.fastdl.app');
    
    if (isVidExt || (isDownloadDomain && !isImg)) {
      videoUrls.push(u);
    } else if (isImg) {
      imageUrls.push(u);
    }
  };

  for (const link of links) {
    classifyUrl(link);
  }

  const thumbnailMatch = html.match(/src=\\"(https:\/\/[^\\]+\.jpg[^\\]*)\\"/i) ||
                         html.match(/src=\\"(https:\/\/[^\\]+)\\"/i);

  if (videoUrls.length > 0) {
    return {
      url: videoUrls[0],
      thumbnail: thumbnailMatch ? thumbnailMatch[1] : '',
      caption: "Instagram Video"
    };
  } else if (imageUrls.length > 0) {
    return {
      url: imageUrls[0],
      thumbnail: imageUrls[0],
      caption: "Instagram Image",
      isImage: true
    };
  } else {
    const fallbackVideoMatch = html.match(/href=\\"(https:\/\/dl\.snapcdn\.app\/[^\\]+)\\"/i) ||
                               html.match(/href=\\"(https:\/\/[^\\]+\.mp4[^\\]*)\\"/i);
    
    if (fallbackVideoMatch) {
      return {
        url: fallbackVideoMatch[1],
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : '',
        caption: "Instagram Video"
      };
    }

    throw new Error("No download links found in SnapClip response");
  }
}

// Helper to scrape FastDL as a second backup fallback
async function fetchFromFastDl(instaUrl: string): Promise<{ url: string; thumbnail?: string; caption?: string; isImage?: boolean }> {
  const secretHex = "4d0ea881938eae18a3ca0805d99dfc88b7cac682357e81b11558020b29dc04c3";
  const targetApi = "https://api-wh.fastdl.app/api/convert";
  
  const ts = Date.now();
  const signatureInput = instaUrl + ts;
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretHex, 'hex'))
    .update(signatureInput)
    .digest('hex');

  const payload = {
    sf_url: instaUrl,
    ts: ts,
    _ts: 1782510505153,
    _tsc: 0,
    _sv: 2,
    _s: signature
  };

  const res = await fetch(targetApi, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': 'https://fastdl.app',
      'Referer': 'https://fastdl.app/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000)
  });

  if (!res.ok) {
    throw new Error(`FastDL API failed with status: ${res.status}`);
  }

  const json = await res.json();
  if (json.code) {
    const codeStr = json.code;
    
    // Check if captcha is required
    if (codeStr.includes("CAPTCHA_REQUIRED")) {
      throw new Error("FastDL requires CAPTCHA verification");
    }

    // Find all anchor tags in the HTML to analyze link text
    const aTagRegex = /<a\s+[^>]*href=["'](https:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const links: { url: string; text: string }[] = [];
    let match;
    while ((match = aTagRegex.exec(codeStr)) !== null) {
      links.push({
        url: match[1].replace(/\\"/g, '"').replace(/\\\//g, '/'),
        text: match[2].toLowerCase()
      });
    }

    const videoUrls: string[] = [];
    const imageUrls: string[] = [];

    const classifyUrl = (u: string, text: string = '') => {
      const lowerText = text.toLowerCase();
      const lowerUrl = u.toLowerCase();
      
      let jwtFilename = '';
      let jwtUrl = '';
      try {
        const urlObj = new URL(u);
        const tokenVal = urlObj.searchParams.get('token');
        if (tokenVal) {
          const payload = decodeJwtPayload(tokenVal);
          if (payload) {
            jwtFilename = (payload.filename || '').toLowerCase();
            jwtUrl = (payload.url || '').toLowerCase();
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }

      if (jwtFilename) {
        const isVid = jwtFilename.endsWith('.mp4') || jwtFilename.endsWith('.mov') || jwtFilename.endsWith('.webm') || jwtUrl.includes('.mp4') || jwtUrl.includes('.mov') || jwtUrl.includes('.webm');
        const isImg = jwtFilename.endsWith('.jpg') || jwtFilename.endsWith('.jpeg') || jwtFilename.endsWith('.png') || jwtFilename.endsWith('.webp') || jwtUrl.includes('.jpg') || jwtUrl.includes('.jpeg') || jwtUrl.includes('.png') || jwtUrl.includes('.webp');
        
        if (isVid) {
          videoUrls.push(u);
          return;
        } else if (isImg) {
          imageUrls.push(u);
          return;
        }
      }

      const hasVideoText = lowerText.includes('video') || lowerText.includes('mp4') || lowerText.includes('download-mp4') || lowerText.includes('download video') || lowerText.includes('download mp4');
      const hasImageText = lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('jpg') || lowerText.includes('jpeg') || lowerText.includes('png') || lowerText.includes('download photo') || lowerText.includes('download image') || lowerText.includes('download jpg');
      
      if (hasVideoText) {
        videoUrls.push(u);
      } else if (hasImageText) {
        imageUrls.push(u);
      } else {
        const isVidExt = lowerUrl.includes('.mp4') || lowerUrl.includes('.mov') || lowerUrl.includes('.webm') || lowerUrl.includes('format=mp4') || lowerUrl.includes('type=video');
        const isImg = !isVidExt && (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.webp'));
        const isDownloadDomain = lowerUrl.includes('dl.snapcdn.app') || lowerUrl.includes('saveinsta.to/download') || lowerUrl.includes('saveclip.app') || lowerUrl.includes('media.fastdl.app');
        
        if (isVidExt || (isDownloadDomain && !isImg)) {
          videoUrls.push(u);
        } else if (isImg) {
          imageUrls.push(u);
        }
      }
    };

    for (const link of links) {
      classifyUrl(link.url, link.text);
    }

    if (videoUrls.length === 0 && imageUrls.length === 0) {
      const hrefRegex = /href=["'](https:\/\/[^"']+)["']/gi;
      let rawMatch;
      while ((rawMatch = hrefRegex.exec(codeStr)) !== null) {
        classifyUrl(rawMatch[1].replace(/\\"/g, '"').replace(/\\\//g, '/'));
      }
    }

    const thumbnailMatch = codeStr.match(/src=["'](https:\/\/[^"']+\.jpg[^"']*)["']/i) ||
                           codeStr.match(/src=["'](https:\/\/[^"']+)["']/i);

    if (videoUrls.length > 0) {
      return {
        url: videoUrls[0],
        thumbnail: thumbnailMatch ? thumbnailMatch[1].replace(/\\"/g, '"').replace(/\\\//g, '/') : '',
        caption: "Instagram Video"
      };
    } else if (imageUrls.length > 0) {
      return {
        url: imageUrls[0],
        thumbnail: imageUrls[0],
        caption: "Instagram Image",
        isImage: true
      };
    } else {
      const fallbackVideoMatch = codeStr.match(/href=["'](https:\/\/dl\.snapcdn\.app\/[^"']+)["']/i) ||
                                 codeStr.match(/href=["'](https:\/\/media\.fastdl\.app\/get[^"']+)["']/i) ||
                                 codeStr.match(/href=["'](https:\/\/[^"']+\.mp4[^"']*)["']/i);
      
      if (fallbackVideoMatch) {
        return {
          url: fallbackVideoMatch[1].replace(/\\"/g, '"').replace(/\\\//g, '/'),
          thumbnail: thumbnailMatch ? thumbnailMatch[1].replace(/\\"/g, '"').replace(/\\\//g, '/') : '',
          caption: "Instagram Video"
        };
      }

      throw new Error("No download links found in FastDL response");
    }
  }

  throw new Error("Invalid response format from FastDL");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // 1. Try Cobalt API instances first (high speed, supports direct CDN tunneling)
  let cobaltInstances = [...FALLBACK_COBALT_INSTANCES];
  try {
    const directoryRes = await fetch("https://cobalt.directory/api/working?type=api", {
      signal: AbortSignal.timeout(4000)
    });
    if (directoryRes.ok) {
      const dirJson = await directoryRes.json();
      if (dirJson.data && Array.isArray(dirJson.data.instagram) && dirJson.data.instagram.length > 0) {
        // Merge fetched instances in front of fallbacks
        const fetchedList = dirJson.data.instagram;
        cobaltInstances = Array.from(new Set([...fetchedList, ...FALLBACK_COBALT_INSTANCES]));
        console.log(`Successfully fetched ${fetchedList.length} dynamic Cobalt instances.`);
      }
    }
  } catch (dirErr) {
    console.warn("Failed to fetch dynamic Cobalt instances, using fallback list:", dirErr);
  }

  let downloadResponse = null;
  let backupImageResponse = null;

  for (const instance of cobaltInstances) {
    try {
      console.log(`Trying Cobalt instance: ${instance} for Instagram URL: ${url}`);
      const res = await fetch(instance, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          alwaysProxy: true
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (res.ok) {
        const json = await res.json();
        // Check if Cobalt successfully returned a media result (tunnel, redirect, or picker)
        if (json && (json.status === 'tunnel' || json.status === 'redirect' || json.status === 'picker')) {
          // If the URL is a video/reel/tv URL, reject Cobalt's response if it only returns a static image
          const isReelOrTv = url.includes('/reel/') || url.includes('/reels/') || url.includes('/tv/');
          if (isReelOrTv && (json.status === 'tunnel' || json.status === 'redirect')) {
            const filename = (json.filename || '').toLowerCase();
            let isCobaltImage = false;
            if (filename) {
              isCobaltImage = filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.webp');
            } else {
              try {
                const urlObj = new URL(json.url);
                const pathname = urlObj.pathname.toLowerCase();
                isCobaltImage = pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.png') || pathname.endsWith('.webp');
              } catch {
                isCobaltImage = json.url.toLowerCase().includes('.jpg') || json.url.toLowerCase().includes('.jpeg') || json.url.toLowerCase().includes('.png');
              }
            }
            if (isCobaltImage) {
              console.warn(`Cobalt instance ${instance} returned an image file (${json.filename}) for a video/reel URL. Saving as backup and continuing.`);
              backupImageResponse = json;
              continue;
            }
          }

          downloadResponse = json;
          console.log(`Success with Cobalt instance: ${instance}`);
          break;
        }
      } else {
        const errText = await res.text();
        console.warn(`Cobalt instance ${instance} returned status ${res.status}: ${errText}`);
      }
    } catch (instErr) {
      console.warn(`Error connecting to Cobalt instance ${instance}:`, instErr instanceof Error ? instErr.message : instErr);
    }
  }

  // If Cobalt succeeded, adapt response for frontend
  if (downloadResponse) {
    try {
      const mediaDetails = [];
      
      if (downloadResponse.status === 'tunnel' || downloadResponse.status === 'redirect') {
        const filename = (downloadResponse.filename || '').toLowerCase();
        let isImage = false;
        
        if (filename) {
          isImage = filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.webp');
        } else {
          try {
            const urlObj = new URL(downloadResponse.url);
            const pathname = urlObj.pathname.toLowerCase();
            isImage = pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.png') || pathname.endsWith('.webp');
          } catch {
            isImage = downloadResponse.url.toLowerCase().includes('.jpg') || downloadResponse.url.toLowerCase().includes('.jpeg') || downloadResponse.url.toLowerCase().includes('.png');
          }
        }

        mediaDetails.push({
          thumbnail: '',
          url: downloadResponse.url,
          duration_s: 0,
          video_view_count: 0,
          is_image: isImage
        });
      } else if (downloadResponse.status === 'picker') {
        for (const item of downloadResponse.picker) {
          if (item.type === 'video' || item.type === 'photo') {
            mediaDetails.push({
              thumbnail: item.thumb || '',
              url: item.url,
              duration_s: 0,
              video_view_count: 0,
              is_image: item.type === 'photo'
            });
          }
        }
      }

      if (mediaDetails.length > 0) {
        return NextResponse.json({
          success: true,
          data: {
            media_details: mediaDetails,
            post_info: {
              likes: 0,
              caption: downloadResponse.filename || 'Instagram Media'
            }
          }
        });
      }
    } catch (adaptErr) {
      console.error("Failed to adapt Cobalt response:", adaptErr);
    }
  }

  // 2. Fallback: SnapClip Scraper (Turnstile-free, very fast)
  try {
    console.log(`All Cobalt instances failed or did not return media. Falling back to SnapClip scraper...`);
    const snapClipData = await fetchFromSnapClip(url);
    if (snapClipData && snapClipData.url) {
      return NextResponse.json({
        success: true,
        data: {
          media_details: [{
            thumbnail: snapClipData.thumbnail || '',
            url: snapClipData.url,
            duration_s: 0,
            video_view_count: 0,
            is_image: !!snapClipData.isImage
          }],
          post_info: {
            likes: 0,
            caption: snapClipData.caption || 'Instagram Media'
          }
        }
      });
    }
  } catch (snapClipErr) {
    console.error(`SnapClip fallback scraper failed:`, snapClipErr);
  }

  // 3. Fallback: SaveInsta Scraper
  try {
    console.log(`SnapClip failed. Falling back to SaveInsta scraper...`);
    const saveInstaData = await fetchFromSaveInsta(url);
    if (saveInstaData && saveInstaData.url) {
      return NextResponse.json({
        success: true,
        data: {
          media_details: [{
            thumbnail: saveInstaData.thumbnail || '',
            url: saveInstaData.url,
            duration_s: 0,
            video_view_count: 0,
            is_image: !!saveInstaData.isImage
          }],
          post_info: {
            likes: 0,
            caption: saveInstaData.caption || 'Instagram Media'
          }
        }
      });
    }
  } catch (saveInstaErr) {
    console.error(`SaveInsta fallback scraper failed:`, saveInstaErr);
  }

  // 3. Fallback: FastDL Scraper
  try {
    console.log(`SaveInsta failed. Falling back to FastDL scraper...`);
    const fastDlData = await fetchFromFastDl(url);
    if (fastDlData && fastDlData.url) {
      return NextResponse.json({
        success: true,
        data: {
          media_details: [{
            thumbnail: fastDlData.thumbnail || '',
            url: fastDlData.url,
            duration_s: 0,
            video_view_count: 0,
            is_image: !!fastDlData.isImage
          }],
          post_info: {
            likes: 0,
            caption: fastDlData.caption || 'Instagram Media'
          }
        }
      });
    }
  } catch (fastDlErr) {
    console.error(`FastDL fallback scraper failed:`, fastDlErr);
  }

  // 4. Ultimate Fail-safe Fallback: If everything failed but we have a backup image response from Cobalt, use it!
  if (backupImageResponse) {
    try {
      console.log("All scrapers failed to extract video. Serving backup Cobalt image response.");
      const mediaDetails = [];
      const filename = (backupImageResponse.filename || '').toLowerCase();
      let isImage = false;
      
      if (filename) {
        isImage = filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') || filename.endsWith('.webp');
      } else {
        try {
          const urlObj = new URL(backupImageResponse.url);
          const pathname = urlObj.pathname.toLowerCase();
          isImage = pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.png') || pathname.endsWith('.webp');
        } catch {
          isImage = backupImageResponse.url.toLowerCase().includes('.jpg') || backupImageResponse.url.toLowerCase().includes('.jpeg') || backupImageResponse.url.toLowerCase().includes('.png');
        }
      }

      mediaDetails.push({
        thumbnail: '',
        url: backupImageResponse.url,
        duration_s: 0,
        video_view_count: 0,
        is_image: isImage
      });

      return NextResponse.json({
        success: true,
        data: {
          media_details: mediaDetails,
          post_info: {
            likes: 0,
            caption: backupImageResponse.filename || 'Instagram Media'
          }
        }
      });
    } catch (adaptBackupErr) {
      console.error("Failed to adapt backup Cobalt response:", adaptBackupErr);
    }
  }

  // 5. If everything failed
  return NextResponse.json({
    error: 'Failed to extract video details. Make sure the post is public and try again.'
  }, { status: 500 });
}
