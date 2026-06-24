'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Sparkles, Download, Copy, Check,
  ExternalLink, Archive, Image as ImageIcon
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

export default function PinterestMultiImagePage() {
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

  const [isCopied, setIsCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [downloadProgress, setDownloadProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [previewVideoIndex, setPreviewVideoIndex] = useState<number>(1);
  const [isDownloadAllModalOpen, setIsDownloadAllModalOpen] = useState(false);

  const handleFetchProfile = async (inputs: string[]) => {
    if (inputs.length === 0) return;

    // Set loading states
    setActiveUsername(inputs.join(', '));
    setIsLoading(true);
    setSingleVideo(null);
    setFetchedVideos([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let videoUrls = inputs.filter(input => isPinterestVideoUrl(input));

    if (videoUrls.length === 0) {
      setError('Invalid Pinterest Image URL. Please enter a valid Pinterest image link.');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    if (!(await checkDailyLimit('multi'))) {
      setLimitModalType(isLoggedIn ? 'free' : 'guest');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    if (videoUrls.length > 500) {
      videoUrls = videoUrls.slice(0, 500);
    }

    setIsLoadingBatch(true);
    setLoadingCount(videoUrls.length);
    try {
      const fetchPromises = videoUrls.map(async (url, index) => {
        if (index >= 200) {
          await new Promise(r => setTimeout(r, 1500 * (index - 199))); 
        }

        const response = await fetch(`/api/pinterest-image?url=${encodeURIComponent(url)}`);
        let result;
        try {
          result = await response.json();
        } catch (e) {
          throw new Error(`Failed to fetch: ${url}`);
        }

        if (!response.ok || !result.success || !result.data) {
          if (result.error && (result.error.toLowerCase().includes('aborted') || result.error.toLowerCase().includes('timeout') || result.error.toLowerCase().includes('fetch failed'))) {
              throw new Error(`Pinterest blocked IP. Use FULL URL instead of pin.it`);
          }
          throw new Error(result?.error || `Failed to parse image: ${url}`);
        }

        const media = result.data.media_details[0];
        const postInfo = result.data.post_info || {};

        const shortcode = extractVideoShortcode(url) || 'image';
        const randomId = Math.random().toString(36).substring(2, 9);
        const proxiedThumbnail = media.thumbnail || '';

        return {
          id: `${shortcode}_${randomId}`,
          thumbnail: proxiedThumbnail,
          videoUrl: media.url || '',
          duration: 'Image',
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
          console.error('Error fetching individual image:', res.reason);
        }
      });

      if (successfulVideos.length > 0) {
        setFetchedVideos(successfulVideos);
        trackUserAction('pinterest', 'multi', 'fetch', successfulVideos.length);

        if (failedUrls.length > 0) {
          setError(`Successfully fetched ${successfulVideos.length} image(s). Failed to fetch ${failedUrls.length} link(s).`);
        }
      } else {
        setError('Failed to fetch any of the provided Pinterest Image URLs. Please check the links.');
        setActiveUsername(null);
      }
    } catch (err) {
      console.error('Error in multiple images fetch:', err);
      const errMsg = err instanceof Error ? err.message : 'Error occurred while loading image details.';
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

    for (let i = 0; i < videosToDownload.length; i++) {
      const video = videosToDownload[i];
      try {
        const proxyUrl = `/api/video/stream?url=${encodeURIComponent(video.videoUrl)}&download=1&filename=pinterest_image_${i + 1}.jpg`;
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = `pinterest_image_${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Failed to download image ${video.id}:`, err);
        window.open(video.videoUrl, '_blank');
      } finally {
        completedCount++;
        setZipProgress(Math.round((completedCount / videosToDownload.length) * 100));
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
    setError(null);
    setIsZipping(false);
    setZipProgress(0);
  };

  const handleOpenPreview = (video: VideoItem) => {
    setPreviewVideo(video);
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
      const proxyUrl = `/api/video/stream?url=${encodeURIComponent(video.videoUrl)}&download=1&filename=pinterest_image_${video.id}.jpg`;
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = `pinterest_image_${video.id}.jpg`;
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

      <Header />

      <main className="flex-1 w-full flex flex-col items-center py-6">

        <AnimatePresence mode="wait">
          <div className="w-full flex flex-col items-center">

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

                <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-700/10 text-red-700 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">No Login Required</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Extract and download public Pinterest images instantly without needing passwords or authorization.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#E60023]/10 text-[#E60023] flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Batch Image Extractor</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Paste multiple pin links to fetch details, view images in full size, and trigger direct downloads instantly.
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-card border border-neutral-200/40 dark:border-neutral-800/20 text-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center mx-auto mb-3">
                      <Pinterest className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Save All With One Click</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      Download all fetched images to your device in a single action.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

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

            {!isLoading && fetchedVideos.length > 0 && (
              <motion.div
                key="multiple-videos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
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

                <div className="glass-panel w-full max-w-6xl mx-auto p-6 rounded-outer mb-8 border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-950">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-700 via-[#E60023] to-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
                      <Archive className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">
                        Multiple Image Manager
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Successfully fetched {fetchedVideos.length} Pinterest images. Click <span className="font-bold text-red-600">Download All</span> to automatically save all images to your device.
                      </p>
                    </div>
                  </div>
                </div>

                <VideoGallery videos={fetchedVideos} onPreview={handleOpenPreview} hideFilters={true} />
              </motion.div>
            )}

          </div>
        </AnimatePresence>

        <PreviewModal
          video={previewVideo}
          videoIndex={1}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Downloading All Images</h3>
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

      <Footer />
    </div>
  );
}
