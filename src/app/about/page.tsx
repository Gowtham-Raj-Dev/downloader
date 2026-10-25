import { Metadata } from 'next';
import InfoPage, { InfoLink, InfoSection } from '@/components/InfoPage';
import { MAIN_SITE_URL, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'About Insta Downloader',
  description: 'Insta Downloader is a free, no-sign-up tool for saving public Instagram videos and Reels and Pinterest videos and images. Learn what it does and who builds it.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <InfoPage title="About Insta Downloader">
      <InfoSection heading="What This Is">
        <p>
          Insta Downloader is a free web tool for saving publicly available media from Instagram and Pinterest. Paste a link, press Fetch, preview the result, and download it. There is no account to create and nothing to install.
        </p>
      </InfoSection>

      <InfoSection heading="What You Can Do">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <InfoLink href="/instagram">Instagram Downloader</InfoLink> for public videos and Reels, with a{' '}
            <InfoLink href="/instagram/multi-url">multiple-links mode</InfoLink> for several posts at once.
          </li>
          <li>
            <InfoLink href="/pinterest/video">Pinterest Video Downloader</InfoLink> for video pins, also with a{' '}
            <InfoLink href="/pinterest/video/multi-url">multiple-links mode</InfoLink>.
          </li>
          <li>
            <InfoLink href="/pinterest/image">Pinterest Image Downloader</InfoLink> for full-size pin images, with a{' '}
            <InfoLink href="/pinterest/image/multi-url">multiple-links mode</InfoLink>.
          </li>
        </ul>
      </InfoSection>

      <InfoSection heading="How It Works">
        <p>
          When you submit a link, our server looks up the public post and finds the media file behind it. You get a preview first, so you can check it is the right post before saving. The file is streamed to your browser and is not kept on our servers. Private accounts and restricted posts cannot be fetched.
        </p>
      </InfoSection>

      <InfoSection heading="Use It Responsibly">
        <p>
          The tool is meant for saving your own posts, or media you have permission to reuse. Everything you download still belongs to the person who created it, so please do not re-upload or use someone else&apos;s work without asking them. The full rules are in our{' '}
          <InfoLink href="/terms">Terms &amp; Conditions</InfoLink>.
        </p>
      </InfoSection>

      <InfoSection heading="Who Builds It">
        <p>
          This downloader is part of <InfoLink href={MAIN_SITE_URL}>CodeLove</InfoLink>, a small collection of free online tools created by Gowtham. Insta Downloader is an independent project and is not affiliated with Instagram, Meta or Pinterest.
        </p>
        <p>
          Have a question or found a bug? Reach us through the <InfoLink href="/contact">contact page</InfoLink>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
