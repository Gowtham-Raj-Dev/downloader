'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Compass, MessageCircle, User, LogOut, Lock, Check, 
  Download, Eye, Heart, MessageSquare, Play, Pause, Search, 
  Loader2, ExternalLink, RefreshCw, Monitor, AlertCircle, Link as LinkIcon, Clipboard
} from 'lucide-react';
import { VideoItem, generateDynamicVideoFromUrl, isInstagramVideoUrl } from '../data/mockProfiles';

interface InstaConnectProps {
  onPreview: (video: VideoItem) => void;
  onDirectDownload: (video: VideoItem) => void;
}

interface MockPost {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
  type: 'reel' | 'video';
  videoUrl: string;
  thumbnail: string;
  likes: number;
  comments: number;
  caption: string;
  timeAgo: string;
}

const MOCK_POSTS: MockPost[] = [
  {
    id: 'mock_c1',
    username: 'space_odyssey',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    verified: true,
    type: 'reel',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    likes: 84200,
    comments: 1450,
    caption: 'Orbiting Earth at 27,600 km/h. The view from the cupola is absolutely mesmerizing 🌌🌍 #space #earth #iss #nature',
    timeAgo: '4 hours ago'
  },
  {
    id: 'mock_c2',
    username: 'creative_coder',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    verified: false,
    type: 'video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    likes: 12400,
    comments: 482,
    caption: 'Refactoring a complex state machine on a Friday evening. Code runs clean! 💻🚀 #javascript #react #webdev #programming',
    timeAgo: '1 day ago'
  },
  {
    id: 'mock_c3',
    username: 'ocean_breeze',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    verified: false,
    type: 'reel',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
    likes: 35100,
    comments: 890,
    caption: 'Secret beaches and golden hours. Exploring the wild coastlines of Bali 🌊🏖️ #travel #ocean #bali #explore',
    timeAgo: '2 days ago'
  },
  {
    id: 'mock_c4',
    username: 'sound_of_vinyl',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    verified: true,
    type: 'reel',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=600&q=80',
    likes: 92800,
    comments: 3100,
    caption: 'Nothing matches the warm crackle of dynamic analog records. Spinning classics today 🎶🎛️ #vinyl #retro #vintage',
    timeAgo: '3 days ago'
  }
];

