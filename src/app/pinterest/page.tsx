'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Sparkles, Download, Copy, Check,
  ExternalLink, Play, Pause, Archive
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import LoadingState from '@/components/LoadingState';
import VideoGallery from '@/components/VideoGallery';
import PreviewModal from '@/components/PreviewModal';
import DownloadAllModal from '@/components/DownloadAllModal';
import LimitExceededModal from '@/components/LimitExceededModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  isPinterestVideoUrl,
  extractVideoShortcode,
  VideoItem
} from '@/data/mockProfiles';
import { trackUserAction } from '@/lib/analytics';
import { useUserLimits } from '@/lib/useUserLimits';

// Custom Pinterest SVG icon component
const Pinterest = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z"/>
  </svg>
);

export default function PinterestPage() {
  const { isLoggedIn, isPremium, checkDailyLimit, incrementDailyLimit } = useUserLimits();
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [singleVideo, setSingleVideo] = useState<VideoItem | null>(null);
  const [fetchedVideos, setFetchedVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ZIP states
  const [zipProgress, setZipProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);

  // Modal states
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [limitModalType, setLimitModalType] = useState<'guest' | 'free' | 'multi' | null>(null);

  // Single video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [downloadProgress, setDownloadProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleFetchProfile = async (inputs: string[]) => {
    if (inputs.length === 0) return;

    // Set loading states
    setActiveUsername(inputs.join(', '));
    setIsLoading(true);
    setSingleVideo(null);
    setFetchedVideos([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Identify video URLs
    let videoUrls = inputs.filter(input => isPinterestVideoUrl(input));

    if (videoUrls.length === 0) {
      setError('Invalid Pinterest Video or Reel URL. Please enter a valid Pinterest video link.');
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

    // Limit to 200 videos array logic has been modified to handle throttling
    // But we still don't want > 200 to freeze the browser simultaneously
    // If premium, allow up to 500 but throttle > 200. Let's slice at 500.
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

        const response = await fetch(`/api/pinterest?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${url}`);
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.error || `Failed to parse video: ${url}`);
        }

        const media = result.data.media_details[0];
        const postInfo = result.data.post_info || {};

        const shortcode = extractVideoShortcode(url) || 'video';
        const randomId = Math.random().toString(36).substring(2, 9);
        const proxiedThumbnail = media.thumbnail || '';

        return {
          id: `${shortcode}_${randomId}`,
          thumbnail: proxiedThumbnail,
          videoUrl: media.url || '',
          duration: media.duration_s ? `${Math.floor(media.duration_s / 60)}:${String(Math.round(media.duration_s % 60)).padStart(2, '0')}` : '0:15',
          views: media.video_view_count || 0,
          likes: postInfo.likes || 0,
          comments: 0,
          caption: postInfo.caption || '',
          type: 'video',
          pinterestUrl: url,
          uploadDate: 'Just now'
        } as VideoItem;
      });

      const results = await Promise.allSettled(fetchPromises);
      const successfulVideos: VideoItem[] = [];
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
          trackUserAction('pinterest', 'single', 'fetch', 1);
          await incrementDailyLimit();
        } else {
          setFetchedVideos(successfulVideos);
          trackUserAction('pinterest', 'multi', 'fetch', successfulVideos.length);
        }

        if (failedUrls.length > 0) {
          setError(`Successfully fetched ${successfulVideos.length} video(s). Failed to fetch ${failedUrls.length} link(s).`);
        }
      } else {
        setError('Failed to fetch any of the provided Pinterest video URLs. Please check the links.');
        setActiveUsername(null);
      }
    } catch (err) {
      console.error('Error in multiple videos fetch:', err);
      const errMsg = err instanceof Error ? err.message : 'Error occurred while loading video details.';
      setError(errMsg);
      setActiveUsername(null);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDownloadAllDirect = async () => {
    const videosToDownload = fetchedVideos.length > 0 ? fetchedVideos : [];
    if (videosToDownload.length === 0) return;

    setIsZipping(true);
    setZipProgress(0);

    let completedCount = 0;

    // Process sequentially to prevent RAM crashes
    for (let i = 0; i < videosToDownload.length; i++) {
      const video = videosToDownload[i];
      try {
        const proxyUrl = `/api/video/stream?url=${encodeURIComponent(video.videoUrl)}&download=1&filename=pinterest_video_${i + 1}.mp4`;
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = `pinterest_video_${i + 1}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Failed to download video ${video.id}:`, err);
        // Fallback to opening in new tab
        window.open(video.videoUrl, '_blank');
      } finally {
        completedCount++;
        setZipProgress(Math.round((completedCount / videosToDownload.length) * 100));
        // Small delay to allow browser to process the download event
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setIsZipping(false);
    setZipProgress(0);
    if (completedCount > 0) {
      trackUserAction('pinterest', 'multi', 'download', completedCount);
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
    setPreviewVideo(video);
    const videosList = fetchedVideos.length > 0 ? fetchedVideos : [];
    const idx = videosList.findIndex(v => v.id === video.id);
    setPreviewVideoIndex(idx !== -1 ? idx + 1 : 1);
    setIsModalOpen(true);
  };

  const handleCopySingleLink = async () => {
    if (!singleVideo) return;
    try {
      await navigator.clipboard.writeText(singleVideo.pinterestUrl || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleDownloadVideo = async (video: VideoItem) => {
    try {
      const proxyUrl = `/api/video/stream?url=${encodeURIComponent(video.videoUrl)}&download=1&filename=pinterest_video_${video.id}.mp4`;
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = `pinterest_video_${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const type = fetchedVideos.length > 0 ? 'multi' : 'single';
      trackUserAction('pinterest', type, 'download', 1);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(video.videoUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#E60023]/20 selection:text-[#E60023] dark:selection:text-red-600">

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
                <HeroSection onFetch={handleFetchProfile} isLoading={isLoading} error={error} />

                {/* Feature Highlights */}
                <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-700/10 text-red-700 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">No Login Required</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Extract and download public Pinterest videos instantly without needing passwords or authorization.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#E60023]/10 text-[#E60023] flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Single Video Extractor</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Paste any post or reel link to fetch details, play the media, and trigger direct downloads instantly.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center mx-auto mb-3">
                      <Pinterest className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Multiple Links Extractor</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Paste multiple post links at once to extract and download all videos individually.
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
                    onClick={() => {
                      if (typeof window !== 'undefined' && localStorage.getItem('hasSeenDownloadAllPopup')) {
                        executeDownloadAllDirect();
                      } else {
                        setIsDownloadAllModalOpen(true);
                      }
                    }}
                    disabled={isZipping}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 via-[#E60023] to-red-600 text-white font-bold text-xs rounded-button shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-80 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isZipping ? `Downloading ${zipProgress}%...` : 'Download All (Direct)'}</span>
                  </button>
                </div>

                {/* Header Summary Card */}
                <div className="glass-panel w-full max-w-6xl mx-auto p-6 rounded-outer mb-8 border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-950">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-700 via-[#E60023] to-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
                      <Archive className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">
                        Multiple Video Manager
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Successfully fetched {fetchedVideos.length} Pinterest videos. Click <span className="font-bold text-red-600">Download All</span> to automatically save all videos to your device.
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
                  <div className={`relative flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[500px] ${singleVideo.type === 'reel' ? 'aspect-[4/5]' : 'aspect-square w-full'}`}>
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
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-extrabold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-wider mb-2">
                          Extracted Reel
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
                          Caption
                        </span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-32 overflow-y-auto select-text pr-1">
                          {singleVideo.caption}
                        </p>
                      </div>

                      {/* Engagement stats removed per user request */}
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
                          href={singleVideo.pinterestUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-button bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/40 dark:border-neutral-800/60 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDownloadVideo(singleVideo)}
                        disabled={isDownloading}
                        className="w-full relative overflow-hidden py-3 rounded-button bg-gradient-to-r from-red-700 via-[#E60023] to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 transition-all disabled:opacity-95"
                      >
                        {isDownloading ? (
                          <>
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ width: 0 }}
                              animate={{ width: `${downloadProgress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                            <span className="relative z-10">Downloading {downloadProgress}%...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download MP4 Video</span>
                          </>
                        )}
                      </button>
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

        {/* Limit Exceeded Modal */}
        <LimitExceededModal
          isOpen={!!limitModalType}
          onClose={() => setLimitModalType(null)}
          type={limitModalType}
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
