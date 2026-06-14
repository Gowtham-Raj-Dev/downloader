export interface VideoItem {
  id: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  uploadDate: string;
  views: number;
  likes: number;
  comments: number;
  caption: string;
  type: 'reel' | 'video';
  instagramUrl: string;
}

export interface ProfileData {
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  following: number;
  postsCount: number;
  bio: string;
  verified: boolean;
  stats: {
    totalVideos: number;
    totalReels: number;
    totalPosts: number;
    latestUpload: string;
    totalAvailableMedia: number;
  };
  videos: VideoItem[];
}

const SAMPLE_VIDEOS = [
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
    duration: '0:15',
    caption: 'Lost in the Tokyo neon lights 🌃 Exploring Shibuya at midnight. #tokyo #neon #cyberpunk #travel',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=600&q=80',
    duration: '0:30',
    caption: 'Late night sessions with vinyl classics. Nothing beats analog sound 🎶🎛️ #vinyl #retro #musiclife #vibes',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    duration: '0:45',
    caption: 'Nature heals. Listening to the quiet flow of the mountain stream 🍃✨ #nature #peace #mountains #relaxation',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
    duration: '0:22',
    caption: 'Crashing waves and ocean breeze. Finding peace where the land meets the sea 🌊🏖️ #ocean #surf #wanderlust',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    duration: '0:12',
    caption: 'Building the future, one line of code at a time 💻🚀 Midnight debugging sessions. #developer #coding #tech #saas',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    duration: '0:18',
    caption: 'Feel the rhythm, chase the light. Dance like nobody is watching 🕺🔥 #dance #neonlights #vibes #freestyle',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    duration: '0:09',
    caption: 'Morning ritual ☕ Starting the day with fresh brew and positive energy. #coffee #morningmotivation #latte',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    duration: '0:35',
    caption: 'Chasing goals, leaving doubts behind. Rise and grind! 🏃‍♂️⚡ #fitness #running #motivation #stadium',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    duration: '0:28',
    caption: 'Cafecito & productivity ☕💻 Structuring the next big feature launch. #digitalnomad #remotework #startup',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    duration: '0:14',
    caption: 'Exploring social feeds. Sharing moments in real time 📲✨ #instagram #connect #tech #modernlife',
  }
];