export default function InstaConnect({ onPreview, onDirectDownload }: InstaConnectProps) {
  // Login flow states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginStep, setLoginStep] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingText, setLoadingText] = useState('');

  // Sidebar / Section states
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'explore' | 'direct'>('feed');

  // Direct paste download state
  const [directUrl, setDirectUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedVideo, setExtractedVideo] = useState<VideoItem | null>(null);

  // Copied feed feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Simulated browser popups
  const openRealInstagram = () => {
    window.open('https://www.instagram.com', 'InstagramPopup', 'width=1000,height=800,scrollbars=yes,resizable=yes');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setLoginStep('loading');
    const texts = [
      'Establishing secure TLS handshake with Instagram APIs...',
      'Injecting temporary session cookies (Sandbox Mode)...',
      'Configuring dynamic browser headers...',
      'Bypassing Two-Factor Authentication protocols...',
      'Connection authorized! Syncing your Instagram feed...'
    ];

    let current = 0;
    setLoadingText(texts[0]);
    const interval = setInterval(() => {
      current++;
      if (current < texts.length) {
        setLoadingText(texts[current]);
      } else {
        clearInterval(interval);
        setLoginStep('success');
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 800);
      }
    }, 900);
  };

  const handleDirectPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDirectUrl(text);
    } catch (err) {
      console.warn('Failed to read clipboard text: ', err);
    }
  };

  const handleExtractVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim() || !isInstagramVideoUrl(directUrl)) {
      alert('Please enter a valid Instagram video or reel URL!');
      return;
    }

    setIsExtracting(true);
    setExtractedVideo(null);

    setTimeout(() => {
      const video = generateDynamicVideoFromUrl(directUrl);
      setExtractedVideo(video);
      setIsExtracting(false);
    }, 1800);
  };

  const handleFeedCopy = async (id: string, igUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(igUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedDownload = async (item: MockPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadingId) return;
    setDownloadingId(item.id);

    const video: VideoItem = {
      id: item.id,
      thumbnail: item.thumbnail,
      videoUrl: item.videoUrl,
      duration: '0:30',
      uploadDate: item.timeAgo,
      views: item.likes * 6,
      likes: item.likes,
      comments: item.comments,
      caption: item.caption,
      type: item.type,
      instagramUrl: `https://www.instagram.com/reel/${item.id}/`
    };

    try {
      await onDirectDownload(video);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreviewMockPost = (item: MockPost) => {
    const video: VideoItem = {
      id: item.id,
      thumbnail: item.thumbnail,
      videoUrl: item.videoUrl,
      duration: '0:30',
      uploadDate: item.timeAgo,
      views: item.likes * 6,
      likes: item.likes,
      comments: item.comments,
      caption: item.caption,
      type: item.type,
      instagramUrl: `https://www.instagram.com/reel/${item.id}/`
    };
    onPreview(video);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginStep('idle');
    setUsernameInput('');
    setPasswordInput('');
    setExtractedVideo(null);
    setDirectUrl('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-2 mb-12">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* LOGIN GATE SCREEN */
          <motion.div
            key="login-gate"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-md mx-auto glass-panel p-8 rounded-outer border border-neutral-200/50 dark:border-neutral-800/30 shadow-premium dark:shadow-premium-dark text-center"
          >
            {loginStep === 'loading' ? (
              /* CONNECTING SPINNER STATE */
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-12 h-12 text-instagram-pink animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">Connecting Portal</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[280px] mx-auto leading-relaxed animate-pulse">
                    {loadingText}
                  </p>
                </div>
              </div>
            ) : loginStep === 'success' ? (
              /* SUCCESS STATE */
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100">Welcome Back!</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    Secure session established for @{usernameInput}
                  </p>
                </div>
              </div>
            ) : (
              /* IDLE STATE: THE FORM */
              <>
                <div className="w-12 h-12 rounded-full bg-instagram-pink/10 text-instagram-pink flex items-center justify-center mx-auto mb-4 border border-instagram-pink/20">
                  <Lock className="w-5 h-5" />
                </div>
                
                <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-2">
                  InstaConnect Sandbox
                </h2>
                
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed max-w-sm mx-auto">
                  Log in securely using a virtual mock session to browse your personal feed directly here and download videos with one click.
                </p>

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Instagram Username
                    </label>
                    <input
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. gowtham_insta"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink/50 text-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink/50 text-neutral-800 dark:text-neutral-200"
                    />
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-3 rounded-card text-[10px] leading-relaxed flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Educational Note:</strong> This is a secure sandbox simulator. We do not store or transmit your password. You can enter any mock username/password to log in.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange text-white font-bold rounded-button text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all cursor-pointer text-center"
                  >
                    Establish Virtual Login
                  </button>
                </form>
              </>
            )}
          </motion.div>
        ) : (
          /* INSTAGRAM BROWSER WEB CLIENT UI */
          <motion.div
            key="instagram-client"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full glass-panel border border-neutral-200/50 dark:border-neutral-800/30 rounded-outer overflow-hidden shadow-2xl flex flex-col md:flex-row h-[78vh] min-h-[500px]"
          >
            {/* LEFT BAR: MOCK INSTAGRAM MENU */}
            <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-50/50 dark:bg-zinc-950/20 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                {/* Brand Header */}
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange flex items-center justify-center text-white text-xs font-bold font-mono">
                    IC
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 leading-none">InstaConnect</h3>
                    <span className="text-[9px] text-green-500 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Sandbox Active
                    </span>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('feed')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-xs font-bold transition-all cursor-pointer ${activeTab === 'feed' ? 'bg-neutral-100 dark:bg-neutral-900 text-instagram-pink dark:text-instagram-orange border border-neutral-200/30 dark:border-neutral-800/30' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Simulated Feed</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reels')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-xs font-bold transition-all cursor-pointer ${activeTab === 'reels' ? 'bg-neutral-100 dark:bg-neutral-900 text-instagram-pink dark:text-instagram-orange border border-neutral-200/30 dark:border-neutral-800/30' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch Reels</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-xs font-bold transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-neutral-100 dark:bg-neutral-900 text-instagram-pink dark:text-instagram-orange border border-neutral-200/30 dark:border-neutral-800/30' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Feed</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('direct')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-xs font-bold transition-all cursor-pointer ${activeTab === 'direct' ? 'bg-neutral-100 dark:bg-neutral-900 text-instagram-pink dark:text-instagram-orange border border-neutral-200/30 dark:border-neutral-800/30' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Workspace Helper</span>
                  </button>
                </nav>
              </div>

              {/* Connected User Profile Indicator */}
              <div className="pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40 space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-instagram-pink/10 text-instagram-pink flex items-center justify-center border border-instagram-pink/20 font-bold text-xs uppercase">
                    {usernameInput.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate leading-none">
                      @{usernameInput}
                    </p>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                      Sandbox Member
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-button bg-neutral-100 dark:bg-neutral-900 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 text-neutral-600 dark:text-neutral-400 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200/20 dark:border-neutral-800/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Sandbox</span>
                </button>
              </div>
            </div>

            {/* RIGHT MAIN PANEL */}
            <div className="flex-1 bg-white dark:bg-zinc-950 flex flex-col justify-between overflow-y-auto">
              
              {/* Top Quick Downloader Header bar */}
              <div className="px-6 py-3 border-b border-neutral-200/40 dark:border-neutral-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/40 dark:bg-zinc-950/20 sticky top-0 z-10 backdrop-blur-md">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-instagram-pink" />
                  Direct Video Downloader
                </span>
                
                <div className="w-full sm:max-w-md flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      value={directUrl}
                      onChange={(e) => setDirectUrl(e.target.value)}
                      placeholder="Paste reel link (e.g. instagram.com/reel/...)"
                      className="w-full pl-3 pr-16 py-1.5 bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-instagram-pink text-neutral-800 dark:text-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={handleDirectPaste}
                      className="absolute right-1 text-[9px] font-bold px-2 py-1 bg-neutral-250/60 dark:bg-neutral-800/60 rounded text-neutral-600 dark:text-neutral-300 hover:text-instagram-pink cursor-pointer"
                    >
                      Paste
                    </button>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (directUrl.trim()) {
                        setActiveTab('direct');
                        handleExtractVideo(e);
                      }
                    }}
                    disabled={!directUrl.trim()}
                    className="px-3 py-1.5 bg-gradient-to-r from-instagram-purple to-instagram-orange text-white text-[11px] font-bold rounded cursor-pointer disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Feed Content Area */}
              <div className="flex-1 p-6">
                <AnimatePresence mode="wait">
                  
                  {/* SIMULATED INSTAGRAM FEED */}
                  {activeTab === 'feed' && (
                    <motion.div
                      key="simulated-feed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-w-md mx-auto space-y-8"
                    >
                      {MOCK_POSTS.map((post) => (
                        <div 
                          key={post.id} 
                          className="border border-neutral-200/50 dark:border-neutral-800/40 rounded-card overflow-hidden bg-neutral-50/20 dark:bg-zinc-950/10 shadow-sm"
                        >
                          {/* Post Header */}
                          <div className="p-3.5 flex items-center justify-between border-b border-neutral-200/30 dark:border-neutral-800/20">
                            <div className="flex items-center gap-2.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full object-cover border border-neutral-200/60 dark:border-neutral-800/30" />
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:underline cursor-pointer">
                                    {post.username}
                                  </span>
                                  {post.verified && (
                                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[7px] font-extrabold select-none">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-neutral-400 font-medium">{post.timeAgo}</span>
                              </div>
                            </div>
                          </div>

                          {/* Post Image/Video Container */}
                          <div 
                            className="relative aspect-square bg-neutral-950 flex items-center justify-center group cursor-pointer"
                            onClick={() => handlePreviewMockPost(post)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.thumbnail} alt="Post content" className="w-full h-full object-cover group-hover:brightness-95 transition-all select-none" />
                            
                            {/* Hover Play icon overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-5 h-5 fill-white" />
                              </div>
                            </div>

                            <span className="absolute bottom-3 right-3 bg-black/60 text-[9px] font-bold px-1.5 py-0.5 rounded text-white border border-white/10 select-none">
                              {post.type.toUpperCase()}
                            </span>
                          </div>

                          {/* Actions Area */}
                          <div className="p-4 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
                                <span className="flex items-center gap-1 text-xs font-semibold">
                                  <Heart className="w-4 h-4 text-red-500 fill-red-500/10" />
                                  {post.likes.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-xs font-semibold">
                                  <MessageSquare className="w-4 h-4 text-blue-500" />
                                  {post.comments}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => handleFeedCopy(post.id, `https://www.instagram.com/p/${post.id}/`, e)}
                                  className="p-1.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors border border-neutral-200/40 dark:border-neutral-800/40 relative cursor-pointer"
                                  title="Copy Link"
                                >
                                  {copiedId === post.id ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <LinkIcon className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) => handleFeedDownload(post, e)}
                                  disabled={downloadingId !== null}
                                  className="p-1.5 rounded bg-gradient-to-tr from-instagram-purple to-instagram-orange text-white hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
                                  title="Download Video"
                                >
                                  {downloadingId === post.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Download className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200 mr-1.5">
                                {post.username}
                              </span>
                              {post.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* REELS VIEW */}
                  {activeTab === 'reels' && (
                    <motion.div
                      key="reels-feed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-w-[350px] mx-auto aspect-[9/16] bg-neutral-950 rounded-card overflow-hidden border border-neutral-800 shadow-2xl relative"
                    >
                      {/* Standard Reels background (using first mock video as reference) */}
                      <video
                        src={MOCK_POSTS[0].videoUrl}
                        loop
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {/* Header bar on video */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-white">
                        <span className="text-xs font-bold tracking-wider">Reels</span>
                        <Play className="w-4 h-4 fill-white animate-pulse" />
                      </div>

                      {/* Video Sidebar Controls overlay */}
                      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-5 text-white z-10">
                        <div className="flex flex-col items-center cursor-pointer">
                          <div className="p-2.5 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 mb-1">
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </div>
                          <span className="text-[10px] font-bold">142K</span>
                        </div>

                        <div className="flex flex-col items-center cursor-pointer">
                          <div className="p-2.5 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 mb-1">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold">3.2K</span>
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            const post = MOCK_POSTS[0];
                            handleFeedDownload(post, e);
                          }}
                          className="flex flex-col items-center cursor-pointer text-white"
                        >
                          <div className="p-2.5 bg-gradient-to-tr from-instagram-purple to-instagram-orange hover:scale-105 rounded-full mb-1 shadow-md">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[10px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-instagram-pink to-instagram-orange">
                            Save
                          </span>
                        </div>
                      </div>

                      {/* Bottom details overlay */}
                      <div className="absolute bottom-4 left-4 right-16 text-white z-10 space-y-2">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={MOCK_POSTS[0].avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                          <span className="text-xs font-bold">@{MOCK_POSTS[0].username}</span>
                          <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded font-semibold border border-white/10">Follow</span>
                        </div>
                        <p className="text-[11px] text-neutral-200 line-clamp-2 leading-relaxed">
                          {MOCK_POSTS[0].caption}
                        </p>
                      </div>

                      {/* Dark gradient shadow bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                    </motion.div>
                  )}

                  {/* EXPLORE GRID VIEW */}
                  {activeTab === 'explore' && (
                    <motion.div
                      key="explore-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    >
                      {MOCK_POSTS.concat(MOCK_POSTS).map((item, idx) => (
                        <div
                          key={`${item.id}_${idx}`}
                          onClick={() => handlePreviewMockPost(item)}
                          className="group relative aspect-square bg-neutral-900 rounded-card overflow-hidden border border-neutral-200/40 dark:border-neutral-800/40 shadow-soft cursor-pointer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none" />
                          
                          {/* Hover stat details */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold select-none">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4 fill-white" />
                              {(item.likes / 1000).toFixed(0)}K
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4 fill-white" />
                              {item.comments}
                            </span>
                          </div>

                          <span className="absolute top-2 left-2 bg-black/60 text-[8px] font-bold px-1 py-0.5 rounded text-white border border-white/10 uppercase">
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* WORKSPACE HELPER (SPLIT SCREEN INTEGRATION) */}
                  {activeTab === 'direct' && (
                    <motion.div
                      key="workspace-helper"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Split layout info box */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Left instructions panel */}
                        <div className="md:col-span-5 bg-neutral-50 dark:bg-zinc-900/40 p-5 rounded-card border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="p-2 bg-instagram-pink/10 text-instagram-pink rounded-lg w-fit border border-instagram-pink/20">
                              <Monitor className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                              Dual-Window Explorer Assistant
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                              Security constraints restrict logging in to external services directly within frame modules. Use our Split Workspace helper:
                            </p>
                            
                            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2.5 font-medium">
                              <li className="flex items-start gap-2">
                                <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                <span>Click below to open Instagram in a separate window.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                <span>Find the Reel or Post you want to download.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                                <span>Click <strong>Share</strong> (or triple dot menu) and choose <strong>Copy Link</strong>.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                                <span>Paste the URL on the right panel to extract and download instantly!</span>
                              </li>
                            </ul>
                          </div>

                          <button
                            onClick={openRealInstagram}
                            className="mt-6 w-full py-2.5 px-4 rounded-button bg-neutral-800 hover:bg-neutral-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/30 shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Launch Instagram Web Popup</span>
                          </button>
                        </div>

                        {/* Right live paste & extractor card */}
                        <div className="md:col-span-7 flex flex-col justify-start">
                          <div className="glass-panel p-6 rounded-card border border-neutral-200/50 dark:border-neutral-800/30 flex-1 space-y-5">
                            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                              Link Extractor Console
                            </h3>

                            <div className="space-y-3">
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  value={directUrl}
                                  onChange={(e) => setDirectUrl(e.target.value)}
                                  placeholder="https://www.instagram.com/reel/C7-cXXXXX/"
                                  className="w-full pl-4 pr-24 py-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-button text-xs focus:outline-none focus:ring-1 focus:ring-instagram-pink text-neutral-800 dark:text-neutral-200"
                                />
                                <button
                                  type="button"
                                  onClick={handleDirectPaste}
                                  className="absolute right-3 px-2 py-1 rounded text-[10px] font-bold bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                                >
                                  Paste Link
                                </button>
                              </div>

                              <button
                                onClick={handleExtractVideo}
                                disabled={isExtracting || !directUrl.trim()}
                                className="w-full py-3 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange text-white font-bold text-xs rounded-button shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                {isExtracting ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Extracting Video Details...</span>
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Extract & Fetch Media</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Extracted Video Result preview */}
                            <AnimatePresence mode="wait">
                              {extractedVideo && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="bg-neutral-50/50 dark:bg-zinc-900/40 p-4 rounded-card border border-neutral-200/50 dark:border-neutral-800/30 flex items-start gap-3"
                                >
                                  {/* Media Thumbnail with play tag */}
                                  <div 
                                    className="relative w-20 h-24 rounded-md overflow-hidden bg-neutral-950 shrink-0 border border-neutral-200/40 dark:border-neutral-800/60 cursor-pointer group"
                                    onClick={() => onPreview(extractedVideo)}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={extractedVideo.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                      <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                  </div>

                                  {/* Details content */}
                                  <div className="flex-1 space-y-1.5 min-w-0">
                                    <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                                      Ready for download
                                    </span>
                                    <p className="text-xs text-neutral-800 dark:text-neutral-200 font-bold truncate">
                                      Reel Code: {extractedVideo.id}
                                    </p>
                                    <p className="text-[10px] text-neutral-500 leading-relaxed line-clamp-2 pr-1 select-text">
                                      {extractedVideo.caption}
                                    </p>

                                    {/* Download button */}
                                    <button
                                      onClick={() => onDirectDownload(extractedVideo)}
                                      className="py-1.5 px-3 rounded bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Download Video</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
