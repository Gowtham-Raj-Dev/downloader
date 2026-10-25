import Link from 'next/link';
import {
  ArrowRight, BadgeCheck, Ban, Clapperboard, Copy, Download, Film, Gauge, Globe, Images, Infinity as InfinityIcon,
  Laptop, Layers, Lock, MonitorSmartphone, Smartphone, Sparkles, UserX, Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePasteBox from '@/components/HomePasteBox';
import { SITE_URL } from '@/lib/site';

// One list drives both the visible FAQ and its FAQPage schema, so the two cannot drift apart.
export const FAQS = [
  {
    question: 'What is Insta Downloader?',
    answer:
      'Insta Downloader is a free online tool that saves public Instagram Reels, videos and photos to your phone or computer. You paste the link of a post, preview it, and download the original file in the best quality Instagram provides. There is no app to install and no account to create.',
  },
  {
    question: 'Is Insta Downloader free?',
    answer:
      'Yes. Downloading a single Reel, video or photo is free and needs no sign-up, no credit card and no Instagram password.',
  },
  {
    question: 'How do I download Instagram Reels?',
    answer:
      'Open the Reel in the Instagram app, tap the share (paper plane) icon and choose Copy link. Paste the link into the box on this page and press Download. The Reel opens in a preview and the Download button saves it as an MP4 file.',
  },
  {
    question: 'Can I download Instagram photos?',
    answer:
      'Yes. Paste the link of a public photo post and it is saved as a full-size JPG. For carousel posts with several slides, the downloader currently saves the first item.',
  },
  {
    question: 'Are downloads watermark-free and in HD?',
    answer:
      'Insta Downloader does not add any watermark or logo. You get the same file Instagram serves — usually 720p or 1080p for Reels and full resolution for photos. The quality cannot be higher than what the creator uploaded.',
  },
  {
    question: 'Does it work on iPhone and Android?',
    answer:
      'Yes. It runs in any modern browser: Safari and Chrome on iPhone and iPad, Chrome or Samsung Internet on Android, and every desktop browser on Windows, macOS and Linux. On iPhone, downloaded files appear in the Files app under Downloads.',
  },
  {
    question: 'Can I download private Instagram posts?',
    answer:
      'No. Only public posts can be downloaded. Content from private accounts, close-friends stories and age-restricted posts cannot be fetched, which protects people who chose not to share publicly.',
  },
  {
    question: 'Can I download several Instagram videos at once?',
    answer:
      'Yes. The multi-link Insta Downloader lets you paste a list of post links, fetch them together and download each one, or save them all in one go.',
  },
  {
    question: 'Does the account owner know I downloaded their post?',
    answer:
      'No. Insta Downloader reads the public post the same way a browser does and never logs in to Instagram, so nothing is sent to the account that posted it.',
  },
  {
    question: 'Is it legal to download Instagram videos?',
    answer:
      'Saving your own posts, or media you have the owner’s permission to use, is fine. Videos and photos posted by others remain their property: keep them for personal reference, credit the creator, and never re-upload or sell someone else’s work without permission.',
  },
];

const HOW_TO = [
  {
    icon: Copy,
    title: 'Copy the link',
    text: 'In the Instagram app, tap the share icon (paper plane) or the ⋯ menu on the Reel, video or post and choose “Copy link”. On a computer, copy the address from the browser bar.',
  },
  {
    icon: Layers,
    title: 'Paste it here',
    text: 'Paste the link into the box above and press Download. Insta Downloader fetches the post and shows a preview with the caption so you can check it is the right one.',
  },
  {
    icon: Download,
    title: 'Save the file',
    text: 'Press the download button. Videos and Reels save as MP4 and photos as JPG, straight into your Downloads folder — no watermark added.',
  },
];

const MEDIA_TYPES = [
  { icon: Clapperboard, title: 'Instagram Reels', text: 'Save Reels as MP4 with their original sound, ready to watch offline or edit.' },
  { icon: Film, title: 'Instagram videos', text: 'Download longer feed videos and former IGTV videos in the best quality available.' },
  { icon: Images, title: 'Instagram photos', text: 'Keep public photo posts as full-size JPG images, exactly as they were uploaded.' },
  { icon: Layers, title: 'Many links at once', text: 'Paste a list of post links in the multi-link downloader and save them together.' },
];

const FEATURES = [
  { icon: Ban, title: 'No watermark', text: 'Files are saved exactly as Instagram serves them — we never stamp a logo on your download.' },
  { icon: Gauge, title: 'HD quality', text: 'Get the highest resolution the post offers, typically 1080p for Reels and full size for photos.' },
  { icon: UserX, title: 'No login, no app', text: 'Never enter your Instagram password. Everything works in the browser you already have.' },
  { icon: Zap, title: 'Fast', text: 'Links are processed in seconds and the file streams straight to your device.' },
  { icon: Lock, title: 'Private', text: 'We do not keep a copy of the media you download or a history of the links you paste.' },
  { icon: InfinityIcon, title: 'Free to use', text: 'Single downloads are free, with no sign-up and no hidden payment step.' },
];

const DEVICES = [
  {
    icon: Smartphone,
    title: 'On iPhone or iPad',
    steps: [
      'Open Instagram, find the Reel or post and tap Share → Copy link.',
      'Open Safari, go to downloader.codelove.in and paste the link.',
      'Tap Download. Safari asks to confirm, then saves the file to Files → Downloads.',
      'To move a video to Photos, open it in Files, tap Share and choose Save Video.',
    ],
  },
  {
    icon: MonitorSmartphone,
    title: 'On Android',
    steps: [
      'In the Instagram app, tap the paper-plane icon and choose Copy link.',
      'Open Chrome, visit downloader.codelove.in and paste the link.',
      'Tap Download. The file goes to your Downloads folder.',
      'Your Gallery or Photos app shows the saved video or photo within a few seconds.',
    ],
  },
  {
    icon: Laptop,
    title: 'On Windows, Mac or Linux',
    steps: [
      'Open the post on instagram.com and copy the URL from the address bar.',
      'Paste it into the box at the top of this page.',
      'Click Download to save the MP4 or JPG to your Downloads folder.',
      'Have many links? Use the multi-link downloader to fetch them together.',
    ],
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to download Instagram Reels, videos and photos',
  description: 'Save a public Instagram Reel, video or photo to your phone or computer with Insta Downloader.',
  totalTime: 'PT1M',
  tool: [{ '@type': 'HowToTool', name: 'Insta Downloader' }],
  step: HOW_TO.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.title,
    text: step.text,
    url: `${SITE_URL}/#how-it-works`,
  })),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Insta Downloader',
  url: SITE_URL,
  description: 'Free online Insta Downloader for public Instagram Reels, videos and photos. HD, no watermark, no sign-up.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'All',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@id': 'https://codelove.in/#organization' },
};