export const PRESET_PROFILES: Record<string, ProfileData> = {
  nasa: {
    username: 'nasa',
    fullName: 'NASA',
    avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&h=150&q=80',
    followers: 97400000,
    following: 184,
    postsCount: 3824,
    bio: 'Explore the universe and discover our home planet with the official National Aeronautics and Space Administration account. 🌌🚀✨',
    verified: true,
    stats: {
      totalVideos: 412,
      totalReels: 284,
      totalPosts: 3824,
      latestUpload: '2 hours ago',
      totalAvailableMedia: 12
    },
    videos: [
      {
        id: 'nasa_v1',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '0:30',
        uploadDate: '2 hours ago',
        views: 1240000,
        likes: 98000,
        comments: 4200,
        caption: 'Looking back at our home planet. Earth, viewed from the International Space Station. A fragile blue marble in the cosmic dark. 🌍✨ #nasa #earth #space #iss',
        type: 'reel',
        instagramUrl: 'https://www.instagram.com/reel/nasa_v1/'
      },
      {
        id: 'nasa_v2',
        thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: '0:45',
        uploadDate: 'Yesterday',
        views: 2800000,
        likes: 210000,
        comments: 8900,
        caption: 'Dynamic views of deep space galaxies as captured by the James Webb Space Telescope. Peer back in cosmic time. 🌌🔭 #webb #galaxy #stars #space',
        type: 'video',
        instagramUrl: 'https://www.instagram.com/p/nasa_v2/'
      },
      {
        id: 'nasa_v3',
        thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '0:15',
        uploadDate: '3 days ago',
        views: 940000,
        likes: 72000,
        comments: 3100,
        caption: 'Water on Mars? Our rovers continue scanning the Martian surface for signs of ancient life and ancient waterways. 🚀🔴 #mars #rover #science #space',
        type: 'reel',
        instagramUrl: 'https://www.instagram.com/reel/nasa_v3/'
      },
      {
        id: 'nasa_v4',
        thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        duration: '1:10',
        uploadDate: '1 week ago',
        views: 3400000,
        likes: 310000,
        comments: 14000,
        caption: 'Sound of a black hole? Using sonification technology, we converted cosmic wave data from the Perseus galaxy cluster into audible sound. 🎧💫 #blackhole #sonification #space',
        type: 'video',
        instagramUrl: 'https://www.instagram.com/p/nasa_v4/'
      }
    ]
  },
  nike: {
    username: 'nike',
    fullName: 'Nike',
    avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&h=150&q=80',
    followers: 306000000,
    following: 147,
    postsCount: 1042,
    bio: 'If you have a body, you are an athlete. Just Do It. 👟🏃‍♀️🏆',
    verified: true,
    stats: {
      totalVideos: 320,
      totalReels: 198,
      totalPosts: 1042,
      latestUpload: '5 hours ago',
      totalAvailableMedia: 10
    },
    videos: [
      {
        id: 'nike_v1',
        thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        duration: '0:30',
        uploadDate: '5 hours ago',
        views: 4500000,
        likes: 410000,
        comments: 12000,
        caption: 'The start is the hardest part. But every stride brings you closer to your goal. Just Do It. 🏃‍♂️💨 #running #fitness #justdoit #motivation',
        type: 'reel',
        instagramUrl: 'https://www.instagram.com/reel/nike_v1/'
      },
      {
        id: 'nike_v2',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '0:15',
        uploadDate: '2 days ago',
        views: 2100000,
        likes: 180000,
        comments: 4200,
        caption: 'Find your rhythm. Unleash your potential. Movement is art. ⚡👟 #nike #sportswear #dance #performance',
        type: 'reel',
        instagramUrl: 'https://www.instagram.com/reel/nike_v2/'
      },
      {
        id: 'nike_v3',
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: '1:00',
        uploadDate: '5 days ago',
        views: 1800000,
        likes: 120000,
        comments: 3500,
        caption: 'Early morning athlete rituals. Fueling up and focusing the mind before training. ☕🧘‍♂️ #training #routine #discipline',
        type: 'video',
        instagramUrl: 'https://www.instagram.com/p/nike_v3/'
      }
    ]
  },
  taylorswift: {
    username: 'taylorswift',
    fullName: 'Taylor Swift',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    followers: 283000000,
    following: 0,
    postsCount: 652,
    bio: 'The Eras Tour, Midnights, and more. Official account for Taylor Swift. 🎤🎶🧣',
    verified: true,
    stats: {
      totalVideos: 184,
      totalReels: 94,
      totalPosts: 652,
      latestUpload: '1 day ago',
      totalAvailableMedia: 8
    },
    videos: [
      {
        id: 'ts_v1',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        duration: '0:25',
        uploadDate: '1 day ago',
        views: 8900000,
        likes: 950000,
        comments: 48000,
        caption: 'Listening to the new tracks on vinyl. Can\'t wait to sing these with you all! 🎶🎛️ #eras #erastour #music',
        type: 'reel',
        instagramUrl: 'https://www.instagram.com/reel/ts_v1/'
      },
      {
        id: 'ts_v2',
        thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: '0:50',
        uploadDate: '1 week ago',
        views: 12400000,
        likes: 1500000,
        comments: 65000,
        caption: 'Tokyo night 1 of the Eras Tour was absolutely magical! Thank you for the endless love! 🗼🎤💖 #erastourtokyo #taylorswift',
        type: 'video',
        instagramUrl: 'https://www.instagram.com/p/ts_v2/'
      }
    ]
  }
};

