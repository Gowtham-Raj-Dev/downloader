'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  onComplete?: () => void;
  count?: number;
  isBatch?: boolean;
}

export default function LoadingState({ onComplete, count = 4, isBatch = false }: LoadingStateProps) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(isBatch ? 'Resolving Video Links...' : 'Scanning Profile...');

  useEffect(() => {
    // Progress increment timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        // Increment faster initially, then slow down near completion
        const increment = prev < 30 ? 6 : prev < 75 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (isBatch) {
      if (progress < 40) {
        setStatusMessage('Resolving Video Links...');
      } else if (progress < 80) {
        setStatusMessage('Fetching Instagram Streams...');
      } else {
        setStatusMessage('Preparing Results...');
      }
    } else {
      if (progress < 35) {
        setStatusMessage('Scanning Profile...');
      } else if (progress < 75) {
        setStatusMessage('Fetching Available Videos...');
      } else {
        setStatusMessage('Preparing Results...');
      }
    }
  }, [progress, isBatch]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Loading Header */}
      <div className="max-w-md mx-auto text-center mb-12">
        <div className="relative inline-flex items-center justify-center p-3 bg-instagram-pink/10 rounded-full text-instagram-pink dark:text-instagram-orange mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {statusMessage}
        </h3>
        
        {/* Progress Bar container */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-4 mb-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeInOut' }}
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">{progress}% Complete</span>
      </div>

      {/* Profile Header Skeleton */}
      {!isBatch && (
        <div className="glass-panel p-6 rounded-outer mb-8 border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full skeleton-shimmer shrink-0" />
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-48 h-7 rounded-md skeleton-shimmer" />
              <div className="w-16 h-5 rounded-full skeleton-shimmer" />
            </div>
            <div className="w-32 h-5 rounded-md skeleton-shimmer" />
            <div className="space-y-2 mt-4">
              <div className="w-full h-4 rounded-md skeleton-shimmer" />
              <div className="w-3/4 h-4 rounded-md skeleton-shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* Grid skeleton */}
      <div className="masonry-grid">
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx} 
            className="glass-card rounded-card overflow-hidden border border-neutral-200/50 dark:border-neutral-800/30 flex flex-col h-[400px]"
          >
            {/* Aspect ratio video area */}
            <div className="w-full aspect-[4/5] skeleton-shimmer relative" />
            
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="w-full h-4 rounded-md skeleton-shimmer" />
                <div className="w-2/3 h-4 rounded-md skeleton-shimmer" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="w-20 h-5 rounded-md skeleton-shimmer" />
                <div className="w-20 h-5 rounded-md skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