const sectionTitle = 'text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white';
const sectionLead = 'mt-3 text-base text-neutral-600 dark:text-zinc-400 leading-relaxed';
const card = 'rounded-2xl border border-neutral-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950';

export default function HomeContent() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-instagram-pink/20">
      <Header />
      {[howToJsonLd, faqJsonLd, appJsonLd].map((data) => (
        <script key={data['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-r from-instagram-purple/20 via-instagram-pink/20 to-instagram-orange/20 blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-14 md:pt-24 pb-16 text-center">
            <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-instagram-pink/25 bg-instagram-pink/10 text-instagram-pink">
              <Sparkles className="w-3.5 h-3.5" /> Free · HD · No watermark · No login
            </p>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-neutral-900 dark:text-white">
              Insta Downloader
              <span className="block mt-2 bg-gradient-to-r from-instagram-purple via-instagram-pink to-instagram-orange bg-clip-text text-transparent">
                Reels, Videos &amp; Photos
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-neutral-600 dark:text-zinc-400 leading-relaxed">
              Download public Instagram Reels, videos and photos in HD — free, with no watermark and no sign-up. Paste a
              link, preview it, and save it to your iPhone, Android phone or computer.
            </p>
            <div className="mt-10 max-w-2xl mx-auto">
              <HomePasteBox />
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-neutral-600 dark:text-zinc-400">
              {['Reels', 'Videos', 'Photos', 'Multiple links'].map((label) => (
                <li key={label} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/70 border border-neutral-200 dark:border-zinc-800">
                  <BadgeCheck className="w-3.5 h-3.5 text-instagram-pink" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-24 md:space-y-32">
          {/* What you can download */}
          <section id="what-you-can-download" className="scroll-mt-24">
            <div className="max-w-2xl">
              <h2 className={sectionTitle}>What you can download from Instagram</h2>
              <p className={sectionLead}>
                One Insta Downloader for every kind of public post. Paste the link and the tool works out whether it is a
                Reel, a video or a photo.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MEDIA_TYPES.map(({ icon: Icon, title, text }) => (
                <div key={title} className={`${card} p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/5 transition`}>
                  <span className="grid place-items-center w-11 h-11 rounded-xl text-white bg-gradient-to-tr from-instagram-orange via-instagram-pink to-instagram-purple">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="scroll-mt-24">
            <div className="max-w-2xl">
              <h2 className={sectionTitle}>How to download Instagram Reels and videos</h2>
              <p className={sectionLead}>Three steps, about ten seconds. It works the same for Reels, videos and photos.</p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {HOW_TO.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className={`${card} relative p-7`}>
                  <span className="absolute top-6 right-6 text-5xl font-black text-neutral-100 dark:text-zinc-900 select-none" aria-hidden>
                    {i + 1}
                  </span>
                  <Icon className="relative w-6 h-6 text-instagram-pink" />
                  <h3 className="relative mt-5 text-lg font-bold text-neutral-900 dark:text-white">
                    Step {i + 1}: {title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Devices */}
          <section id="devices" className="scroll-mt-24">
            <div className="max-w-2xl">
              <h2 className={sectionTitle}>Download Instagram videos on any device</h2>
              <p className={sectionLead}>
                Insta Downloader runs in the browser, so there is nothing to install. Here is exactly where your files end
                up on each kind of device.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {DEVICES.map(({ icon: Icon, title, steps }) => (
                <div key={title} className={`${card} p-7`}>
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-instagram-pink/10 text-instagram-pink">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h3>
                  </div>
                  <ol className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400 list-decimal pl-5 marker:font-bold marker:text-instagram-pink">
                    {steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features" className="scroll-mt-24">
            <div className="rounded-3xl p-8 md:p-12 bg-neutral-950 dark:bg-zinc-950 border border-neutral-900 dark:border-zinc-800 text-white">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Why creators use this Insta Downloader</h2>
                <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                  Built to be quick and honest: no pop-up ad walls, no fake buttons and no app to install.
                </p>
              </div>
              <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4">
                    <span className="grid place-items-center shrink-0 w-10 h-10 rounded-xl bg-white/10 text-instagram-orange">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/instagram"
                className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-neutral-950 bg-white hover:bg-zinc-200 transition"
              >
                Open Insta Downloader <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Long-form guide */}
          <section id="guide" className="scroll-mt-24 grid gap-12 lg:grid-cols-[1fr_320px]">
            <article className="max-w-none space-y-10 text-neutral-600 dark:text-zinc-400 leading-relaxed">
              <div>
                <h2 className={sectionTitle}>A complete guide to saving Instagram media</h2>
                <p className="mt-4">
                  Instagram is built for watching, not for keeping. There is no download button for Reels or posts made by
                  other people, and the in-app “Save” only bookmarks a post inside your account — if the creator deletes
                  it, it is gone. Insta Downloader fills that gap for legitimate uses such as backing up your own Reels,
                  keeping a reference copy of a tutorial, or collecting clips a client has approved for a campaign.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">How Instagram downloading works</h3>
                <p className="mt-3">
                  Every Reel, video and photo on Instagram is stored as a normal MP4 or JPG file on Meta&apos;s servers. When
                  you open a post, the app quietly loads that file. Insta Downloader asks for the same public file using the
                  post link you paste, then hands it to you as a download. Because it only reads public posts, it never
                  needs your username or password, and it cannot see private accounts.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Getting the best quality</h3>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Copy the link of the original post, not a repost or a screen recording — reposts are often re-compressed.</li>
                  <li>Reels are usually stored at 720p or 1080p. The download is exactly what the creator uploaded; no tool can add detail that was never there.</li>
                  <li>If a video plays without sound, the creator may have used licensed music that Instagram mutes outside the app in some regions.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">If a download does not work</h3>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li><strong className="text-neutral-800 dark:text-zinc-200">“Invalid link”</strong> — make sure you copied the post link (it contains /reel/, /p/ or /tv/), not a profile link.</li>
                  <li><strong className="text-neutral-800 dark:text-zinc-200">Nothing found</strong> — the account may be private, the post deleted, or the content age-restricted.</li>
                  <li><strong className="text-neutral-800 dark:text-zinc-200">File opens instead of saving</strong> — on iPhone, tap the share icon in the video player and choose Save to Files.</li>
                  <li><strong className="text-neutral-800 dark:text-zinc-200">Still stuck?</strong> Wait a minute and try again, or <Link href="/contact" className="font-semibold text-instagram-pink underline underline-offset-2">contact us</Link> with the link.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Use downloads responsibly</h3>
                <p className="mt-3">
                  Downloading a post does not make it yours. Keep other people&apos;s Reels and photos for personal viewing,
                  credit the creator when you share an idea inspired by them, and ask permission before re-posting or using
                  their work commercially. Insta Downloader is not affiliated with Instagram or Meta, and we do not host
                  any of the media you download. Read our <Link href="/terms" className="font-semibold text-instagram-pink underline underline-offset-2">terms</Link> for details.
                </p>
              </div>
            </article>

            {/* Side panel: other tools */}
            <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
              <div className={`${card} p-6`}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Instagram tools</h3>
                <ul className="mt-4 space-y-2">
                  <ToolLink href="/instagram" title="Insta Downloader" text="Reels, videos & photos" />
                  <ToolLink href="/instagram/multi-url" title="Multi-link downloader" text="Many posts at once" />
                </ul>
              </div>
              <div className={`${card} p-6`}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Pinterest tools</h3>
                <ul className="mt-4 space-y-2">
                  <ToolLink href="/pinterest/video" title="Pinterest Video Downloader" text="Save video pins as MP4" />
                  <ToolLink href="/pinterest/image" title="Pinterest Image Downloader" text="Save image pins in full size" />
                </ul>
              </div>
              <div className={`${card} p-6`}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Edit what you saved</h3>
                <ul className="mt-4 space-y-2">
                  <ToolLink href="https://videotogif.codelove.in" title="Video to GIF" text="Turn a Reel into a GIF" />
                  <ToolLink href="https://videotoimages.codelove.in" title="Video to Images" text="Frames, MP3 audio, compress" />
                </ul>
              </div>
            </aside>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24 max-w-3xl mx-auto">
            <h2 className={`${sectionTitle} text-center`}>Insta Downloader FAQ</h2>
            <p className={`${sectionLead} text-center`}>Answers to the questions people ask most about downloading from Instagram.</p>
            <div className="mt-10 space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.question} className={`${card} group p-5 [&_summary::-webkit-details-marker]:hidden`}>
                  <summary className="flex items-center justify-between gap-4 cursor-pointer text-base font-bold text-neutral-900 dark:text-white">
                    {faq.question}
                    <span className="grid place-items-center shrink-0 w-7 h-7 rounded-full bg-neutral-100 dark:bg-zinc-900 text-neutral-500 transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center rounded-3xl p-10 md:p-14 bg-gradient-to-br from-instagram-purple via-instagram-pink to-instagram-orange text-white">
            <Globe className="w-8 h-8 mx-auto opacity-80" />
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Ready to save your first Reel?</h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">Copy a link from Instagram, paste it in, and download it in seconds — free.</p>
            <Link
              href="/instagram"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-neutral-950 bg-white hover:bg-white/90 transition"
            >
              <Download className="w-4 h-4" /> Start downloading
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ToolLink({ href, title, text }: { href: string; title: string; text: string }) {
  const inner = (
    <>
      <span className="block text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-instagram-pink transition-colors">{title}</span>
      <span className="block text-xs text-neutral-500 dark:text-zinc-500">{text}</span>
    </>
  );
  return (
    <li>
      {href.startsWith('/') ? (
        <Link href={href} className="group block rounded-lg px-2 py-1.5 -mx-2 hover:bg-neutral-50 dark:hover:bg-zinc-900">{inner}</Link>
      ) : (
        <a href={href} className="group block rounded-lg px-2 py-1.5 -mx-2 hover:bg-neutral-50 dark:hover:bg-zinc-900">{inner}</a>
      )}
    </li>
  );
}
