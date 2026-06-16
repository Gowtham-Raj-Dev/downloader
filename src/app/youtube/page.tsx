'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Sparkles, Download, Copy, Check,
  ExternalLink, Play, Pause, Archive
} from 'lucide-react';
import YoutubeHeroSection from '@/components/YoutubeHeroSection';
import LoadingState from '@/components/LoadingState';
import VideoGallery from '@/components/VideoGallery';
import PreviewModal from '@/components/PreviewModal';
import DownloadAllModal from '@/components/DownloadAllModal';
import LimitExceededModal from '@/components/LimitExceededModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [previewVideoIndex, setPreviewVideoIndex] = useState<number>(1);
  const [isDownloadAllModalOpen, setIsDownloadAllModalOpen] = useState(false);

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

  const [selectedQuality, setSelectedQuality] = useState<string>('1080');
  const [isChangingQuality, setIsChangingQuality] = useState<boolean>(false);

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
      if (result.success && result.data?.videoUrl) {
        setSingleVideo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            videoUrl: result.data.videoUrl
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Identify video URLs
    let videoUrls = inputs.filter(input => isYoutubeVideoUrl(input));

    // STRICTLY enforce shorts only
    const nonShortUrls = videoUrls.filter(url => !url.toLowerCase().includes('/shorts/'));
    if (nonShortUrls.length > 0) {
      setError('Normal YouTube Videos are not supported due to server limits. Please paste only YouTube Shorts links.');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    if (videoUrls.length === 0) {
      setError('Invalid YouTube Shorts URL. Please enter a valid Shorts link.');
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

        const defaultQuality = mediaType === 'video' ? '720' : '1080';
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(url)}&quality=${defaultQuality}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch YouTube link: ${url}`);
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.error || `Failed to parse YouTube video: ${url}`);
        }

        const data = result.data;
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

        return {
          id: `${videoId}_${randomStr}`,
          thumbnail: data.thumbnail,
          videoUrl: data.videoUrl,
          uploadDate: 'Just now',
          views,
          likes,
          comments: 0,
          caption: `${data.title} - Shared by ${data.author}.`,
          type: mediaType === 'shorts' ? 'reel' : 'video',
          instagramUrl: url,
          youtubeUrl: url,
          title: data.title,
          author: data.author
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
        const response = await fetch(video.videoUrl);
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        
        const cleanTitle = (video.title || `youtube_video_${i+1}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('download', `${cleanTitle}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
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

  // Direct download that fetches quality and opens URL to prevent 0B blob issues
  const handleDirectDownload = async (quality: string) => {
    if (!singleVideo) return;
    setIsDownloading(true);
    setDownloadProgress(50); // visual indicator
    try {
      const response = await fetch(`/api/youtube?url=${encodeURIComponent(singleVideo.youtubeUrl)}&quality=${quality}`);
      const result = await response.json();
      if (result.success && result.data?.videoUrl) {
         window.location.assign(result.data.videoUrl);
         trackUserAction('youtube', 'single', 'download', 1);
      } else {
         alert('Failed to extract ' + quality + 'p video.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching video quality.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadVideo = (video: YoutubeVideoItem) => {
    window.location.assign(video.videoUrl);
    const type = fetchedVideos.length > 0 ? 'multi' : 'single';
    trackUserAction('youtube', type, 'download', 1);
  };



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
                <YoutubeHeroSection onFetch={handleFetchProfile} isLoading={isLoading} error={error} />

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
                <div className="w-full max-w-6xl px-4 mb-4 flex justify-between items-center">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-button bg-neutral-100 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/30 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Search</span>
                  </button>

                    <button
                      onClick={() => setIsDownloadAllModalOpen(true)}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-bold text-xs rounded-button shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-80 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isZipping ? `Downloading ${zipProgress}%...` : 'Download All (Direct)'}</span>
                    </button>
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
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={togglePlaySingle}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
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

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          onClick={() => handleDirectDownload('1080')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>1080p MP4</span>
                        </button>
                        <button
                          onClick={() => handleDirectDownload('720')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>720p MP4</span>
                        </button>
                        <button
                          onClick={() => handleDirectDownload('480')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-neutral-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:bg-neutral-700 transition-all disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>480p MP4</span>
                        </button>
                        <button
                          onClick={() => handleDirectDownload('360')}
                          disabled={isDownloading}
                          className="w-full py-2.5 rounded-button bg-neutral-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:bg-neutral-700 transition-all disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>360p MP4</span>
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
