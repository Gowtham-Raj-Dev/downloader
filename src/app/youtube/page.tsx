'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Sparkles, Download, Copy, Check,
  ExternalLink, Play, Pause, Archive, Loader2
} from 'lucide-react';
import YoutubeHeroSection from '@/components/YoutubeHeroSection';
import LoadingState from '@/components/LoadingState';
import VideoGallery from '@/components/VideoGallery';
import PreviewModal from '@/components/PreviewModal';
import DownloadAllModal from '@/components/DownloadAllModal';
import LimitExceededModal from '@/components/LimitExceededModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import {
  isYoutubeVideoUrl,
  extractYoutubeId,
  YoutubeVideoItem
} from '@/data/youtubeData';
import { VideoItem } from '@/data/mockProfiles';
import { trackUserAction } from '@/lib/analytics';
import { useUserLimits } from '@/lib/useUserLimits';

// Custom Youtube SVG icon component
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.72.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const getEstimatedSize = (durationStr: string | undefined, quality: string, exactSizeMb?: number) => {
  if (exactSizeMb && exactSizeMb > 0) {
    let ratio = 1;
    switch (quality) {
      case '1080': ratio = 1.0; break;
      case '720': ratio = 0.65; break;
      case '480': ratio = 0.35; break;
      case '360': ratio = 0.20; break;
      default: ratio = 0.35;
    }
    return `${(exactSizeMb * ratio).toFixed(1)} MB`;
  }

  if (!durationStr) return '0.0 MB';

  const parts = durationStr.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  let bitrate = 0;
  switch (quality) {
    case '1080': bitrate = 4500; break;
    case '720': bitrate = 2500; break;
    case '480': bitrate = 1000; break;
    case '360': bitrate = 600; break;
    default: bitrate = 1000;
  }

  const sizeMb = (seconds * bitrate) / 8192;
  return `${sizeMb.toFixed(1)} MB`;
};

const fetchCobaltClientSide = async (url: string, quality: string, instances: string[] = []) => {
  let activeInstances = instances;
  if (!activeInstances || activeInstances.length === 0) {
    activeInstances = [
      "https://api.cobalt.liubquanti.click",
      "https://rue-cobalt.xenon.zone",
      "https://nuko-c.meowing.de",
      "https://melon.clxxped.lol",
      "https://cobalt.omega.wolfy.love",
      "https://lime.clxxped.lol"
    ];
  }
  
  // Shuffle instances to balance load when fetching multiple links
  const shuffled = [...activeInstances].sort(() => Math.random() - 0.5);
  
  for (const instance of shuffled) {
    try {
      // Use our backend proxy to bypass CORS restrictions on instances that don't allow browser POSTs
      const res = await fetch('/api/cobalt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, videoQuality: quality, instance }),
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          // If it's a direct YouTube CDN link, it's highly reliable.
          // Verifying it would fail due to CORS, and appending cache-busters breaks its signature.
          if (json.url.includes('googlevideo.com')) {
            return json.url;
          }

          // Verify that the returned stream is not a 0-byte dead tunnel (IP blocked by YouTube)
          try {
            const controller = new AbortController();
            const verifyRes = await fetch(json.url, { method: 'GET', signal: controller.signal });
            const cLen = verifyRes.headers.get('content-length');
            controller.abort(); // Immediately cancel the download after getting headers
            
            if (cLen === '0') {
              console.warn(`Instance ${instance} returned a 0-byte dead stream, trying next.`);
              continue;
            }
          } catch(verifyErr) {
            // If fetch fails (usually due to CORS on the tunnel endpoint), we can't verify it.
            // Do NOT skip the instance. Assume it's valid and proceed.
            console.warn(`Instance ${instance} stream verification blocked by CORS, assuming good.`);
          }
          
          // Append a cache-buster so the browser's network stack doesn't reuse the aborted socket for the actual download
          return json.url + (json.url.includes('?') ? '&' : '?') + '_cb=' + Date.now();
        }
      }
    } catch (e) {
      console.warn(`Client Cobalt fetch failed for ${instance}`);
    }
  }
  return null;
};

