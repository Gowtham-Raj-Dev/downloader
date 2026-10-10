import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Pinterest Multi Video Downloader - Download Multiple Pinterest Videos",
  description: "Best Pinterest Multi Video Downloader. Download multiple Pinterest videos, reels, and pins at once for free. Batch download high-quality Pinterest media easily.",
  path: "/pinterest/video/multi-url",
  keywords: [
    "pinterest multi video downloader",
    "batch pinterest downloader",
    "download multiple pinterest videos",
    "pinterest mass downloader",
    "pinterest video downloader free",
    "bulk pinterest download",
    "pinterest batch downloader"
  ],
});

const jsonLd = toolJsonLd({
  name: "Pinterest Multi Video Downloader",
  description: "Best Pinterest Multi Video Downloader to download multiple high-quality Pinterest videos and reels for free.",
  path: "/pinterest/video/multi-url",
  crumbs: [
    { name: "Pinterest Video Downloader", path: "/pinterest/video" },
    { name: "Multiple Links", path: "/pinterest/video/multi-url" },
  ],
});

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
