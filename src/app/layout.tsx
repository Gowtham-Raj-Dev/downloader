import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { MAIN_SITE_URL, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Free Instagram & Pinterest Downloader - Videos, Reels & Images";
const DESCRIPTION = "Free online downloader for public Instagram videos and Reels and Pinterest videos and images. No sign-up, no watermark, with multi-link batch downloads.";

// Defaults only. Each page sets its own title, description and canonical through pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | CodeLove",
    default: TITLE,
  },
  description: DESCRIPTION,
  keywords: [
    "free downloader",
    "free video downloader",
    "insta downloader",
    "insta downloader free",
    "instagram downloader",
    "instagram reels downloader",
    "download instagram video",
    "free insta videos download",
    "pinterest downloader",
    "pinterest video downloader",
    "pinterest image downloader",
    "multi url video downloader",
    "bulk downloader",
    "batch video download",
    "video download online free"
  ],
  applicationName: SITE_NAME,
  authors: [{ name: "CodeLove", url: MAIN_SITE_URL }],
  creator: "CodeLove",
  publisher: "CodeLove",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${MAIN_SITE_URL}/#organization`,
      "name": "CodeLove",
      "url": MAIN_SITE_URL
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": SITE_NAME,
      "url": SITE_URL,
      "description": DESCRIPTION,
      "inLanguage": "en",
      "publisher": { "@id": `${MAIN_SITE_URL}/#organization` }
    }
  ]
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
        {/* Google AdSense - only rendered once a publisher ID is set in src/lib/adsense.ts */}
        {ADSENSE_CLIENT ? (
          <>
            <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          </>
        ) : null}
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
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-195MMH811B"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-195MMH811B');
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
