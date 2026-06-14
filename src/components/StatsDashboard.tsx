'use client';

import { Variants, motion } from 'framer-motion';
import { Video, Clapperboard, Layers, Calendar, HardDrive } from 'lucide-react';
import { ProfileData } from '../data/mockProfiles';

interface StatsDashboardProps {
  stats: ProfileData['stats'];
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  const statItems = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Total Reels',
      value: stats.totalReels,
      icon: Clapperboard,
      color: 'from-instagram-pink/10 to-instagram-purple/10',
      iconColor: 'text-instagram-pink'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: Layers,
      color: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Latest Upload',
      value: stats.latestUpload,
      icon: Calendar,
      color: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-500',
      isText: true
    },
    {
      title: 'Available Media',
      value: stats.totalAvailableMedia,
      icon: HardDrive,
      color: 'from-purple-500/10 to-fuchsia-500/10',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-6xl mx-auto mb-10 px-1"
    >
      {statItems.map((item) => (
        <motion.div
          key={item.title}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="glass-card p-4.5 rounded-card border border-neutral-200/50 dark:border-neutral-800/30 shadow-soft hover:shadow-md transition-shadow flex flex-col justify-between h-32 col-span-1 first:col-span-2 md:first:col-span-1 last:col-span-2 md:last:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">
              {item.title}
            </span>
            <div className={`p-2 rounded-lg bg-gradient-to-tr ${item.color} ${item.iconColor}`}>
              <item.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h4 className={`font-extrabold text-neutral-900 dark:text-white ${item.isText ? 'text-sm md:text-base' : 'text-2xl md:text-3xl'}`}>
              {item.isText ? item.value : typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </h4>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
