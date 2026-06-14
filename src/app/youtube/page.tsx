'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Sparkles, Heart, Download, Copy, Check, 
  ExternalLink, Play, Pause, Archive
} from 'lucide-react';
import YoutubeHeroSection from '@/components/YoutubeHeroSection';
import LoadingState from '@/components/LoadingState';
import VideoGallery from '@/components/VideoGallery';
import PreviewModal from '@/components/PreviewModal';
import Header from '@/components/Header';
import { 
  isYoutubeVideoUrl, 
  extractYoutubeId,
  YoutubeVideoItem
} from '@/data/youtubeData';
import { VideoItem } from '@/data/mockProfiles';

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

  // Single video player states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState<boolean>(false);
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [previewVideoIndex, setPreviewVideoIndex] = useState<number>(1);

  // Sync player play/pause if state changes
  const togglePlaySingle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
        const proxiedVideoUrl = `/api/video/stream?url=${encodeURIComponent(result.data.videoUrl)}`;
        setSingleVideo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            videoUrl: proxiedVideoUrl
          };
        });
      } else {
        throw new Error(result.error || 'Quality unavailable');
      }
    } catch (err) {
      console.error('Error changing quality:', err);
      alert('This specific quality resolution is currently not obtainable from YouTube/Cobalt servers. Falling back to previous resolution.');
      setSelectedQuality(previousQuality);
    } finally {
      setIsChangingQuality(false);
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

    // Identify video URLs
    const videoUrls = inputs.filter(input => isYoutubeVideoUrl(input));

    if (videoUrls.length === 0) {
      setError('Invalid YouTube Video or Shorts URL. Please enter a valid YouTube link.');
      setIsLoading(false);
      setActiveUsername(null);
      return;
    }

    setIsLoadingBatch(true);
    setLoadingCount(videoUrls.length);

    try {
      const fetchPromises = videoUrls.map(async (url) => {
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(url)}&quality=1080`);
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
        
        // Proxy the downloadUrl using /api/video/stream?url=...
        const proxiedVideoUrl = `/api/video/stream?url=${encodeURIComponent(data.videoUrl)}`;
        
        return {
          id: videoId,
          thumbnail: data.thumbnail,
          videoUrl: proxiedVideoUrl,
          duration: '0:35', // estimated or default
          uploadDate: 'Just now',
          views,
          likes,
          comments: 0,
          caption: `${data.title} - Shared by ${data.author}.`,
          type: url.toLowerCase().includes('/shorts/') ? 'reel' : 'video',
          instagramUrl: url, // to maintain compatibility with original layouts/components
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
        } else {
          setFetchedVideos(successfulVideos);
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

  const handleDownloadZip = async () => {
    const videosToDownload = fetchedVideos.length > 0 ? fetchedVideos : [];
    if (videosToDownload.length === 0) return;

    const confirmZip = window.confirm(`Do you want to download all ${videosToDownload.length} YouTube videos as a ZIP file?`);
    if (!confirmZip) return;

    setIsZipping(true);
    setZipProgress(0);

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (let i = 0; i < videosToDownload.length; i++) {
        const video = videosToDownload[i];
        setZipProgress(Math.round((i / videosToDownload.length) * 100));

        try {
          const response = await fetch(video.videoUrl);
          if (!response.ok) throw new Error('Network error');
          const blob = await response.blob();
          
          const fileName = `youtube_video_${i + 1}.mp4`;
          zip.file(fileName, blob);
        } catch (err) {
          console.error(`Failed to add video ${video.id} to ZIP:`, err);
        }
      }

      setZipProgress(95);
      const content = await zip.generateAsync({ type: 'blob' });
      
      const blobUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `youtube_videos_${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      alert('Failed to generate ZIP file. Please download videos individually.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
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

  // Centralized download handler that supports streaming download with progress bar
  const handleDownloadVideo = async (video: YoutubeVideoItem) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch(video.videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('content-length') ?? '0');
      
      const cleanTitle = (video.title || 'youtube_video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${cleanTitle}.mp4`;

      if (!reader) {
        // Fallback for browsers not supporting stream reader
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setIsDownloading(false);
        return;
      }

      let receivedLength = 0;
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
        }

        if (contentLength > 0) {
          const progress = Math.round((receivedLength / contentLength) * 100);
          setDownloadProgress(progress);
        }
      }

      const blob = new Blob(chunks, { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Failed to fetch video directly, falling back to open video tab:', err);
      window.open(video.videoUrl, '_blank');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
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
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">Batch Downloader</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                        Paste multiple YouTube links at once to extract and download all videos as a batch.
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
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-bold text-xs rounded-button shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-80 cursor-pointer"
                    >
                      <Archive className="w-4 h-4" />
                      <span>{isZipping ? `Creating ZIP ${zipProgress}%...` : 'Download All (ZIP)'}</span>
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
                          Batch Download Manager
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Successfully fetched {fetchedVideos.length} YouTube videos. Preview individually or download all as a single ZIP archive.
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
                    <div className="relative flex-1 bg-black aspect-[16/10] flex items-center justify-center overflow-hidden max-h-[500px]">
                      <video
                        ref={videoRef}
                        src={singleVideo.videoUrl}
                        loop
                        playsInline
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={togglePlaySingle}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
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
                        
                        <span className="px-2 py-0.5 bg-black/60 text-[10px] font-mono text-neutral-300 rounded border border-white/10 select-none">
                          {singleVideo.duration}
                        </span>
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

                        {/* Quality Selection Dropdown */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                            Select Quality
                          </span>
                          <div className="relative">
                            <select
                              value={selectedQuality}
                              onChange={(e) => handleQualityChange(e.target.value)}
                              disabled={isChangingQuality || isDownloading}
                              className="w-full text-xs py-2.5 px-3 rounded-button bg-white dark:bg-zinc-950 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-800/60 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <option value="1080">1080p (Best Quality)</option>
                              <option value="720">720p (High Quality)</option>
                              <option value="480">480p (Medium Quality)</option>
                              <option value="360">360p (Low Quality)</option>
                              <option value="240">240p (Mobile Quality)</option>
                            </select>
                            {isChangingQuality && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                              </div>
                            )}
                          </div>
                        </div>
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

                        <button
                          onClick={() => handleDownloadVideo(singleVideo)}
                          disabled={isDownloading || isChangingQuality}
                          className="w-full relative overflow-hidden py-3 rounded-button bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 transition-all disabled:opacity-95"
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
                          ) : isChangingQuality ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Updating Quality...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Download MP4 ({selectedQuality}p)</span>
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
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200/50 dark:border-neutral-800/30 py-8 px-6 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              YouTube Video Downloader
            </span>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 max-w-md">
              Disclaimer: This is an educational visual exploration tool. We do not store, host, or crawl copyrighted YouTube media. All assets belong to their respective creators.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>using Next.js 15 & React 19</span>
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              &copy; {new Date().getFullYear()} TubeExplorer
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
