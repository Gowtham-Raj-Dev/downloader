'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Download, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect, useRef } from 'react';

const INSTAGRAM_TOOLS = [
  { label: 'Insta Downloader', hint: 'Reels, videos & photos', href: '/instagram' },
  { label: 'Multi-link Insta Downloader', hint: 'Many posts at once', href: '/instagram/multi-url' },
];

const PINTEREST_TOOLS = [
  { label: 'Pinterest Video Downloader', hint: 'Video pins', href: '/pinterest/video' },
  { label: 'Pinterest Image Downloader', hint: 'Image pins', href: '/pinterest/image' },
  { label: 'Multi-link Pinterest Video', hint: 'Many video pins', href: '/pinterest/video/multi-url' },
  { label: 'Multi-link Pinterest Image', hint: 'Many image pins', href: '/pinterest/image/multi-url' },
];

const NAV = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const isInstagram = pathname.startsWith('/instagram');
  const isPinterest = pathname.startsWith('/pinterest');

  const [openMenu, setOpenMenu] = useState<'tools' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus after navigating.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const navLink = 'px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap';

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-black/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 select-none group shrink-0" aria-label="Insta Downloader home">
          <span className="grid place-items-center w-9 h-9 rounded-xl text-white shadow-md shadow-pink-500/20 bg-gradient-to-tr from-instagram-orange via-instagram-pink to-instagram-purple">
            <Download className="w-[18px] h-[18px] group-hover:translate-y-0.5 transition-transform" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Insta Downloader
            </span>
            <span className="block mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-zinc-500">
              by CodeLove
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          <Link
            href="/instagram"
            className={`${navLink} ${isInstagram ? 'text-instagram-pink' : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'}`}
          >
            Instagram
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'tools' ? null : 'tools')}
              aria-expanded={openMenu === 'tools'}
              className={`${navLink} flex items-center gap-1 cursor-pointer ${isPinterest || openMenu === 'tools' ? 'text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white'}`}
            >
              All tools
              <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'tools' ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[520px] grid grid-cols-2 gap-1 p-2 rounded-2xl border border-neutral-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl shadow-black/10 transition-all duration-200 origin-top ${openMenu === 'tools' ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
            >
              <ToolGroup title="Instagram" tools={INSTAGRAM_TOOLS} />
              <ToolGroup title="Pinterest" tools={PINTEREST_TOOLS} />
            </div>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${navLink} text-neutral-600 dark:text-zinc-400 hover:text-neutral-950 dark:hover:text-white`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/instagram"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange shadow-md shadow-pink-500/20 hover:brightness-110 transition"
          >
            <Download className="w-4 h-4" /> Download now
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden grid place-items-center w-10 h-10 rounded-xl text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-neutral-200/70 dark:border-zinc-800/70 px-4 py-4 space-y-4 bg-white dark:bg-black" aria-label="Mobile">
          <ToolGroup title="Instagram" tools={INSTAGRAM_TOOLS} />
          <ToolGroup title="Pinterest" tools={PINTEREST_TOOLS} />
          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200/70 dark:border-zinc-800/70">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 py-2 rounded-full text-sm font-semibold bg-neutral-100 dark:bg-zinc-900 text-neutral-700 dark:text-zinc-300">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function ToolGroup({ title, tools }: { title: string; tools: { label: string; hint: string; href: string }[] }) {
  return (
    <div>
      <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500">{title}</p>
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="block px-3 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span className="block text-sm font-semibold text-neutral-800 dark:text-zinc-200">{tool.label}</span>
          <span className="block text-xs text-neutral-500 dark:text-zinc-500">{tool.hint}</span>
        </Link>
      ))}
    </div>
  );
}
