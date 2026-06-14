'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

// Custom Instagram SVG icon
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

// Custom Youtube SVG icon
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isInstagram = pathname === '/instagram';
  const isYoutube = pathname === '/youtube';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-black border-b border-neutral-200/80 dark:border-zinc-900 px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className={`p-2 rounded-xl text-white shadow-md transition-all duration-300 ${
            isInstagram 
              ? 'bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange' 
              : isYoutube 
                ? 'bg-gradient-to-tr from-red-700 via-red-600 to-rose-500' 
                : 'bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500'
          }`}>
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
              {isInstagram ? 'InstaExplorer' : isYoutube ? 'TubeExplorer' : 'MediaExplorer'}
            </h1>
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-zinc-400">
              {isInstagram ? 'Instagram Downloader' : isYoutube ? 'YouTube Downloader' : 'All-in-One Downloader Hub'}
            </span>
          </div>
        </Link>

        {/* Menu Navigation */}
        <nav className="flex items-center bg-neutral-100 dark:bg-zinc-900/60 p-1.5 rounded-full border border-neutral-200/50 dark:border-zinc-800/60 text-xs">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isHome
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          
          <Link
            href="/instagram"
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isInstagram
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </Link>

          <Link
            href="/youtube"
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isYoutube
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <YoutubeIcon className="w-3.5 h-3.5 fill-current stroke-none" />
            <span>YouTube</span>
          </Link>
        </nav>

        {/* Theme Toggle / Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
