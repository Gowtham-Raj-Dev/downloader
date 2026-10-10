import { Metadata } from 'next';
import InfoPage, { InfoLink, InfoSection } from '@/components/InfoPage';
import { CONTACT_EMAIL, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How CodeLove Downloader handles your data: what is collected, how cookies, analytics and advertising work, and the choices you have.',
  path: '/privacy',
});

export default function PrivacyPolicyPage() {
  return (
    <InfoPage title="Privacy Policy" lastUpdated="October 10, 2026">
      <InfoSection heading="1. Overview">
        <p>
          CodeLove Downloader (downloader.codelove.in) is a free tool for saving publicly available Instagram and Pinterest media. This policy explains what information is processed when you use it. You can use every tool on this site without creating an account.
        </p>
      </InfoSection>

      <InfoSection heading="2. Information We Collect">
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Links you submit.</strong> When you paste a link and press Fetch, the link is sent to our server so the media can be located. To do that, the link may be passed to third-party media-fetching services. We do not ask for your Instagram or Pinterest login, and we do not keep a download history tied to you.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Media files.</strong> Files are fetched on request and streamed to your browser. We do not keep copies of the media you download.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Technical data.</strong> Like most websites, our hosting provider automatically records standard request data such as IP address, browser type, device type and the time of the request. This is used to keep the service running and to prevent abuse.
        </p>
        <p>
          <strong className="text-neutral-800 dark:text-neutral-200">Analytics.</strong> We use Google Analytics to understand how the site is used (for example which pages are visited and from which country). Google Analytics sets cookies and collects usage data in aggregated form.
        </p>
      </InfoSection>

      <InfoSection heading="3. Cookies and Local Storage">
        <p>
          We use your browser&apos;s local storage to remember interface preferences, such as dark mode and whether you have dismissed a help popup. Google Analytics uses cookies to measure traffic. Advertising partners may also use cookies, as described in the next section. You can block or delete cookies in your browser settings; the downloader keeps working without them.
        </p>
      </InfoSection>

      <InfoSection heading="4. Advertising">
        <p>
          We use, or may use, Google AdSense to show ads on this site. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and other sites on the Internet.
        </p>
        <p>
          You can opt out of personalised advertising in{' '}
          <InfoLink href="https://adssettings.google.com">Google Ads Settings</InfoLink>, and you can opt out of other vendors&apos; use of cookies for personalised advertising at{' '}
          <InfoLink href="https://www.aboutads.info">www.aboutads.info</InfoLink>. To learn how Google uses information from sites that use its services, see{' '}
          <InfoLink href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use our services</InfoLink>.
        </p>
      </InfoSection>

      <InfoSection heading="5. Third-Party Platforms">
        <p>
          This service fetches publicly available media from Instagram and Pinterest. We are not affiliated with, endorsed by, or sponsored by these platforms, and your use of them is subject to their own terms and privacy policies.
        </p>
      </InfoSection>

      <InfoSection heading="6. Children's Privacy">
        <p>
          This site is not directed to children under 13, and we do not knowingly collect personal information from them.
        </p>
      </InfoSection>

      <InfoSection heading="7. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with a new &quot;Last updated&quot; date.
        </p>
      </InfoSection>

      <InfoSection heading="8. Contact">
        <p>
          Questions about this policy can be sent to{' '}
          <InfoLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</InfoLink> or through our{' '}
          <InfoLink href="/contact">contact page</InfoLink>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
