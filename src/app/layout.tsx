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
  title: {
    template: "%s | MediaExplorer Hub",
    default: "Free Instagram & YouTube Video Downloader - MediaExplorer",
  },
  description: "Download public Instagram videos, reels, and YouTube shorts with a modern visual interface. Fast, responsive, and free video downloader tool.",
  keywords: [
    "instagram video downloader",
    "instagram downloader",
    "youtube downloader",
    "instagram reels downloader",
    "free video downloader",
    "download instagram video",
    "insta downloader free",
    "instagram lodader",
    "free insta videos download",
    "multi url video downloader",
    "bulk downloader",
    "batch video download"
  ],
  authors: [{ name: "MediaExplorer Team" }],
  openGraph: {
    type: "website",
    title: "Free Instagram & YouTube Video Downloader - MediaExplorer",
    description: "Download public Instagram videos and reels with a modern visual interface.",
    siteName: "MediaExplorer",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-black transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
