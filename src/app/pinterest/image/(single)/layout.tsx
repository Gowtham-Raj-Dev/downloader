import { Metadata } from 'next';
import { pageMetadata, toolJsonLd } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Pinterest Image Downloader - Download High Quality Pinterest Pictures",
  description: "Best Pinterest Image Downloader. Fast, free, and high-quality Pinterest photo and picture downloader. Save your favorite pins directly to your device.",
  path: "/pinterest/image",
  keywords: [
    "pinterest image downloader",
    "pinterest photo downloader",
    "download pinterest pictures",
    "pinterest picture saver",
    "free pinterest image download",
    "save pin image",
    "high quality pinterest download"
  ],
});

const jsonLd = toolJsonLd({
  name: "Pinterest Image Downloader",
  description: "Best Pinterest Image Downloader to download high-quality Pinterest pictures and photos for free.",
  path: "/pinterest/image",
  crumbs: [{ name: "Pinterest Image Downloader", path: "/pinterest/image" }],
});

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
