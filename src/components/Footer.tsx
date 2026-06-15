import Link from 'next/link';
import { Heart, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/50 dark:border-neutral-800/30 py-8 px-6 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            CodeLove Downloader Portal
          </span>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5 max-w-md">
            Disclaimer: We do not store, host, or crawl copyrighted social media content. All files belong to their respective uploaders.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-500">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-1 flex items-center gap-1">
            &copy; {new Date().getFullYear()}{' '}
            <Link href="https://codelove.in" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline-offset-2">
              codelove.in
            </Link>
            . All rights reserved.
          </span>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-center md:justify-end gap-1.5">
            Developed with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /><Code className="w-4 h-4 text-indigo-500" /> by{' '}
            <Link href="https://gowtham.codelove.in" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-semibold underline underline-offset-2">
              Gowtham
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
