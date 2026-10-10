import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Pinterest Multi Image Downloader - Batch Download Pinterest Pictures",
  description: "Best Pinterest Multi Image Downloader. Download multiple Pinterest pictures, pins, and photos at once for free. Batch download high-quality Pinterest images easily.",
  path: "/pinterest/image/multi-url",
  keywords: [
    "pinterest multi image downloader",
    "batch pinterest image downloader",
    "download multiple pinterest images",
    "pinterest photo mass downloader",
    "pinterest image downloader free",
    "bulk pinterest image download",
    "pinterest image batch downloader"
  ],
});

const jsonLd = toolJsonLd({
  name: "Pinterest Multi Image Downloader",
  description: "Best Pinterest Multi Image Downloader to download multiple high-quality Pinterest pictures and pins for free.",
  path: "/pinterest/image/multi-url",
  crumbs: [
    { name: "Pinterest Image Downloader", path: "/pinterest/image" },
    { name: "Multiple Links", path: "/pinterest/image/multi-url" },
  ],
});

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
