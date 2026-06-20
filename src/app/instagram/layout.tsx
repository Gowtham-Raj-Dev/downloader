import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Insta Downloader - Free Instagram Video & Reels Downloader",
  description: "Best Insta Downloader to download high-quality Instagram videos, Reels, and photos for free. Download single or multiple Instagram videos (batch & multi-URL) instantly.",
  keywords: [
    "insta downloader",
    "insta downloader free",
    "instagram downloader",
    "insta video downloader",
    "instagram reels downloader",
    "ig downloader",
    "ig video downloader",
    "instagram video download",
    "download instagram reels",
    "free insta videos download",
    "multi url instagram downloader",
    "bulk instagram downloader",
    "download multiple instagram videos",
    "insta reels downloader",
    "instagram photo downloader"
  ],
  openGraph: {
    title: "Insta Downloader - Free Instagram Video & Reels Downloader",
    description: "Best Insta Downloader to download high-quality Instagram videos, Reels, and photos for free. Download single or multiple Instagram videos (batch & multi-URL) instantly.",
    url: "https://downloader.codelove.in/instagram",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/instagram",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Insta Downloader",
  "url": "https://downloader.codelove.in/instagram",
  "description": "Best Insta Downloader to download high-quality Instagram videos, Reels, and photos for free.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
