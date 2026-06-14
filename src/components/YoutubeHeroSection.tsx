'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, ArrowRight, Sparkles, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

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

interface YoutubeHeroSectionProps {
  onFetch: (inputs: string[]) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function YoutubeHeroSection({ onFetch, isLoading, error }: YoutubeHeroSectionProps) {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [urlFields, setUrlFields] = useState<string[]>(['', '']); // 2 empty boxes by default

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.warn('Failed to read clipboard text: ', err);
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...urlFields];
    newFields[index] = value;
    setUrlFields(newFields);
  };

  const handleAddField = () => {
    setUrlFields([...urlFields, '']);
  };

  const handleRemoveField = (index: number) => {
    if (urlFields.length <= 1) return;
    const newFields = urlFields.filter((_, i) => i !== index);
    setUrlFields(newFields);
  };

  const handlePasteToField = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      handleFieldChange(index, text);
    } catch (err) {
      console.warn('Failed to read clipboard text: ', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'single') {
      const cleanUrl = url.trim();
      if (!cleanUrl) return;
      const rawInputs = cleanUrl.split(/[\s,\n]+/).filter(x => x.trim().length > 0);
      onFetch(rawInputs);
    } else {
      const nonEmpty = urlFields.map(f => f.trim()).filter(f => f.length > 0);
      if (nonEmpty.length === 0) return;
      onFetch(nonEmpty);
    }
  };

  const isSubmitDisabled = activeTab === 'single'
    ? !url.trim()
    : urlFields.every(field => !field.trim());

  return (
    <div className="w-full max-w-4xl mx-auto text-center px-4 py-8 md:py-16">
      {/* Sparkle Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600/10 to-rose-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-6"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Instantly download YouTube videos, shorts & audio</span>
      </motion.div>

      {/* Hero Headings */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6"
      >
        Explore & Download <br className="hidden sm:inline" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-500 to-orange-500">
          YouTube Videos
        </span>{' '}
        Instantly
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
      >
        Paste any YouTube Video or Shorts link and instantly fetch, play, and download your media.
      </motion.p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-6 p-4 rounded-button bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel w-full max-w-2xl mx-auto p-5 rounded-outer shadow-premium dark:shadow-premium-dark border border-neutral-200/50 dark:border-neutral-800/30 bg-white dark:bg-zinc-950"
      >
        {/* Modern Switcher Tabs */}
        <div className="flex border-b border-neutral-200/50 dark:border-neutral-800/30 mb-5 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('single');
              setUrl('');
            }}
            className={`flex-1 pb-3 font-bold uppercase tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'single'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            Single Link
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('batch');
              setUrl('');
            }}
            className={`flex-1 pb-3 font-bold uppercase tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'batch'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            Multiple Links (Batch)
          </button>
        </div>

        {activeTab === 'single' ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full flex items-center">
              <div className="absolute left-4 text-neutral-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube watch URL or Shorts link (e.g. youtube.com/watch?v=...)"
                className="w-full pl-11 pr-24 py-3.5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 dark:focus:ring-red-500/50 transition-all text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 px-3 py-1 text-[10px] font-bold uppercase rounded bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                title="Paste from clipboard"
                disabled={isLoading}
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitDisabled}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-semibold rounded-button shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none min-h-[46px]"
            >
              <span>Fetch Videos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {urlFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="relative flex-1 flex items-center">
                    <div className="absolute left-4 text-neutral-400">
                      <span className="text-xs font-mono font-bold text-neutral-500">{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={field}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Paste YouTube video URL #${index + 1}`}
                      className="w-full pl-10 pr-20 py-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 dark:focus:ring-red-500/50 transition-all text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => handlePasteToField(index)}
                      className="absolute right-3 px-3 py-1 text-[10px] font-bold uppercase rounded bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      disabled={isLoading}
                    >
                      <Clipboard className="w-3 h-3" />
                      <span>Paste</span>
                    </button>
                  </div>
                  {urlFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="p-3 rounded-button text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-800 hover:border-red-200/50 dark:hover:border-red-800/30"
                      title="Remove link"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleAddField}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-button bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                <span>Add URL Box</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || isSubmitDisabled}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-semibold rounded-button shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none min-h-[46px]"
              >
                <span>Fetch Videos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Helper Note */}
        <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
          <span>Supports YouTube Videos, Shorts, and Embed links.</span>
        </div>
      </motion.div>
    </div>
  );
}
