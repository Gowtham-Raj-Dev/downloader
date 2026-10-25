import { Metadata } from 'next';
import InfoPage, { InfoLink, InfoSection } from '@/components/InfoPage';
import { CONTACT_EMAIL, pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description: 'The terms for using Insta Downloader, including acceptable use, copyright responsibilities and limits of liability.',
  path: '/terms',
});

export default function TermsConditionsPage() {
  return (
    <InfoPage title="Terms & Conditions" lastUpdated="October 10, 2026">
      <InfoSection heading="1. Acceptance of Terms">
        <p>
          By accessing and using Insta Downloader, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
        </p>
      </InfoSection>

      <InfoSection heading="2. Service Usage and Restrictions">
        <p>
          Insta Downloader provides a tool to download publicly available Instagram and Pinterest media. You agree to use this service only for personal, non-commercial purposes. You are strictly prohibited from using our service to download copyrighted material without the explicit permission of the copyright owner.
        </p>
        <p>
          You may not use automated scripts to overload the service, attempt to access private or restricted content, or use the service in any way that breaks the law or the terms of the platform the media comes from.
        </p>
      </InfoSection>

      <InfoSection heading="3. Intellectual Property">
        <p>
          We do not claim ownership of any media downloaded through our service. All videos, images, and audio belong to their respective creators and copyright holders. Our service acts merely as a conduit for accessing publicly available data, and we do not host the media ourselves.
        </p>
      </InfoSection>

      <InfoSection heading="4. Copyright Concerns">
        <p>
          If you are a copyright owner and believe this service is being used to infringe your work, write to{' '}
          <InfoLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</InfoLink> with the details and we will look into it.
        </p>
      </InfoSection>

      <InfoSection heading="5. Advertising">
        <p>
          The service is free and may be supported by advertising. Ads are provided by third parties, and how they use cookies is described in our{' '}
          <InfoLink href="/privacy">Privacy Policy</InfoLink>.
        </p>
      </InfoSection>

      <InfoSection heading="6. Disclaimer of Liability">
        <p>
          The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. CodeLove makes no warranties, expressed or implied, regarding the availability, accuracy, or reliability of the service. We shall not be liable for any damages arising from your use or inability to use the service.
        </p>
      </InfoSection>

      <InfoSection heading="7. Modifications to Service">
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
