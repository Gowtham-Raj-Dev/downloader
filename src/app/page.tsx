import { Metadata } from 'next';
import HomeContent from '@/components/HomeContent';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: "Free Instagram & Pinterest Downloader - Videos, Reels & Images",
  description: "Free online downloader for public Instagram videos and Reels and Pinterest videos and images. No sign-up, no watermark, with multi-link batch downloads.",
  path: "",
});

export default function HomePage() {
  return <HomeContent />;
}
