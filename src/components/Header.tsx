'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();


  const isHome = pathname === '/';
  const isInstagram = pathname.startsWith('/instagram');
  const isYoutube = pathname.startsWith('/youtube');
  const isPinterest = pathname.startsWith('/pinterest');

  // Helper to determine if we are in platform
  const isPlatform = isInstagram || isYoutube || isPinterest;

  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when a link is clicked
  const handleLinkClick = () => {
    setIsPlatformOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-neutral-200/80 dark:border-zinc-900 px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-4 md:gap-y-0">

        {/* Brand / Logo */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className={`p-2 rounded-xl text-white shadow-md transition-all duration-300 ${isInstagram
              ? 'bg-gradient-to-tr from-instagram-purple via-instagram-pink to-instagram-orange'
              : isYoutube
                ? 'bg-gradient-to-tr from-red-700 via-red-600 to-rose-500'
                : isPinterest
                  ? 'bg-gradient-to-tr from-[#E60023] via-red-600 to-[#E60023]'
                  : 'bg-gradient-to-tr from-rose-600 via-pink-600 to-orange-500'
              }`}>
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                Downloader
              </h1>
              <span className="text-[10px] font-semibold text-neutral-500 dark:text-zinc-400">
                Free Download Tool
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Navigation */}
        <div className="w-full md:w-auto order-last md:order-none flex justify-center shrink-0">
          <nav className="flex items-center bg-neutral-100 dark:bg-zinc-900/60 p-1.5 rounded-full border border-neutral-200/50 dark:border-zinc-800/60 text-xs overflow-visible">
            <Link
              href="/"
              className={`px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${isHome
                ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                }`}
            >
              Home
            </Link>

            <Link
              href="/#how-it-works"
              className="px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
            >
              How it works
            </Link>


            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                className={`px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isPlatform || isPlatformOpen
                  ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                  }`}
              >
                <span>Platform</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPlatformOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-2 w-56 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl transition-all duration-200 flex flex-col py-2 z-50 origin-top-right md:origin-top ${isPlatformOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                  }`}
              >
                <Link href="/instagram" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Instagram Downloader
                </Link>
                <Link href="/instagram/multi-url" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Multi Instagram Downloader
                </Link>
                <div className="h-px w-full bg-neutral-100 dark:bg-zinc-800/50 my-1"></div>
                <Link href="/youtube" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  YouTube Downloader
                </Link>
                <Link href="/youtube/multi-url" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Multi YouTube Downloader
                </Link>
                <Link href="/youtube/description-extractor" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  YouTube Description Extractor
                </Link>
                <div className="h-px w-full bg-neutral-100 dark:bg-zinc-800/50 my-1"></div>
                <Link href="/pinterest/video" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Pinterest Downloader
                </Link>
                <Link href="/pinterest/video/multi-url" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Multi Pinterest Downloader
                </Link>
                <Link href="/pinterest/image" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Pinterest Image Downloader
                </Link>
                <Link href="/pinterest/image/multi-url" onClick={handleLinkClick} className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">
                  Multi Pinterest Image Downloader
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Theme Toggle / Actions */}
        <div className="flex items-center justify-end flex-1 gap-2 md:gap-4">
          <ThemeToggle />
          <Link
            href="/instagram"
            className="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
