import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "YouTube Downloader Free - Bulk & Multi-URL YT Shorts Download",
  description: "Fast and free multi-URL YouTube downloader. Download YT videos, Shorts, and clips in bulk directly in MP4 format. Zero wait time for batch downloads.",
  keywords: [
    "youtube downloader free",
    "yt video download",
    "free youtube videos download",
    "youtube shorts downloader",
    "download youtube video free",
    "youtube mp4 downloader",
    "multi url youtube downloader",
    "bulk youtube downloader",
    "batch youtube downloader"
  ],
  openGraph: {
    title: "YouTube Downloader Free - Bulk & Multi-URL YT Shorts Download",
    description: "Fast and free multi-URL YouTube downloader. Download YT videos, Shorts, and clips in bulk directly in MP4 format.",
    url: "https://downloader.codelove.in/youtube",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/youtube",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "YouTube Downloader Free",
  "url": "https://downloader.codelove.in/youtube",
  "description": "Fast and free multi-URL YouTube downloader. Download YT videos, Shorts, and clips in bulk.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function YoutubeLayout({
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
