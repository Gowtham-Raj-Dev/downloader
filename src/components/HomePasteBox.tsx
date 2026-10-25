'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clipboard, Link as LinkIcon } from 'lucide-react';

// Home-page link box: sends the pasted link to the Insta Downloader, which fetches it straight away.
export default function HomePasteBox() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      setUrl((await navigator.clipboard.readText()).trim());
      setError(null);
    } catch {
      setError('Your browser blocked clipboard access — long-press the box and choose Paste instead.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = url.trim();
    if (!link) return;
    if (/pinterest\.|pin\.it/i.test(link)) {
      router.push('/pinterest/video');
      return;
    }
    if (!/instagram\.com|instagr\.am/i.test(link)) {
      setError('That does not look like an Instagram link. Copy the link of a public Reel, video or post and try again.');
      return;
    }
    router.push(`/instagram?url=${encodeURIComponent(link)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-2xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 shadow-xl shadow-pink-500/5 focus-within:ring-2 focus-within:ring-instagram-pink/40 transition">
        <label className="relative flex-1 flex items-center">
          <span className="sr-only">Instagram link</span>
          <LinkIcon className="absolute left-4 w-4 h-4 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="Paste an Instagram Reel, video or post link"
            className="w-full h-12 pl-11 pr-32 bg-transparent text-[15px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-0 inline-flex items-center justify-center gap-1.5 h-11 w-[120px] rounded-xl text-sm font-bold text-neutral-600 dark:text-zinc-300 bg-neutral-100 dark:bg-zinc-900 hover:bg-neutral-200 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <Clipboard className="w-3.5 h-3.5" /> Paste
          </button>
        </label>
        <button
          type="submit"
          disabled={!url.trim()}
          className="inline-flex items-center justify-center gap-2 h-11 sm:w-[120px] rounded-xl text-sm font-bold text-white bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
        >
          Download <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
