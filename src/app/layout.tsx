import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Video Downloader | Download Reels & Videos",
  description: "Download public Instagram videos and reels with a modern visual interface. Fast, responsive, and user-friendly Instagram downloader tool.",
  keywords: [
    "instagram video downloader",
    "instagram downloader",
    "instagram reels downloader",
    "download instagram video",
    "download instagram reels",
    "instagram reel download",
    "ig video downloader",
    "ig downloader"
  ],
  authors: [{ name: "InstaDownloader Team" }],
  openGraph: {
    type: "website",
    title: "Instagram Video Downloader | Download Reels & Videos",
    description: "Download public Instagram videos and reels with a modern visual interface.",
    siteName: "InstaDownloader",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-black transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
