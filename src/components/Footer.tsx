import Link from 'next/link';
import { Download } from 'lucide-react';
import HeartButton from '@/components/HeartButton';
import { ContactLinks } from '@/components/ContactLinks';
import { CODELOVE_GUIDES, CODELOVE_NETWORK } from '@/lib/site';

const COLUMNS = [
  {
    title: 'Instagram',
    links: [
      { label: 'Insta Downloader', href: '/instagram' },
      { label: 'Multi-link Insta Downloader', href: '/instagram/multi-url' },
      { label: 'What you can download', href: '/#what-you-can-download' },
      { label: 'Download on iPhone & Android', href: '/#devices' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Pinterest',
    links: [
      { label: 'Pinterest Video Downloader', href: '/pinterest/video' },
      { label: 'Pinterest Image Downloader', href: '/pinterest/image' },
      { label: 'Multi-link Pinterest Video', href: '/pinterest/video/multi-url' },
      { label: 'Multi-link Pinterest Image', href: '/pinterest/image/multi-url' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
];

const heading = 'text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white';
const linkClass = 'text-sm text-neutral-500 dark:text-zinc-400 hover:text-instagram-pink dark:hover:text-white transition-colors';

export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-neutral-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-950/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-xl text-white bg-gradient-to-tr from-instagram-orange via-instagram-pink to-instagram-purple">
                <Download className="w-[18px] h-[18px]" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white">Insta Downloader</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-zinc-400">
              Free online Insta Downloader for public Instagram Reels, videos and photos — in HD, with no watermark and no
              sign-up. Pinterest video and image downloads included.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400 dark:text-zinc-500">
              Not affiliated with Instagram, Meta or Pinterest. We do not host or store any media; all files belong to their
              owners. Only download content you have the right to use.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className={heading}>{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* CodeLove network + guides */}
        <div className="mt-12 grid gap-10 border-t border-neutral-200/70 dark:border-zinc-800/70 pt-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="grid gap-8">
            <nav aria-label="CodeLove network">
              <h2 className={heading}>CodeLove network</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {CODELOVE_NETWORK.map((site) => (
                  <li key={site.href}>
                    <a href={site.href} className={linkClass}>
                      {site.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Guides">
              <h2 className={heading}>Guides</h2>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {CODELOVE_GUIDES.map((guide) => (
                  <li key={guide.href}>
                    <a href={guide.href} className={linkClass}>
                      {guide.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="max-w-[260px] lg:justify-self-end">
            <a href="https://codelove.in" aria-label="CodeLove — codelove.in" className="block w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/codelove/codelove-footer-on-light.png" alt="CodeLove" width={704} height={144} loading="lazy" className="h-12 w-auto [.dark_&]:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/codelove/codelove-footer-on-dark.png" alt="CodeLove" width={704} height={144} loading="lazy" className="hidden h-12 w-auto [.dark_&]:block" />
            </a>
            {/* What CodeLove is, in one line — same text on every CodeLove site. */}
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-zinc-400">
              CodeLove makes free web tools, apps and games for creators, students and developers — simple to use, no
              hidden fees.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200/70 dark:border-zinc-800/70 pt-6 text-sm text-neutral-500 dark:text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Insta Downloader by CodeLove. All rights reserved.</p>
          <p className="inline-flex flex-wrap items-center justify-center gap-1.5">
            Built with <HeartButton /> by{' '}
            <a href="https://gowtham.codelove.in" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-900 dark:text-white hover:text-instagram-pink transition-colors">
              Gowtham
            </a>
            <span aria-hidden="true">·</span>
            <a href="https://codelove.in" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-900 dark:text-white hover:text-instagram-pink transition-colors">
              CodeLove
            </a>
            <span aria-hidden="true">·</span>
            <ContactLinks className="text-neutral-900 dark:text-white" />
          </p>
        </div>
      </div>
    </footer>
  );
}