export default function YoutubePage() {
  const { isLoggedIn, isPremium, checkDailyLimit, incrementDailyLimit } = useUserLimits();
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [singleVideo, setSingleVideo] = useState<YoutubeVideoItem | null>(null);
  const [fetchedVideos, setFetchedVideos] = useState<YoutubeVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ZIP states
  const [zipProgress, setZipProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);

  // Modal states
  const [previewVideo, setPreviewVideo] = useState<YoutubeVideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [limitModalType, setLimitModalType] = useState<'guest' | 'free' | 'multi' | null>(null);

  // Single video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [previewVideoIndex, setPreviewVideoIndex] = useState<number>(1);
  const [isDownloadAllModalOpen, setIsDownloadAllModalOpen] = useState(false);
  const [globalQuality, setGlobalQuality] = useState<string>('1080');
  const [loadedDuration, setLoadedDuration] = useState<string>('0:00');

  // Sync player play/pause if state changes
  const togglePlaySingle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.warn("Video playback prevented:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const [selectedQuality, setSelectedQuality] = useState<string>('720');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isChangingQuality, setIsChangingQuality] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleQualityChange = async (newQuality: string) => {
    const previousQuality = selectedQuality;
    setSelectedQuality(newQuality);
    if (!singleVideo) return;

    setIsChangingQuality(true);
    try {
      const response = await fetch(`/api/youtube?url=${encodeURIComponent(singleVideo.youtubeUrl)}&quality=${newQuality}`);
      if (!response.ok) {
        throw new Error('Failed to fetch selected quality');
      }
      const result = await response.json();
      if (result.success) {
        const instances = result.data?.cobaltInstances || [];
        const clientVideoUrl = await fetchCobaltClientSide(singleVideo.youtubeUrl, newQuality, instances);
        if (!clientVideoUrl) throw new Error('Failed to extract video URL for new quality');

        setSingleVideo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            videoUrl: clientVideoUrl,
            cobaltInstances: instances
          };
        });
      } else {
        throw new Error(result.error || 'Quality unavailable');
      }
    } catch (err) {
      console.error('Error changing quality:', err);
      setError('This specific quality resolution is currently not obtainable from the servers. Falling back to previous resolution.');
      setSelectedQuality(previousQuality);
    } finally {
      setIsChangingQuality(false);
    }
  };

  const handleFetchProfile = async (inputs: string[], mediaType: 'video' | 'shorts' = 'video') => {
    if (inputs.length === 0) return;

    // Set loading states
    setActiveUsername(inputs.join(', '));
    setIsLoading(true);
    setSingleVideo(null);
    setFetchedVideos([]);
    setError(null);
    setLoadedDuration('0:00');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Identify video URLs
    let videoUrls = inputs.filter(input => isYoutubeVideoUrl(input));

    if (videoUrls.length === 0) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video or Shorts link.');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    // Check Limits
    const isMulti = videoUrls.length > 1;
    if (isMulti && !isPremium) {
      setLimitModalType('multi');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }
    
    if (!isMulti && !(await checkDailyLimit('single'))) {
      setLimitModalType(isLoggedIn ? 'free' : 'guest');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    // Secret restriction for performance/abuse. Max 500. Throttled > 200.
    if (videoUrls.length > 500) {
      videoUrls = videoUrls.slice(0, 500);
    }

    setIsLoadingBatch(true);
    setLoadingCount(videoUrls.length);

    try {
      const fetchPromises = videoUrls.map(async (url, index) => {
        // Slow down processing if more than 200 videos are being fetched
        if (index >= 200) {
          await new Promise(r => setTimeout(r, 1500 * (index - 199)));
        }

        const defaultQuality = '720'; // Hardcode default to 720 to bypass 0:00 duration bug on 1080p
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(url)}&quality=${defaultQuality}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch YouTube link: ${url}`);
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.error || `Failed to parse YouTube video: ${url}`);
        }

        const data = result.data;
        const instances = data.cobaltInstances || [];
        const clientVideoUrl = await fetchCobaltClientSide(url, defaultQuality, instances);
        
        if (!clientVideoUrl) {
          throw new Error(`Failed to extract playable video stream for: ${url}`);
        }

        const videoId = extractYoutubeId(url) || 'youtube_video';

        // Deterministic stats just like original
        let hash = 0;
        for (let i = 0; i < videoId.length; i++) {
          hash = videoId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const absHash = Math.abs(hash);
        const views = (absHash % 980) * 1540 + 24500;
        const likes = Math.floor(views * 0.08) + 380;
        const randomStr = Math.random().toString(36).substring(2, 9);

        // Fallback duration based on hash
        const fallbackDuration = mediaType === 'shorts'
          ? `0:${(absHash % 40 + 10).toString().padStart(2, '0')}` // 10s - 49s
          : `${Math.floor((absHash % 600) / 60) + 2}:${((absHash % 600) % 60).toString().padStart(2, '0')}`;

        return {
          id: `${videoId}_${randomStr}`,
          thumbnail: data.thumbnail,
          videoUrl: clientVideoUrl,
          uploadDate: 'Just now',
          views,
          likes,
          comments: 0,
          caption: `${data.title} - Shared by ${data.author}.`,
          type: mediaType === 'shorts' ? 'reel' : 'video',
          instagramUrl: url,
          youtubeUrl: url,
          title: data.title,
          author: data.author,
          duration: fallbackDuration,
          sizeMb: data.sizeMb,
          exactDuration: data.exactDuration,
          cobaltInstances: instances
        } as YoutubeVideoItem;
      });

      const results = await Promise.allSettled(fetchPromises);
      const successfulVideos: YoutubeVideoItem[] = [];
      const failedUrls: string[] = [];

      results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          successfulVideos.push(res.value);
        } else {
          failedUrls.push(videoUrls[index]);
          console.error('Error fetching individual video:', res.reason);
        }
      });

      if (successfulVideos.length > 0) {
        if (videoUrls.length === 1) {
          setSingleVideo(successfulVideos[0]);
          trackUserAction('youtube', 'single', 'fetch', 1);
          await incrementDailyLimit();
        } else {
          setFetchedVideos(successfulVideos);
          trackUserAction('youtube', 'multi', 'fetch', successfulVideos.length);
        }

        if (failedUrls.length > 0) {
          setError(`Successfully fetched ${successfulVideos.length} video(s). Failed to fetch ${failedUrls.length} link(s).`);
        }
      } else {
        setError('Failed to fetch any of the provided YouTube video URLs. Please check the links.');
        setActiveUsername(null);
      }
    } catch (err) {
      console.error('Error in multiple YouTube videos fetch:', err);
      const errMsg = err instanceof Error ? err.message : 'Error occurred while loading YouTube details.';
      setError(errMsg);
      setActiveUsername(null);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDownloadAllDirect = async () => {
    const videosToDownload = fetchedVideos.length > 0 ? fetchedVideos : [];
    if (videosToDownload.length === 0) return;

    setIsZipping(true); // reusing state for loader
    setZipProgress(0);

    let completedCount = 0;

    for (let i = 0; i < videosToDownload.length; i++) {
      const video = videosToDownload[i];
      try {
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(video.youtubeUrl || video.videoUrl)}&quality=${globalQuality}`);
        if (!response.ok) throw new Error('Network error');
        
        const result = await response.json();
        if (!result.success) throw new Error('Video metadata extraction failed');

        const instances = result.data?.cobaltInstances || video.cobaltInstances || [];
        const directDownloadUrl = await fetchCobaltClientSide(video.youtubeUrl || video.videoUrl, globalQuality, instances);
        
        if (!directDownloadUrl) throw new Error('Video stream extraction failed');

        // Native direct download
        const link = document.createElement('a');
        link.href = directDownloadUrl;
        const cleanTitle = (video.title || `youtube_video_${i + 1}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('download', `${cleanTitle}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Failed to download video ${video.id}:`, err);
        // Fallback
        window.open(video.videoUrl, '_blank');
      } finally {
        completedCount++;
        setZipProgress(Math.round((completedCount / videosToDownload.length) * 100));

        // Small delay so browser processes the download
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setIsZipping(false);
    setIsDownloadAllModalOpen(false); // Close modal when fully done
    setZipProgress(0);
    if (completedCount > 0) {
      trackUserAction('youtube', 'multi', 'download', completedCount);
    }
  };

  const handleReset = () => {
    setActiveUsername(null);
    setSingleVideo(null);
    setFetchedVideos([]);
    setIsLoading(false);
    setIsPlaying(false);
    setError(null);
    setIsZipping(false);
    setZipProgress(0);
    setLoadedDuration('0:00');
  };

  const handleOpenPreview = (video: VideoItem) => {
    setPreviewVideo(video as YoutubeVideoItem);
    const videosList = fetchedVideos.length > 0 ? fetchedVideos : [];
    const idx = videosList.findIndex(v => v.id === video.id);
    setPreviewVideoIndex(idx !== -1 ? idx + 1 : 1);
    setIsModalOpen(true);
  };

  const handleCopySingleLink = async () => {
    if (!singleVideo) return;
    try {
      await navigator.clipboard.writeText(singleVideo.youtubeUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Direct download that fetches the full Blob to ensure correct file metadata is written on mobile
  const handleDirectDownload = async (quality: string) => {
    if (!singleVideo) return;
    setIsDownloading(true);
    setDownloadingQuality(quality);
    setDownloadProgress(20); // visual indicator
    try {
      const response = await fetch(`/api/youtube?url=${encodeURIComponent(singleVideo.youtubeUrl)}&quality=${quality}`);
      const result = await response.json();
      if (result.success) {
        const instances = result.data?.cobaltInstances || singleVideo.cobaltInstances || [];
        const directDownloadUrl = await fetchCobaltClientSide(singleVideo.youtubeUrl, quality, instances);
        
        if (!directDownloadUrl) {
          alert('Failed to extract ' + quality + 'p video stream.');
          return;
        }

        setDownloadProgress(100);
        
        // Native download approach: avoids 0 duration blob bugs on iOS/Android
        const a = document.createElement('a');
        a.href = directDownloadUrl;
        const cleanTitle = (singleVideo.title || 'youtube_video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.setAttribute('download', `${cleanTitle}.mp4`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        trackUserAction('youtube', 'single', 'download', 1);
      } else {
        alert('Failed to extract ' + quality + 'p video.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching video quality.');
    } finally {
      setIsDownloading(false);
      setDownloadingQuality(null);
      setDownloadProgress(0);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDownloadVideo = (video: YoutubeVideoItem) => {
    window.location.assign(video.videoUrl);
    const type = fetchedVideos.length > 0 ? 'multi' : 'single';
    trackUserAction('youtube', type, 'download', 1);
  };



  const displayDuration = singleVideo?.exactDuration
    ? singleVideo.exactDuration
    : (loadedDuration !== '0:00' ? loadedDuration : (singleVideo?.duration || null));

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-red-500/20 selection:text-red-600 dark:selection:text-red-500">

      {/* Unified Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col items-center py-6">

        <AnimatePresence mode="wait">
          <div className="w-full flex flex-col items-center">

            {/* SEARCH / HERO STATE */}
            {!activeUsername && !isLoading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <Suspense fallback={<div className="w-full text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500 mb-4"/><p className="text-sm text-neutral-500 font-medium">Loading...</p></div>}>
                  <YoutubeHeroSection onFetch={handleFetchProfile} isLoading={isLoading} error={error} />
                </Suspense>

                {/* Feature Highlights */}
                <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">No Login Required</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Extract and download public YouTube videos instantly without needing passwords or authorization.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Single Video Extractor</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Paste any video or shorts link to fetch details, play the media, and trigger direct downloads instantly.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-3">
                      <Youtube className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Multiple Links Extractor</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Paste multiple YouTube links at once to extract and download all videos individually.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOADING STATE */}
            {activeUsername && isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <LoadingState isBatch={isLoadingBatch} count={loadingCount} />
              </motion.div>
            )}

            {/* MULTIPLE VIDEOS EXTRACTION STATE */}
            {!isLoading && fetchedVideos.length > 0 && (
              <motion.div
                key="multiple-videos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                {/* Back breadcrumb for mobile */}
                <div className="w-full max-w-6xl px-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-button bg-neutral-100 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/30 cursor-pointer self-start sm:self-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Search</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <select
                      value={globalQuality}
                      onChange={(e) => setGlobalQuality(e.target.value)}
                      disabled={isZipping}
                      className="px-3 py-2 pr-8 text-xs font-bold rounded-button bg-neutral-100 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 cursor-pointer outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-center shadow-sm"
                    >
                      <option value="720">720p HD MP4</option>
                      <option value="480">480p MP4</option>
                      <option value="360">360p MP4</option>
                    </select>

                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined' && localStorage.getItem('hasSeenDownloadAllPopup')) {
                          executeDownloadAllDirect();
                        } else {
                          setIsDownloadAllModalOpen(true);
                        }
                      }}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-bold text-xs rounded-button shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-80 cursor-pointer"
                    >
                      {isZipping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{isZipping ? `Downloading ${zipProgress}%...` : 'Download All (Direct)'}</span>
                    </button>
                  </div>
                </div>

                {/* Header Summary Card */}
                <div className="glass-panel w-full max-w-6xl mx-auto p-6 rounded-outer mb-8 border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-950">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
                      <Archive className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">
                        Multiple Video Manager
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Successfully fetched {fetchedVideos.length} YouTube videos. Click <span className="font-bold text-red-500">Download All</span> to automatically save all videos to your device.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Media Grid */}
                <VideoGallery videos={fetchedVideos} onPreview={handleOpenPreview} hideFilters={true} />
              </motion.div>
            )}

            {/* SINGLE VIDEO EXTRACTION STATE */}
            {!isLoading && singleVideo && (
              <motion.div
                key="single-video-details"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl px-4 mt-4"
              >
                {/* Back to search */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-button bg-neutral-100 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/30 mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Search Another Link</span>
                </button>

                {/* High fidelity video container */}
                <div className="glass-panel border border-neutral-200/60 dark:border-neutral-800/30 rounded-outer overflow-hidden shadow-2xl flex flex-col md:flex-row bg-white dark:bg-zinc-950">

                  {/* Left: Video Player */}
                  <div className={`relative flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[500px] ${singleVideo.type === 'reel' ? 'aspect-[4/5]' : 'aspect-video w-full'}`}>
                    <video
                      ref={videoRef}
                      src={singleVideo.videoUrl}
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={togglePlaySingle}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={(e) => {
                        const seconds = Math.floor(e.currentTarget.duration);
                        if (!isNaN(seconds) && seconds > 0) {
                          const m = Math.floor(seconds / 60);
                          const s = seconds % 60;
                          setLoadedDuration(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                        }
                      }}
                      {...({ referrerPolicy: "no-referrer" } as React.HTMLProps<HTMLVideoElement>)}
                    />
                    {/* Dark overlay & play button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                      <button
                        onClick={togglePlaySingle}
                        className="p-3 rounded-full bg-white text-black hover:scale-105 transition-all shadow-lg cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                      </button>
                    </div>
                  </div>

                  {/* Right: Video Metadata */}
                  <div className="w-full md:w-[320px] p-6 flex flex-col justify-between bg-neutral-50/50 dark:bg-zinc-900/20 border-t md:border-t-0 md:border-l border-neutral-200/40 dark:border-neutral-800/40">
                    <div className="space-y-6">
                      <div>
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider mb-2">
                          {singleVideo.type === 'reel' ? 'YouTube Short' : 'YouTube Video'}
                        </span>
                        <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                          Media Found
                        </h3>
                        <span className="text-[10px] font-semibold font-mono text-neutral-400 dark:text-neutral-500">
                          ID: {singleVideo.id}
                        </span>
                      </div>

                      {/* Caption */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                          Description
                        </span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-32 overflow-y-auto select-text pr-1">
                          {singleVideo.caption}
                        </p>
                      </div>

                      {/* Channel / Author Name */}
                      {singleVideo.author && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                            Uploader Channel
                          </span>
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-zinc-950 border border-neutral-200/40 dark:border-neutral-800/60 py-2.5 px-3 rounded-button">
                            {singleVideo.author}
                          </p>
                        </div>
                      )}


                    </div>

                    {/* Download section */}
                    <div className="mt-8 space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopySingleLink}
                          className="flex-1 py-2.5 rounded-button bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all border border-neutral-200/40 dark:border-neutral-800/60 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={singleVideo.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-button bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/40 dark:border-neutral-800/60 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex flex-col gap-2 mt-4">
                        <button
                          onClick={() => handleDirectDownload('720')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold text-[12px] flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                        >
                          <div className="flex items-center gap-1.5">
                            {downloadingQuality === '720' ? (
                              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>{downloadingQuality === '720' ? 'Downloading...' : '720p HD MP4'}</span>
                          </div>
                          <span className="text-[9px] font-medium opacity-80">(Perfect Mobile Duration)</span>
                        </button>
                        
                        <button
                          onClick={() => handleDirectDownload('360')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-neutral-800 text-white font-bold text-[12px] flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-md hover:bg-neutral-700 transition-all disabled:opacity-50"
                        >
                          <div className="flex items-center gap-1.5">
                            {downloadingQuality === '360' ? (
                              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>{downloadingQuality === '360' ? 'Downloading...' : 'Mobile Compatible 360p'}</span>
                          </div>
                          <span className="text-[9px] font-medium opacity-80">(Perfect Duration, Low Quality)</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

          </div>
        </AnimatePresence>

        {/* Netflix style Modal Player */}
        <PreviewModal
          video={previewVideo}
          videoIndex={previewVideoIndex}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        {/* Download All Instructions Modal */}
        <DownloadAllModal
          isOpen={isDownloadAllModalOpen}
          videoCount={fetchedVideos.length}
          onConfirm={executeDownloadAllDirect}
          onClose={() => setIsDownloadAllModalOpen(false)}
        />

        {/* Full Screen Centered Download Progress Overlay */}
        <AnimatePresence>
          {isZipping && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="relative bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-outer shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center z-10"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Download className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Downloading All Videos</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Please keep this window open while we process your request...</p>
                
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden relative mb-2">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${zipProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  {zipProgress}% Complete
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <LimitExceededModal
          isOpen={!!limitModalType}
          onClose={() => setLimitModalType(null)}
          type={limitModalType}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
