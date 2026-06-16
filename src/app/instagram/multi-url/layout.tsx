import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Multiple Instagram Video Downloader - Download Reels",
  description: "Download multiple Instagram videos, Reels, and photos at once. Free multi-URL Instagram downloader without login.",
  keywords: [
    "multiple instagram downloader",
    "multi url instagram downloader",
    "multiple instagram video download",
    "download multiple instagram videos",
    "batch instagram video download",
    "bulk instagram downloader free"
  ],
  openGraph: {
    title: "Free Multiple Instagram Video Downloader - Download Reels",
    description: "Download multiple Instagram videos, Reels, and photos at once. Free multi-URL Instagram downloader.",
    url: "https://downloader.codelove.in/instagram/multi-url",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/instagram/multi-url",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Multiple Instagram Video Downloader",
  "url": "https://downloader.codelove.in/instagram/multi-url",
  "description": "Download multiple Instagram videos, Reels, and photos at once in bulk.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function MultipleInstagramLayout({
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
