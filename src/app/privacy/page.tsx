import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | CodeLove',
  description: 'Privacy Policy for CodeLove hub.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-50 selection:bg-rose-500/20 selection:text-rose-600 dark:selection:text-rose-400">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="glass-panel p-8 md:p-12 rounded-outer border border-neutral-200/60 dark:border-zinc-800/80 shadow-premium dark:shadow-premium-dark bg-white dark:bg-zinc-950">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
            Privacy Policy
          </h1>
          
          <div className="space-y-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">1. Information We Collect</h2>
              <p>
                CodeLove is designed to be a frictionless tool. We do not require account registration, and we do not actively collect personally identifiable information (PII) such as your name, email address, or phone number. We only collect anonymous usage data to improve our service performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">2. How We Use Your Information</h2>
              <p>
                Any non-personal data (such as browser type, device type, or approximate geographical region) collected through standard analytics is used exclusively to optimize user experience, ensure our servers scale to demand, and prevent abuse of our API endpoints.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">3. Cookies and Tracking</h2>
              <p>
                We use local storage strictly for saving your UI preferences (such as dark mode settings). We do not use tracking cookies for targeted advertising or cross-site tracking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">4. Third-Party Services</h2>
              <p>
                Our service interacts with public APIs (like YouTube and Instagram) to fetch media. We are not affiliated with these platforms, and any data passed through them is subject to their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">5. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this page periodically.
              </p>
            </section>

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
