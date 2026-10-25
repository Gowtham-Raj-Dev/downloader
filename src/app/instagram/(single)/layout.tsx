import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Instagram Reels & Video Downloader - Free, HD, No Watermark",
  description: "Paste an Instagram link to download public Reels, videos and photos in HD. Free Insta Downloader with no login and no watermark, on iPhone, Android and PC.",
  path: "/instagram",
  keywords: [
    "insta downloader",
    "insta downloader free",
    "instagram downloader",
    "insta video downloader",
    "instagram reels downloader",
    "ig downloader",
    "ig video downloader",
    "instagram video download",
    "download instagram reels",
    "free insta videos download",
    "multi url instagram downloader",
    "bulk instagram downloader",
    "download multiple instagram videos",
    "insta reels downloader",
    "instagram photo downloader"
  ],
});

const jsonLd = toolJsonLd({
  name: "Insta Downloader",
  description: "Best Insta Downloader to download high-quality Instagram videos, Reels, and photos for free.",
  path: "/instagram",
  crumbs: [{ name: "Instagram Downloader", path: "/instagram" }],
});

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
