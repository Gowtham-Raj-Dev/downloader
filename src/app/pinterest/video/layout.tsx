import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pinterest Downloader - Free Pinterest Video & Image Downloader",
  description: "Best Pinterest Downloader to download high-quality Pinterest videos, pins, and images for free. Download single or multiple Pinterest videos easily.",
  keywords: [
    "pinterest downloader",
    "pinterest downloader free",
    "pinterest video downloader",
    "pin downloader",
    "pinterest image downloader",
    "download pinterest video",
    "free pinterest video download",
    "pinterest story downloader",
    "pinterest gif downloader"
  ],
  openGraph: {
    title: "Pinterest Downloader - Free Pinterest Video & Image Downloader",
    description: "Best Pinterest Downloader to download high-quality Pinterest videos, pins, and images for free. Download single or multiple Pinterest videos easily.",
    url: "https://downloader.codelove.in/pinterest",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/pinterest",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pinterest Downloader",
  "url": "https://downloader.codelove.in/pinterest",
  "description": "Best Pinterest Downloader to download high-quality Pinterest videos, pins, and images for free.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function PinterestLayout({
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
