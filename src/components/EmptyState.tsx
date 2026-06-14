'use client';

import { motion } from 'framer-motion';
import { RefreshCw, CameraOff } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  username: string;
}

export default function EmptyState({ onReset, username }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto text-center px-6 py-16 glass-panel border border-neutral-200/50 dark:border-neutral-800/30 rounded-outer shadow-premium dark:shadow-premium-dark mt-8"
    >
      {/* Large SVG Illustration */}
      <div className="relative justify-center flex mb-8">
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10 border border-instagram-pink/20 text-instagram-pink dark:text-instagram-orange"
        >
          <CameraOff className="w-10 h-10 stroke-[1.5]" />
          
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-zinc-950">
            !
          </div>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
        No public media found
      </h3>
      
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto mb-8 leading-relaxed">
        No public videos, reels, or posts are currently available for the username <span className="font-semibold text-instagram-pink dark:text-instagram-orange">@{username}</span>. The profile might be private or doesn&apos;t have any uploaded video content.
      </p>

      <button
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-button bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange text-white font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Another Profile</span>
      </button>
    </motion.div>
  );
}
