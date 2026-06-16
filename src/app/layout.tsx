import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://downloader.codelove.in'),
  title: {
    template: "%s | MediaExplorer Hub",
    default: "Free Video Downloader - Insta Downloader & YouTube Loader",
  },
  description: "Best free video downloader online. Fast, responsive, and free insta downloader and YouTube downloader tool. Download public Instagram videos, reels, and YouTube shorts instantly.",
  keywords: [
    "free downloader",
    "free video downloader",
    "insta downloader",
    "insta downloader free",
    "instagram downloader",
    "youtube downloader",
    "instagram reels downloader",
    "download instagram video",
    "instagram lodader",
    "free insta videos download",
    "multi url video downloader",
    "bulk downloader",
    "batch video download",
    "video download online free"
  ],
  authors: [{ name: "MediaExplorer Team", url: "https://downloader.codelove.in" }],
  creator: "MediaExplorer",
  publisher: "MediaExplorer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://downloader.codelove.in/",
    title: "Free Video Downloader - Insta Downloader & YouTube Loader",
    description: "Best free video downloader online. Fast, responsive, and free insta downloader and YouTube downloader tool. Download public Instagram videos, reels, and YouTube shorts instantly.",
    siteName: "MediaExplorer Downloader",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Video Downloader - Insta Downloader & YouTube Loader",
    description: "Best free video downloader online. Fast, responsive, and free insta downloader and YouTube downloader tool.",
    creator: "@mediaexplorer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "add-your-google-site-verification-here", // User can replace this later
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MediaExplorer Free Video Downloader",
  "url": "https://downloader.codelove.in",
  "description": "Best free video downloader online. Fast, responsive, and free insta downloader and YouTube downloader tool.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://downloader.codelove.in/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-black transition-colors duration-300"
      >
        {children}
      </body>
    </html>
  );
}
