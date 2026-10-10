import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Free Multiple Instagram Video Downloader - Download Reels",
  description: "Download multiple Instagram videos, Reels, and photos at once. Free multi-URL Instagram downloader without login.",
  path: "/instagram/multi-url",
  keywords: [
    "multiple instagram downloader",
    "multi url instagram downloader",
    "multiple instagram video download",
    "download multiple instagram videos",
    "batch instagram video download",
    "bulk instagram downloader free",
    "insta downloader",
    "insta downloader free",
    "instagram downloader",
    "insta video downloader"
  ],
});

const jsonLd = toolJsonLd({
  name: "Multiple Instagram Video Downloader",
  description: "Download multiple Instagram videos, Reels, and photos at once in bulk.",
  path: "/instagram/multi-url",
  crumbs: [
    { name: "Instagram Downloader", path: "/instagram" },
    { name: "Multiple Links", path: "/instagram/multi-url" },
  ],
});

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
