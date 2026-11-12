import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Insta Downloader — Save Reels, Video & Photos Free" },
  description: "Free Insta Downloader: save Instagram Reels, videos & photos in HD with no watermark and no login on iPhone, Android and PC — Pinterest too.",
  path: "",
  keywords: [
    "insta downloader",
    "instagram downloader",
    "instagram reels downloader",
    "instagram video downloader",
    "instagram photo downloader",
    "download instagram reels",
    "ig downloader",
    "reels download",
    "insta video download",
    "save instagram video",
    "instagram downloader without watermark",
    "instagram downloader for iphone",
  ],
});

export default function HomePage() {
  return <HomeContent />;
}
