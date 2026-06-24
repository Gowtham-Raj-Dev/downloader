import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pinterest Multi Image Downloader - Batch Download Pinterest Pictures",
  description: "Best Pinterest Multi Image Downloader. Download multiple Pinterest pictures, pins, and photos at once for free. Batch download high-quality Pinterest images easily.",
  keywords: [
    "pinterest multi image downloader",
    "batch pinterest image downloader",
    "download multiple pinterest images",
    "pinterest photo mass downloader",
    "pinterest image downloader free",
    "bulk pinterest image download",
    "pinterest image batch downloader"
  ],
  openGraph: {
    title: "Pinterest Multi Image Downloader - Batch Download Pinterest Pictures",
    description: "Best Pinterest Multi Image Downloader. Download multiple Pinterest pictures, pins, and photos at once for free. Batch download high-quality Pinterest images easily.",
    url: "https://downloader.codelove.in/pinterest/image/multi-url",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/pinterest/image/multi-url",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pinterest Multi Image Downloader",
  "url": "https://downloader.codelove.in/pinterest/image/multi-url",
  "description": "Best Pinterest Multi Image Downloader to download multiple high-quality Pinterest pictures and pins for free.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function PinterestMultiImageLayout({
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
