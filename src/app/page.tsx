import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Insta Downloader by CodeLove - Download Instagram Reels, Videos & Photos Free" },
  description: "Free Insta Downloader: save public Instagram Reels, videos and photos in HD with no watermark and no login. Works on iPhone, Android and PC. Pinterest downloads too.",
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
