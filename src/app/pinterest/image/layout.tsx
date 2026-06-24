import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pinterest Image Downloader - Download High Quality Pinterest Pictures",
  description: "Best Pinterest Image Downloader. Fast, free, and high-quality Pinterest photo and picture downloader. Save your favorite pins directly to your device.",
  keywords: [
    "pinterest image downloader",
    "pinterest photo downloader",
    "download pinterest pictures",
    "pinterest picture saver",
    "free pinterest image download",
    "save pin image",
    "high quality pinterest download"
  ],
  openGraph: {
    title: "Pinterest Image Downloader - Free Pinterest Photo Downloader",
    description: "Best Pinterest Image Downloader. Fast, free, and high-quality Pinterest photo and picture downloader. Save your favorite pins directly to your device.",
    url: "https://downloader.codelove.in/pinterest/image",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/pinterest/image",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pinterest Image Downloader",
  "url": "https://downloader.codelove.in/pinterest/image",
  "description": "Best Pinterest Image Downloader to download high-quality Pinterest pictures and photos for free.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function PinterestImageLayout({
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
