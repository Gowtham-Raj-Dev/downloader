import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Multiple YouTube Video Downloader - Download Shorts & MP4",
  description: "Download multiple YouTube videos and Shorts at once in MP4. Free multi-URL YouTube video downloader.",
  keywords: [
    "multiple youtube downloader",
    "multi url youtube downloader",
    "multiple youtube video download",
    "download multiple youtube videos",
    "batch youtube downloader",
    "bulk youtube downloader free"
  ],
  openGraph: {
    title: "Free Multiple YouTube Video Downloader - Download Shorts & MP4",
    description: "Download multiple YouTube videos and Shorts at once in MP4. Free multi-URL YouTube video downloader.",
    url: "https://downloader.codelove.in/youtube/multi-url",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/youtube/multi-url",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Multiple YouTube Video Downloader",
  "url": "https://downloader.codelove.in/youtube/multi-url",
  "description": "Download multiple YouTube videos and Shorts at once in bulk.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function MultipleYoutubeLayout({
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
