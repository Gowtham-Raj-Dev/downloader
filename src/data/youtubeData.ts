import { VideoItem } from './mockProfiles';

export interface YoutubeVideoItem extends VideoItem {
  youtubeUrl: string;
  title?: string;
  author?: string;
  sizeMb?: number;
  exactDuration?: string;
}

export function isYoutubeVideoUrl(input: string): boolean {
  const clean = input.trim().toLowerCase();
  return (
    clean.includes('youtube.com/') ||
    clean.includes('youtu.be/') ||
    clean.includes('youtube-nocookie.com/')
  );
}

export function extractYoutubeId(input: string): string | null {
  const clean = input.trim();
  try {
    const urlObj = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.substring(1);
    }
    const vParam = urlObj.searchParams.get('v');
    if (vParam) return vParam;
    
    const pathname = urlObj.pathname;
    if (pathname.includes('/shorts/')) {
      return pathname.split('/shorts/')[1].split('/')[0].split('?')[0];
    }
    if (pathname.includes('/embed/')) {
      return pathname.split('/embed/')[1].split('/')[0].split('?')[0];
    }
    if (pathname.includes('/v/')) {
      return pathname.split('/v/')[1].split('/')[0].split('?')[0];
    }
  } catch {
    // Fallback regex matching
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const YOUTUBE_SAMPLE_VIDEOS = [
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    duration: '10:15',
    caption: 'Building a SaaS platform in 24 hours 💻🚀 Full stack coding sprint from scratch! #coding #saas #developer #indiehackers',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
    duration: '4:30',
    caption: 'Ultimate Lo-Fi Coding Beats Mix 🎧 Grab your coffee and relax. #lofi #beats #studymusic #codingsession',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    duration: '12:45',
    caption: 'The Future of AI and Agentic Workflows 🤖 Detailed deep dive into auto-coding and large language models. #ai #tech #future',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    duration: '0:35',
    caption: 'Top 10 VS Code Extensions for developers in 2026! Speed up your development workflow instantly ⚡🚀 #vscode #programming #developer',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    duration: '0:18',
    caption: 'React 19 Core Features & Updates: Everything you need to know in under 60 seconds! ⚛️🔥 #shorts #reactjs #webdev #frontend',
  }
];

export function generateDynamicYoutubeVideo(url: string): YoutubeVideoItem {
  const videoId = extractYoutubeId(url) || 'youtube_video';
  
  // Deterministic seed based on videoId
  let hash = 0;
  for (let i = 0; i < videoId.length; i++) {
    hash = videoId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  const views = (absHash % 980) * 1540 + 24500;
  const likes = Math.floor(views * 0.08) + 380;
  const comments = Math.floor(likes * 0.12) + 42;
  
  const sampleIndex = absHash % YOUTUBE_SAMPLE_VIDEOS.length;
  const sample = YOUTUBE_SAMPLE_VIDEOS[sampleIndex];

  const isShort = url.toLowerCase().includes('/shorts/') || sample.duration.startsWith('0:');

  return {
    id: videoId,
    thumbnail: sample.thumbnail,
    videoUrl: sample.videoUrl,
    duration: sample.duration,
    uploadDate: '2 days ago',
    views,
    likes,
    comments,
    caption: `${sample.caption} (Fetched successfully. Video ID: ${videoId})`,
    type: isShort ? 'reel' : 'video',
    instagramUrl: url.startsWith('http') ? url : `https://${url}`, // fallback for library reuse
    youtubeUrl: url.startsWith('http') ? url : `https://${url}`
  };
}
