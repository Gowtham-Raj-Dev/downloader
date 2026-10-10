'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, Zap, ArrowRight, Globe
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const Pinterest =(props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z"/>
  </svg>
);

// One list drives both the visible FAQ and its FAQPage schema, so the two cannot drift apart.
const FAQS = [
  {
    question: "Do I need to pay or create an account?",
    answer: "No, our downloader is completely free and requires no registration. You do not need to provide passwords, credit cards, or register any social credentials to download media.",
  },
  {
    question: "Are there limits on how many videos I can download?",
    answer: "None. You can download as many public Instagram videos, Reels, and Pinterest pins as you like. We support unlimited downloads with full speed rendering.",
  },
  {
    question: "Can I download private Instagram posts or members-only videos?",
    answer: "No, this tool respects content creators' privacy and security boundaries. CodeLove is designed to download publicly available media only. Private profile items or restricted age-locked videos cannot be fetched.",
  },
  {
    question: "Does it support batch downloads?",
    answer: "Yes! Both our Instagram and Pinterest downloaders feature a dedicated \"Multiple Links (Batch)\" mode. You can enter multiple links simultaneously, fetch them all, and download each one individually or save them all with one click on \"Download All\".",
  },
  {
    question: "Is it legal to download Instagram and Pinterest media?",
    answer: "Saving your own content, or media you have the owner's permission to reuse, is fine. Everything else stays the property of its creator, so do not re-upload or use other people's work without their permission.",
  },
];

export default function HomeContent() {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-500/20 selection:text-rose-600 dark:selection:text-rose-400">

      <Header />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-8 flex flex-col items-center">
        
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
            <span className="shine-home">
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

          {/* Pinterest Downloader Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative group glass-panel bg-white dark:bg-zinc-950 border border-neutral-200/60 dark:border-zinc-800/80 p-8 rounded-outer shadow-premium dark:shadow-premium-dark overflow-hidden flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-gradient-to-br from-red-600 to-red-900 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-all duration-500" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 via-[#E60023] to-red-600 text-white flex items-center justify-center shadow-lg mb-6">
                <Pinterest className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white mb-3">
                Pinterest Downloader
              </h3>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-8">
                Instantly fetch and download public Pinterest videos and media in full quality. Batch extraction supported.
              </p>
            </div>

            <Link href="/pinterest/video" className="w-full">
              <button className="w-full py-3.5 bg-gradient-to-r from-red-700 via-[#E60023] to-red-600 hover:brightness-105 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-button flex items-center justify-center gap-2 cursor-pointer shadow-md">
                <span>Open Pinterest Downloader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

        </div>

        {/* How it Works Section */}
        <section id="how-it-works" className="w-full max-w-4xl mx-auto mb-24 text-left">
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
                Open Instagram or Pinterest, select the video, Reel, or pin, and copy its public sharing link to your clipboard.
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
            Quick answers to common questions about using CodeLove downloader tool.
          </p>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group glass-panel bg-white dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-zinc-800/30 p-5 rounded-card transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  <span>{faq.question}</span>
                  <span className="ml-1.5 transition duration-300 group-open:-rotate-180 shrink-0">👇</span>
                </summary>
                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
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
                No sign-up or login needed. We never ask for your social media passwords.
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
      <Footer />
    </div>
  );
}
