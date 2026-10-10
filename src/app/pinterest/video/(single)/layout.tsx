import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Pinterest Downloader - Free Pinterest Video & Image Downloader",
  description: "Best Pinterest Downloader to download high-quality Pinterest videos, pins, and images for free. Download single or multiple Pinterest videos easily.",
  path: "/pinterest/video",
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
});

const jsonLd = toolJsonLd({
  name: "Pinterest Downloader",
  description: "Best Pinterest Downloader to download high-quality Pinterest videos, pins, and images for free.",
  path: "/pinterest/video",
  crumbs: [{ name: "Pinterest Video Downloader", path: "/pinterest/video" }],
});

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
