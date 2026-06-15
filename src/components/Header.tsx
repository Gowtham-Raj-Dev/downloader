'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const isHome = pathname === '/';
  const isInstagram = pathname === '/instagram';
  const isYoutube = pathname === '/youtube';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-black border-b border-neutral-200/80 dark:border-zinc-900 px-4 md:px-8 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-4 md:gap-y-0">
        
        {/* Brand / Logo */}
        <div className="flex items-center">
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
        <div className="w-full md:w-auto order-last md:order-none flex justify-center">
          <nav className="flex items-center bg-neutral-100 dark:bg-zinc-900/60 p-1.5 rounded-full border border-neutral-200/50 dark:border-zinc-800/60 text-xs overflow-x-auto custom-scrollbar">
            <Link
              href="/"
              className={`px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isHome
                  ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            
            <Link
              href="/instagram"
              className={`px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
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
              className={`px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isYoutube
                  ? 'bg-white dark:bg-zinc-800 text-neutral-950 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </Link>
          </nav>
        </div>

        {/* Theme Toggle / Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          {isAuthLoading ? (
            <div className="w-20 h-9 bg-neutral-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          ) : user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm font-bold text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors shadow-sm border border-neutral-200 dark:border-zinc-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="" className="w-5 h-5 rounded-full" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
