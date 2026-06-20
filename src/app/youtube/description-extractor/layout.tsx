import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "YouTube Shorts Description Extractor - Copy Titles & Text",
  description: "Extract and copy the title, description, and hashtags from any YouTube Shorts or video link easily for free.",
  keywords: [
    "youtube shorts description extractor",
    "extract youtube description",
    "copy youtube shorts description",
    "youtube title extractor",
    "youtube description copy tool",
    "free youtube text extractor"
  ],
  openGraph: {
    title: "YouTube Shorts Description Extractor - Copy Titles & Text",
    description: "Extract and copy the title, description, and hashtags from any YouTube Shorts or video link easily for free.",
    url: "https://downloader.codelove.in/youtube/description-extractor",
  },
  alternates: {
    canonical: "https://downloader.codelove.in/youtube/description-extractor",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "YouTube Shorts Description Extractor",
  "url": "https://downloader.codelove.in/youtube/description-extractor",
  "description": "Extract and copy the title, description, and hashtags from any YouTube Shorts or video link easily for free.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function YTDescriptionLayout({
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
