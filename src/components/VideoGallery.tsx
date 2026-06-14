'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, List, Search, Play, Pause, Copy, Check, Download, 
  Eye, Calendar, Filter, ArrowUpDown, ChevronDown, Loader2 
} from 'lucide-react';
import { VideoItem } from '../data/mockProfiles';

interface VideoGalleryProps {
  videos: VideoItem[];
  onPreview: (video: VideoItem) => void;
  hideFilters?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'most_viewed';
type FilterOption = 'all' | 'reels' | 'videos';

export default function VideoGallery({ videos, onPreview, hideFilters = false }: VideoGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  
  // States for copy and download feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Infinite Scroll state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset pagination on search or filter change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm, sortBy, filterType, videos]);

  // Filter and Sort Logic
  const processedVideos = useMemo(() => {
    let result = [...videos];

    // Filter by type
    if (filterType === 'reels') {
      result = result.filter(v => v.type === 'reel');
    } else if (filterType === 'videos') {
      result = result.filter(v => v.type === 'video');
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v => 
        v.caption.toLowerCase().includes(term) || 
        v.uploadDate.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      // For views
      if (sortBy === 'most_viewed') {
        return b.views - a.views;
      }
      
      // Parse dates (e.g. '1 day ago', '3 days ago', '1 week ago') to extract relative order.
      // Since our mock items follow clean increment IDs, we can use ID index/suffix or date estimation.
      const parseDays = (dateStr?: string) => {
        if (!dateStr) return 999;
        if (dateStr.includes('hour')) return 0.1;
        if (dateStr.includes('minute')) return 0.01;
        const matches = dateStr.match(/\d+/);
        if (!matches) return 999;
        const num = parseInt(matches[0]);
        if (dateStr.includes('week')) return num * 7;
        if (dateStr.includes('month')) return num * 30;
        return num;
      };

      const daysA = parseDays(a.uploadDate);
      const daysB = parseDays(b.uploadDate);

      if (sortBy === 'newest') {
        return daysA - daysB; // smaller number of days ago means newer
      } else {
        return daysB - daysA; // larger means older
      }
    });

    return result;
  }, [videos, filterType, searchTerm, sortBy]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && processedVideos.length > visibleCount && !isInfiniteLoading) {
          setIsInfiniteLoading(true);
          // Simulate network loading delay
          setTimeout(() => {
            setVisibleCount(prev => prev + 3);
            setIsInfiniteLoading(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [processedVideos, visibleCount, isInfiniteLoading]);

  // Visible items after pagination
  const visibleVideos = useMemo(() => {
    return processedVideos.slice(0, visibleCount);
  }, [processedVideos, visibleCount]);

  const handleCopyLink = async (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card preview click
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = async (id: string, videoUrl: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card preview click
    if (downloadingId) return;
    setDownloadingId(id);

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `video_${index + 1}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Failed to fetch video directly, falling back to new tab download:', err);
      // Fallback: open in new tab if CORS or other network issue occurs
      window.open(videoUrl, '_blank');
    } finally {
      setDownloadingId(null);
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header and Layout Controls */}
      {!hideFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200/40 dark:border-neutral-800/40">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Available Videos</span>
              <span className="text-sm font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full">
                {processedVideos.length}
              </span>
            </h2>
          </div>

          {/* Filters Panel */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Grid/List toggler */}
            <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-button border border-neutral-200/50 dark:border-neutral-800/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[8px] cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[8px] cursor-pointer transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Strip */}
      {!hideFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-8">
          {/* Search */}
          <div className="sm:col-span-6 relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Videos..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-button text-sm focus:outline-none focus:ring-1 focus:ring-instagram-pink/40 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3 relative">
            <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterOption)}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-button text-sm focus:outline-none focus:ring-1 focus:ring-instagram-pink/40 text-neutral-800 dark:text-neutral-200 appearance-none cursor-pointer"
            >
              <option value="all">All Media Type</option>
              <option value="reels">Reels Only</option>
              <option value="videos">Videos Only</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>

          {/* Sort order */}
          <div className="sm:col-span-3 relative">
            <ArrowUpDown className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 rounded-button text-sm focus:outline-none focus:ring-1 focus:ring-instagram-pink/40 text-neutral-800 dark:text-neutral-200 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Main Grid/List Render */}
      {processedVideos.length === 0 ? (
        <div className="text-center py-20 glass-panel border border-neutral-200/50 dark:border-neutral-800/30 rounded-outer max-w-lg mx-auto">
          <div className="relative inline-flex p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full mb-4">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">No matches found</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            Try adjusting your search query or reset the filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="masonry-grid">
          {visibleVideos.map((video) => (
            <motion.div
              layout
              key={video.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="group glass-card rounded-card overflow-hidden border border-neutral-200/50 dark:border-neutral-800/30 shadow-soft hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700/60 transition-all flex flex-col h-full cursor-pointer relative"
              onClick={() => onPreview(video)}
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
                  loading="lazy"
                />

                {/* Duration Tag */}
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded border border-white/10 select-none">
                  {video.duration}
                </span>

                {/* Type Tag */}
                <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-[9px] font-extrabold uppercase tracking-wider text-white px-2 py-0.5 rounded border border-white/10 select-none">
                  {video.type}
                </span>

                {/* Play Icon Hover Overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
                <div className="space-y-1.5">
                  {/* Views and date */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(video.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {video.uploadDate}
                    </span>
                  </div>
                  {/* Caption preview */}
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2 select-text">
                    {video.caption}
                  </p>
                </div>

                {/* Card Action Buttons (Download Area) */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/40">
                  {/* Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(video);
                    }}
                    className="flex-1 py-2 rounded-button text-[11px] font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border-neutral-200/40 dark:border-neutral-800/60"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Preview</span>
                  </button>

                  {/* Copy link */}
                  <button
                    onClick={(e) => handleCopyLink(video.id, video.instagramUrl, e)}
                    className="p-2 rounded-button bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/90 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/60 transition-colors flex items-center justify-center cursor-pointer relative"
                    title="Copy Instagram link"
                  >
                    {copiedId === video.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Download */}
                  <button
                    onClick={(e) => {
                      const index = videos.findIndex(v => v.id === video.id);
                      handleDownload(video.id, video.videoUrl, index !== -1 ? index : 0, e);
                    }}
                    disabled={downloadingId !== null}
                    className="p-2 rounded-button bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange text-white hover:brightness-105 transition-all flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                    title="Download Video"
                  >
                    {downloadingId === video.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="w-full overflow-x-auto rounded-outer border border-neutral-200/50 dark:border-neutral-800/30 glass-panel">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-neutral-100/50 dark:bg-neutral-900/30 border-b border-neutral-200/50 dark:border-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Thumbnail</th>
                <th className="py-4 px-6 min-w-[200px]">Caption</th>
                <th className="py-4 px-6 text-center">Duration</th>
                <th className="py-4 px-6 text-center">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleVideos.map((video) => (
                 <tr 
                  key={video.id} 
                  className="border-b border-neutral-200/30 dark:border-neutral-800/20 hover:bg-neutral-100/30 dark:hover:bg-neutral-900/20 transition-colors cursor-pointer"
                  onClick={() => onPreview(video)}
                >
                  {/* Thumbnail column */}
                  <td className="py-4 px-6">
                    <div className="relative w-16 h-20 rounded-md overflow-hidden bg-neutral-950 shrink-0 border border-neutral-200/30 dark:border-neutral-800/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={video.thumbnail} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-1 right-1 bg-black/85 text-[8px] font-bold text-white px-1.5 rounded select-none">
                        {video.duration}
                      </span>
                    </div>
                  </td>

                  {/* Caption column */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-instagram-pink/10 text-instagram-pink dark:text-instagram-orange border border-instagram-pink/20 select-none">
                        {video.type}
                      </span>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed max-w-md line-clamp-2 select-text">
                        {video.caption}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{formatNumber(video.views)} views</span>
                      </div>
                    </div>
                  </td>

                  {/* Duration column */}
                  <td className="py-4 px-6 text-center text-xs font-semibold font-mono text-neutral-600 dark:text-neutral-400">
                    {video.duration}
                  </td>

                  {/* Upload Date column */}
                  <td className="py-4 px-6 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
                    {video.uploadDate}
                  </td>

                  {/* Actions column */}
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onPreview(video)}
                        className="py-1.5 px-3 rounded-button border text-xs font-bold transition-colors cursor-pointer bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/40 dark:border-neutral-800/60"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => handleCopyLink(video.id, video.instagramUrl, e)}
                        className="p-2 rounded-button bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/90 text-neutral-600 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/60 transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        {copiedId === video.id ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          const index = videos.findIndex(v => v.id === video.id);
                          handleDownload(video.id, video.videoUrl, index !== -1 ? index : 0, e);
                        }}
                        disabled={downloadingId !== null}
                        className="p-2 rounded-button bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange text-white hover:brightness-105 transition-all cursor-pointer disabled:opacity-60"
                        title="Download MP4"
                      >
                        {downloadingId === video.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {processedVideos.length > visibleCount && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center gap-2 mt-10 py-6 border-t border-neutral-200/20 dark:border-neutral-800/20"
        >
          {isInfiniteLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-instagram-pink" />
              <span>Loading More Videos...</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium select-none">
              Scroll down to explore more videos
            </span>
          )}
        </div>
      )}
    </div>
  );
}
