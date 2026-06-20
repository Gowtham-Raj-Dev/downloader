'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Check, FileText, Hash } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

interface ExtractedData {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
}

export default function YTDescriptionExtractorPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractedData | null>(null);

  // Copy states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/youtube/description?url=${encodeURIComponent(url)}`);
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to extract data.');
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the description.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleReset = () => {
    setUrl('');
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-red-500/20 selection:text-red-600 dark:selection:text-red-500">
      <Header />

      <main className="flex-1 w-full flex flex-col items-center py-6 md:py-12">
        <AnimatePresence mode="wait">
          {!data && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-3xl mx-auto px-4 text-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-6">
                <FileText className="w-3.5 h-3.5" />
                <span>Text Extractor Tool</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-4">
                YouTube Shorts <br />
                <span className="shine-youtube">
                  Description Extractor
                </span>
              </h1>

              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Paste any YouTube Shorts or Video link below to instantly extract its title, description, and hashtags. Perfect for copying text from Shorts where it&apos;s hard to do so!
              </p>

              <form onSubmit={handleFetch} className="glass-panel p-4 md:p-6 rounded-outer shadow-premium dark:shadow-premium-dark border border-neutral-200/50 dark:border-neutral-800/30 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube Shorts or Video link here..."
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-neutral-800 dark:text-neutral-200"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-button shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Extracting...' : 'Extract Text'}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 rounded-button bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-semibold">
                  ⚠️ {error}
                </div>
              )}
            </motion.div>
          )}

          {data && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl mx-auto px-4"
            >
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-button bg-neutral-100 dark:bg-zinc-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-zinc-800/50 mb-6 hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Extract Another Link</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Title Section */}
                <div className="md:col-span-3 glass-panel p-6 rounded-outer border border-neutral-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" /> Video Title
                    </h2>
                    <button
                      onClick={() => copyToClipboard(data.title, setCopiedTitle)}
                      className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedTitle ? <><Check className="w-3.5 h-3.5 text-green-500"/> Copied</> : <><Copy className="w-3.5 h-3.5"/> Copy Title</>}
                    </button>
                  </div>
                  <p className="text-lg md:text-xl font-extrabold text-neutral-900 dark:text-white">
                    {data.title}
                  </p>
                </div>

                {/* Description Section */}
                <div className="md:col-span-2 glass-panel p-6 rounded-outer border border-neutral-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h2 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" /> Full Description
                    </h2>
                    <button
                      onClick={() => copyToClipboard(data.description, setCopiedDesc)}
                      className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedDesc ? <><Check className="w-3.5 h-3.5 text-green-500"/> Copied</> : <><Copy className="w-3.5 h-3.5"/> Copy Desc</>}
                    </button>
                  </div>
                  <div className="flex-1 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200/50 dark:border-zinc-800/50 rounded-xl p-4 overflow-y-auto max-h-[400px] whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300 custom-scrollbar">
                    {data.description || <span className="italic text-neutral-400">No description found for this video.</span>}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="md:col-span-1 flex flex-col gap-6">
                  <div className="glass-panel p-6 rounded-outer border border-neutral-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 flex-1">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h2 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                        <Hash className="w-4 h-4 text-red-500" /> Tags / Hashtags
                      </h2>
                      <button
                        onClick={() => {
                          const allTags = [...data.tags, ...data.hashtags].join(', ');
                          copyToClipboard(allTags, setCopiedTags);
                        }}
                        className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedTags ? <><Check className="w-3.5 h-3.5 text-green-500"/> Copied</> : <><Copy className="w-3.5 h-3.5"/> Copy All</>}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {data.hashtags.map((tag, idx) => (
                        <span key={`hash-${idx}`} className="px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-md">
                          {tag}
                        </span>
                      ))}
                      {data.tags.map((tag, idx) => (
                        <span key={`tag-${idx}`} className="px-2 py-1 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold rounded-md border border-neutral-200 dark:border-zinc-700">
                          {tag}
                        </span>
                      ))}
                      {data.tags.length === 0 && data.hashtags.length === 0 && (
                        <span className="text-sm text-neutral-400 italic">No tags found.</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it Works Section */}
        {!data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto px-4 mt-20 mb-12 text-center sm:text-left"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mb-8 text-center">
              How to Extract YouTube Descriptions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-card border border-neutral-200/50 dark:border-zinc-800/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xl mb-4 border border-red-200 dark:border-red-800/50 shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white mb-2">
                  Copy the Link
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Open the YouTube app or website. Find the video or Shorts you want, click Share, and select <strong className="text-neutral-800 dark:text-neutral-200">Copy Link</strong>.
                </p>
              </div>

              <div className="glass-card p-6 rounded-card border border-neutral-200/50 dark:border-zinc-800/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl mb-4 border border-orange-200 dark:border-orange-800/50 shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white mb-2">
                  Paste & Extract
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Paste the copied link into the input box above and hit <strong className="text-neutral-800 dark:text-neutral-200">Extract Text</strong>. Our tool will instantly fetch the hidden description.
                </p>
              </div>

              <div className="glass-card p-6 rounded-card border border-neutral-200/50 dark:border-zinc-800/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xl mb-4 border border-green-200 dark:border-green-800/50 shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white mb-2">
                  1-Click Copy
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Review the extracted Title, Description, and Hashtags. Use the handy <strong className="text-neutral-800 dark:text-neutral-200">Copy</strong> buttons to save them to your clipboard instantly!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
