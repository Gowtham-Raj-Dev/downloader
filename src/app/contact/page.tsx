import { Metadata } from 'next';
import InfoPage, { InfoLink, InfoSection } from '@/components/InfoPage';
import { CONTACT_EMAIL, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Get in touch with the CodeLove Downloader team for support, bug reports, feedback or copyright concerns.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us">
      <InfoSection heading="Email">
        <p>
          The best way to reach us is by email at{' '}
          <InfoLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</InfoLink>.
        </p>
      </InfoSection>

      <InfoSection heading="Reporting a Problem">
        <p>
          If a download is not working, it helps us a lot if you include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The link you were trying to download.</li>
          <li>Which tool you used (Instagram, Pinterest video or Pinterest image).</li>
          <li>Your device and browser, and the error message you saw.</li>
        </ul>
        <p>
          Please note that private accounts and restricted posts cannot be fetched by design.
        </p>
      </InfoSection>

      <InfoSection heading="Copyright Concerns">
        <p>
          If you own content and believe this service is being used to infringe your rights, email us at the address above with the details and we will look into it. See our{' '}
          <InfoLink href="/terms">Terms &amp; Conditions</InfoLink> for more.
        </p>
      </InfoSection>

      <InfoSection heading="Feedback">
        <p>
          Suggestions for new features or improvements are always welcome. You can also read more{' '}
          <InfoLink href="/about">about the project</InfoLink>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