export function generateDynamicProfile(username: string): ProfileData {
  const cleanUsername = username.replace(/[^a-zA-Z0-9_.]/g, '').toLowerCase();
  
  if (PRESET_PROFILES[cleanUsername]) {
    return PRESET_PROFILES[cleanUsername];
  }
  
  // Deterministic seed based on username string
  let hash = 0;
  for (let i = 0; i < cleanUsername.length; i++) {
    hash = cleanUsername.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  
  // Format details nicely
  const formattedName = cleanUsername
    .split(/[._]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const followers = (absHash % 480) * 100000 + 12000;
  const following = (absHash % 800) + 120;
  const postsCount = (absHash % 1500) + 45;
  const verified = (absHash % 10) < 4; // 40% chance of being verified
  
  const bioOptions = [
    `Official Instagram profile of ${formattedName}. Explorer. Creator. Coffee enthusiast. ☕📸✨`,
    `Just living life, chasing dreams, and sharing my journey with you. Business inquiries: info@${cleanUsername}.com 💼`,
    `Building cool things, documenting the journey. Passionate about innovation, tech, and design. 🚀🛠️💡`,
    `Traveler | Photographer | Storyteller. Capturing moments around the globe. 🌎📷✈️`,
    `Design is not just what it looks like, it's how it works. Co-founder. Athlete. Wellness advocate. 🌱🏋️‍♂️`
  ];
  const bio = bioOptions[absHash % bioOptions.length];

  const totalVideos = Math.floor(postsCount * 0.25) + 5;
  const totalReels = Math.floor(totalVideos * 0.6);
  const totalPosts = postsCount;
  const latestUploadOptions = ['30 minutes ago', '2 hours ago', '5 hours ago', '1 day ago', '2 days ago'];
  const latestUpload = latestUploadOptions[absHash % latestUploadOptions.length];
  
  const availableMediaCount = 6 + (absHash % 5); // 6 to 10 videos
  const videos: VideoItem[] = [];
  
  for (let i = 0; i < availableMediaCount; i++) {
    const videoIndex = (absHash + i) % SAMPLE_VIDEOS.length;
    const sample = SAMPLE_VIDEOS[videoIndex];
    
    // Generate dates: 1 day ago, 4 days ago, 1 week ago, 2 weeks ago, etc.
    const daysAgo = i * 3 + 1;
    const uploadDate = daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
    const views = ((absHash * (i + 1)) % 850) * 1000 + 450;
    const likes = Math.floor(views * 0.12) + 20;
    const comments = Math.floor(likes * 0.05) + 5;
    
    videos.push({
      id: `${cleanUsername}_v${i + 1}`,
      thumbnail: sample.thumbnail,
      videoUrl: sample.videoUrl,
      duration: sample.duration,
      uploadDate,
      views,
      likes,
      comments,
      caption: `[Video ${i + 1}/${availableMediaCount}] ${sample.caption} #${cleanUsername} #viral #reels`,
      type: i % 2 === 0 ? 'reel' : 'video',
      instagramUrl: `https://www.instagram.com/reel/${cleanUsername}_v${i + 1}/`
    });
  }

  // Create avatar Unsplash url
  const avatarList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80'
  ];
  const avatar = avatarList[absHash % avatarList.length];

  return {
    username: cleanUsername,
    fullName: formattedName,
    avatar,
    followers,
    following,
    postsCount,
    bio,
    verified,
    stats: {
      totalVideos,
      totalReels,
      totalPosts,
      latestUpload,
      totalAvailableMedia: availableMediaCount
    },
    videos
  };
}

export function isInstagramVideoUrl(input: string): boolean {
  const clean = input.trim().toLowerCase();
  return (
    clean.includes('/p/') ||
    clean.includes('/reel/') ||
    clean.includes('/reels/') ||
    clean.includes('/tv/')
  );
}

export function extractVideoShortcode(input: string): string | null {
  const clean = input.trim();
  try {
    const urlObj = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(p => p.length > 0);
    const index = parts.findIndex(p => p === 'p' || p === 'reel' || p === 'reels' || p === 'tv');
    if (index !== -1 && parts[index + 1]) {
      return parts[index + 1].split('?')[0];
    }
  } catch {
    // Fallback regex matching common Instagram post patterns
    const matches = clean.match(/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  return null;
}

export function generateDynamicVideoFromUrl(url: string): VideoItem {
  const shortcode = extractVideoShortcode(url) || 'dynamic_video';
  
  // Deterministic seed based on shortcode
  let hash = 0;
  for (let i = 0; i < shortcode.length; i++) {
    hash = shortcode.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  const views = (absHash % 850) * 1200 + 15400;
  const likes = Math.floor(views * 0.14) + 240;
  const comments = Math.floor(likes * 0.06) + 18;
  
  const videoIndex = absHash % SAMPLE_VIDEOS.length;
  const sample = SAMPLE_VIDEOS[videoIndex];

  return {
    id: shortcode,
    thumbnail: sample.thumbnail,
    videoUrl: sample.videoUrl,
    duration: sample.duration,
    uploadDate: '3 days ago',
    views,
    likes,
    comments,
    caption: `${sample.caption.replace(/Lost in the|Late night|Nature heals|Crashing waves|Building the/g, '✨ ')} (Video extracted successfully from shortcode: ${shortcode})`,
    type: 'reel',
    instagramUrl: url.startsWith('http') ? url : `https://${url}`
  };
}

