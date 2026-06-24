import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pinterest Multi Video Downloader - Download Multiple Pinterest Videos",
  description: "Best Pinterest Multi Video Downloader. Download multiple Pinterest videos, reels, and pins at once for free. Batch download high-quality Pinterest media easily.",
  keywords: [
    "pinterest multi video downloader",
    "batch pinterest downloader",
    "download multiple pinterest videos",
    "pinterest mass downloader",
    "pinterest video downloader free",
    "bulk pinterest download",
    "pinterest batch downloader"
  ],
  openGraph: {
    title: "Pinterest Multi Video Downloader - Batch Download Pinterest Videos",
    description: "Best Pinterest Multi Video Downloader. Download multiple Pinterest videos, reels, and pins at once for free. Batch download high-quality Pinterest media easily.",
    url: "https://downloader.codelove.in/pinterest/multi-url",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/pinterest/multi-url",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pinterest Multi Video Downloader",
  "url": "https://downloader.codelove.in/pinterest/multi-url",
  "description": "Best Pinterest Multi Video Downloader to download multiple high-quality Pinterest videos and reels for free.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function PinterestMultiLayout({
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
