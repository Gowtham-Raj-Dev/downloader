import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/50 dark:border-neutral-800/30 py-8 px-6 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            CodeLove Downloader Portal
          </span>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 max-w-md">
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
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-1">
            &copy; {new Date().getFullYear()} CodeLove
          </span>
        </div>
      </div>
    </footer>
  );
}
