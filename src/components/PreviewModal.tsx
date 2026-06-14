'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, Copy, Check, Download, 
  Eye, Calendar, Heart, MessageCircle, Info, ExternalLink 
} from 'lucide-react';
import { VideoItem } from '../data/mockProfiles';

interface PreviewModalProps {
  video: VideoItem | null;
  videoIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ video, videoIndex = 1, isOpen, onClose }: PreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Reset states when modal changes
    if (isOpen) {
      setIsPlaying(false);
      setIsCopied(false);
      setIsDownloading(false);
      setDownloadProgress(0);
      setVideoError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(video.instagramUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleDownload = async () => {
    if (isDownloading || !video) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch(video.videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('content-length') ?? '0');

      if (!reader) {
        // Fallback for browsers not supporting stream reader
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `video_${videoIndex}.mp4`);
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
      link.setAttribute('download', `video_${videoIndex}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Failed to fetch video directly, falling back to new tab download:', err);
      // Fallback: open in new tab if CORS or other network issues occur
      window.open(video.videoUrl, '_blank');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const formatNumber = (num: number): string => {
    return num >= 1000000 
      ? (num / 1000000).toFixed(1) + 'M' 
      : num >= 1000 
        ? (num / 1000).toFixed(1) + 'K' 
        : num.toString();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Card (Netflix style: Dark Mode forced for premium cinema feel) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-outer overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[70vh] z-10 text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/80 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Player Side */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden h-[45%] md:h-full">
            {videoError ? (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 bg-zinc-800/50 rounded-full text-neutral-400 mb-4 border border-zinc-800">
                  <Play className="w-8 h-8 opacity-40 translate-x-0.5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">Preview Playback Unavailable</h4>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed mb-4">
                  Inline media playback is not supported by your browser or the video source is offline.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold rounded-button cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download to View</span>
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={video.videoUrl}
                loop
                playsInline
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setVideoError(true)}
              />
            )}

            {/* Video Controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <span className="px-2 py-1 bg-black/50 text-[10px] font-mono rounded border border-zinc-800 text-neutral-400">
                {video.duration} | MP4
              </span>
            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col justify-between h-[55%] md:h-full bg-zinc-900/90 overflow-y-auto">
            {/* Scrollable details area */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-instagram-pink/15 text-instagram-pink border border-instagram-pink/30 mb-2">
                  {video.type}
                </span>
                <h3 className="text-lg font-bold line-clamp-1">Media Details</h3>
                <div className="flex items-center gap-4 mt-3 text-neutral-400 text-xs font-medium border-b border-zinc-800 pb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {video.uploadDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(video.views)} Views
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Caption</span>
                <p className="text-sm text-neutral-200 leading-relaxed max-h-32 overflow-y-auto pr-1 select-text">
                  {video.caption}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 pt-1 md:pt-2">
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-card text-center">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/10 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-neutral-500 block uppercase">Likes</span>
                  <span className="text-sm font-bold">{formatNumber(video.likes)}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-card text-center">
                  <MessageCircle className="w-4 h-4 text-blue-500 fill-blue-500/10 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-neutral-500 block uppercase">Comments</span>
                  <span className="text-sm font-bold">{formatNumber(video.comments)}</span>
                </div>
              </div>

              {/* Technical Metadata */}
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-card p-2.5 md:p-3 space-y-1.5 md:space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold border-b border-zinc-800/50 pb-1.5 mb-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Technical Info</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-mono text-neutral-400">
                  <span>Format: MP4</span>
                  <span>Audio: AAC Stereo</span>
                  <span>Video: H.264</span>
                  <span>FPS: 30 fps</span>
                </div>
              </div>
            </div>

            {/* Sticky Actions Area */}
            <div className="p-4 md:p-6 bg-zinc-950 border-t border-zinc-800 space-y-2.5 md:space-y-3 shrink-0">
              <div className="flex gap-3">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-3 px-4 rounded-button bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-zinc-700"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied URL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* View Post Button */}
                <a
                  href={video.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-button bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-zinc-700"
                  title="View original post"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Download Button with Progress bar */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full relative overflow-hidden py-3 px-4 rounded-button bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-90"
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.15 }}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
