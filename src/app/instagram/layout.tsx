import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Insta Downloader Free - Batch & Multi-URL Instagram Loader",
  description: "Download high-quality Instagram videos, Reels, and photos for free. Best multi-URL Insta downloader tool online. Download multiple videos at once in bulk.",
  keywords: [
    "Insta downloader free",
    "insta downloader",
    "instagram lodader",
    "free insta videos download",
    "instagram reels downloader",
    "ig video downloader",
    "multi url instagram downloader",
    "bulk instagram downloader",
    "download multiple instagram videos"
  ],
  openGraph: {
    title: "Insta Downloader Free - Batch & Multi-URL Instagram Loader",
    description: "Download high-quality Instagram videos, Reels, and photos for free. Best multi-URL Insta downloader tool online.",
    url: "https://downloader.codelove.in/instagram",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/instagram",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Insta Downloader Free",
  "url": "https://downloader.codelove.in/instagram",
  "description": "Download high-quality Instagram videos, Reels, and photos for free.",
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
