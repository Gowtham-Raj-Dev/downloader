'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Users, UserPlus, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { ProfileData } from '../data/mockProfiles';

interface ProfileOverviewProps {
  profile: ProfileData;
}

export default function ProfileOverview({ profile }: ProfileOverviewProps) {
  // Helper to format numbers like 97.4M or 150K
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 md:p-8 rounded-outer border border-neutral-200/50 dark:border-neutral-800/30 shadow-premium dark:shadow-premium-dark w-full max-w-6xl mx-auto mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
        {/* Avatar with Gradient Border */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-instagram-yellow via-instagram-pink to-instagram-purple rounded-full -m-1 animate-pulse" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white dark:border-zinc-950 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="w-full h-full object-cover select-none"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {profile.fullName}
                </h2>
                {profile.verified && (
                  <span title="Verified Profile">
                    <BadgeCheck className="w-6 h-6 text-instagram-blue dark:text-sky-400 fill-instagram-blue dark:fill-sky-400/20 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold mt-0.5">
                @{profile.username}
              </p>
            </div>
            
            <div className="flex justify-center shrink-0">
              <a
                href={`https://www.instagram.com/${profile.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-button bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800/60 dark:hover:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-700/50 transition-all cursor-pointer shadow-sm"
              >
                <span>View on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Biography */}
          <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed max-w-2xl">
            {profile.bio}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 border-t border-neutral-200/40 dark:border-neutral-800/40">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Users className="w-4 h-4 text-instagram-purple" />
              <span className="font-bold text-neutral-900 dark:text-white">
                {formatNumber(profile.followers)}
              </span>
              <span>Followers</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <UserPlus className="w-4 h-4 text-instagram-pink" />
              <span className="font-bold text-neutral-900 dark:text-white">
                {formatNumber(profile.following)}
              </span>
              <span>Following</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <ImageIcon className="w-4 h-4 text-instagram-orange" />
              <span className="font-bold text-neutral-900 dark:text-white">
                {profile.postsCount}
              </span>
              <span>Posts</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
