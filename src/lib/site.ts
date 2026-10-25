import type { Metadata } from 'next';

export const SITE_URL = 'https://downloader.codelove.in';
export const SITE_NAME = 'Insta Downloader by CodeLove';
export const MAIN_SITE_URL = 'https://codelove.in';
export const CONTACT_EMAIL = 'support@codelove.in';

// Shared social preview image (public/og.png, 1200x630).
export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Insta Downloader by CodeLove - free Instagram Reels, video and photo downloader',
};

// Other CodeLove sites, linked from the footer.
export const CODELOVE_NETWORK = [
  { name: 'CodeLove', href: 'https://codelove.in' },
  { name: 'Free 3D Models', href: 'https://models.codelove.in' },
  { name: 'Free 3D Games', href: 'https://games.codelove.in' },
  { name: 'Link in Bio', href: 'https://linkinbio.codelove.in' },
  { name: 'Video to GIF', href: 'https://videotogif.codelove.in' },
  { name: 'Video to Images', href: 'https://videotoimages.codelove.in' },
  { name: 'Free YouTube Automation', href: 'https://utubeflow.codelove.in' },
  { name: 'Free Java Games', href: 'https://javaplay.codelove.in' },
];

// Related guides on the main CodeLove site, linked from the footer.
export const CODELOVE_GUIDES = [
  { name: 'Complete Instagram downloader guide', href: 'https://codelove.in/learn/guide/complete-instagram-downloader-guide' },
  { name: 'How to download Pinterest videos and images', href: 'https://codelove.in/learn/guide/how-to-download-pinterest-videos-and-images' },
  { name: 'MP4 vs WebM vs MOV: video formats explained', href: 'https://codelove.in/learn/guide/best-video-formats-explained' },
  { name: 'How to extract audio from a video as MP3', href: 'https://codelove.in/learn/guide/how-to-extract-audio-from-video-as-mp3' },
];

interface PageMeta {
  /** A plain string goes through the root "%s | Insta Downloader" template; `{ absolute }` skips it. */
  title: string | { absolute: string };
  description: string;
  /** Route path starting with "/", or "" for the home page. */
  path: string;
  keywords?: string[];
}

// Per-page metadata: self-referencing canonical plus complete Open Graph / Twitter tags.
// A page that sets `openGraph` replaces the root layout's object, so everything is repeated here.
export function pageMetadata({ title, description, path, keywords }: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const shareTitle = typeof title === 'string' ? title : title.absolute;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

interface ToolSchema {
  name: string;
  description: string;
  path: string;
  /** Breadcrumb trail after "Home", ending with this page. */
  crumbs: { name: string; path: string }[];
}

// Structured data for a downloader page: the tool itself plus its breadcrumb trail.
export function toolJsonLd({ name, description, path, crumbs }: ToolSchema) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name,
        url: `${SITE_URL}${path}`,
        description,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': `${MAIN_SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '' }, ...crumbs].map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${SITE_URL}${crumb.path}`,
        })),
      },
    ],
  };
}
