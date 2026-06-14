'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, Zap, ArrowRight, HelpCircle, Laptop, Film, Smartphone, Globe
} from 'lucide-react';
import Header from '@/components/Header';

// Custom Instagram SVG icon component
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-500/20 selection:text-rose-600 dark:selection:text-rose-400">
      
      {/* Header component */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        {/* Welcome Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, Free, and No Registration Required</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6"
          >
            Download High Quality <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-pink-500 to-orange-500">
              Social Media Videos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Select your platform below, paste the video link, and get instant access to direct high-speed MP4 downloads.
          </motion.p>
        </div>

        {/* Downloader Choice Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          
          {/* Instagram Downloader Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative group glass-panel bg-white dark:bg-zinc-950 border border-neutral-200/60 dark:border-zinc-800/80 p-8 rounded-outer shadow-premium dark:shadow-premium-dark overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-gradient-to-br from-purple-600 to-pink-500 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-all duration-500" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange text-white flex items-center justify-center shadow-lg mb-6">
                <Instagram className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white mb-3">
                Instagram Downloader
              </h3>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-8">
                Instantly fetch, preview, and download public Instagram Reels, videos, posts, and media in full quality. Batch extraction supported.
              </p>
            </div>

            <Link href="/instagram" className="w-full">
              <button className="w-full py-3.5 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange hover:brightness-105 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-button flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Open Instagram Downloader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          {/* YouTube Downloader Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative group glass-panel bg-white dark:bg-zinc-950 border border-neutral-200/60 dark:border-zinc-800/80 p-8 rounded-outer shadow-premium dark:shadow-premium-dark overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-gradient-to-br from-red-600 to-rose-500 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-all duration-500" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg mb-6">
                <Youtube className="w-7 h-7 fill-white stroke-none" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white mb-3">
                YouTube Downloader
              </h3>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-8">
                Download public YouTube videos, Shorts, and clips directly in MP4 format. Enjoy zero wait time and high-speed batch downloads.
              </p>
            </div>

            <Link href="/youtube" className="w-full">
              <button className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 hover:brightness-105 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-button flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Open YouTube Downloader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

        </div>

        {/* How it Works Section */}
        <section className="w-full max-w-4xl mx-auto mb-24 text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mb-3 text-center sm:text-left">
            How to Download Media
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-10 text-center sm:text-left">
            Follow these 3 simple steps to extract and download video content instantly from your computer or phone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3 p-6 rounded-card bg-neutral-50/50 dark:bg-zinc-900/10 border border-neutral-200/50 dark:border-zinc-800/30">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">Copy Link</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                Open Instagram or YouTube, select the video or Reel, and copy its public sharing link to your clipboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-card bg-neutral-50/50 dark:bg-zinc-900/10 border border-neutral-200/50 dark:border-zinc-800/30">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">Paste & Fetch</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                Choose the matching downloader page, paste your link into the input field, and hit the &quot;Fetch&quot; button.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-card bg-neutral-50/50 dark:bg-zinc-900/10 border border-neutral-200/50 dark:border-zinc-800/30">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">Download File</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                Review the fetched thumbnail and title, play the preview directly, and press &quot;Download MP4&quot; to save the file.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-4xl mx-auto mb-20 text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mb-3 text-center sm:text-left">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 text-center sm:text-left">
            Quick answers to common questions about using MediaExplorer downloader tool.
          </p>

          <div className="space-y-4">
            
            <details className="group glass-panel bg-white dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-zinc-800/30 p-5 rounded-card transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <span>Do I need to pay or create an account?</span>
                <span className="ml-1.5 transition duration-300 group-open:-rotate-180 shrink-0">👇</span>
              </summary>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                No, our downloader is completely free and requires no registration. You do not need to provide passwords, credit cards, or register any social credentials to download media.
              </p>
            </details>

            <details className="group glass-panel bg-white dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-zinc-800/30 p-5 rounded-card transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <span>Are there limits on how many videos I can download?</span>
                <span className="ml-1.5 transition duration-300 group-open:-rotate-180 shrink-0">👇</span>
              </summary>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                None. You can download as many public videos, Reels, and YouTube clips as you like. We support unlimited downloads with full speed rendering.
              </p>
            </details>

            <details className="group glass-panel bg-white dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-zinc-800/30 p-5 rounded-card transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <span>Can I download private Instagram posts or members-only videos?</span>
                <span className="ml-1.5 transition duration-300 group-open:-rotate-180 shrink-0">👇</span>
              </summary>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                No, this tool respects content creators&apos; privacy and security boundaries. MediaExplorer is designed to download publicly available media only. Private profile items or restricted age-locked videos cannot be fetched.
              </p>
            </details>

            <details className="group glass-panel bg-white dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-zinc-800/30 p-5 rounded-card transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-bold text-neutral-800 dark:text-neutral-200">
                <span>Does it support batch downloads?</span>
                <span className="ml-1.5 transition duration-300 group-open:-rotate-180 shrink-0">👇</span>
              </summary>
              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                Yes! Both our Instagram and YouTube downloaders feature a dedicated &quot;Multiple Links (Batch)&quot; mode. You can enter multiple links simultaneously, fetch them all, and download each one individually or gather them all into a single generated ZIP file download.
              </p>
            </details>
          </div>
        </section>

        {/* Shared features list */}
        <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-neutral-200/50 dark:border-neutral-800/30">
          <div className="flex gap-3 items-start p-4 rounded-xl">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">100% Secure & Safe</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 leading-relaxed">
                Downloads are processed anonymously. No cookies or local files stored.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">High-Speed Downloads</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 leading-relaxed">
                Instant parsing and fast delivery of media streams directly to your browser.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Cross-Platform</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 leading-relaxed">
                Compatible with all modern browsers across Windows, macOS, Android, and iOS devices.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200/50 dark:border-neutral-800/30 py-8 px-6 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              MediaExplorer Downloader Portal
            </span>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 max-w-md">
              Disclaimer: We do not store, host, or crawl copyrighted social media content. All files belong to their respective uploaders.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              &copy; {new Date().getFullYear()} MediaExplorer Hub
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
