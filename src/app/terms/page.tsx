import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms & Conditions | CodeLove',
  description: 'Terms and Conditions for using CodeLove hub.',
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-50 selection:bg-rose-500/20 selection:text-rose-600 dark:selection:text-rose-400">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="glass-panel p-8 md:p-12 rounded-outer border border-neutral-200/60 dark:border-zinc-800/80 shadow-premium dark:shadow-premium-dark bg-white dark:bg-zinc-950">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
            Terms & Conditions
          </h1>
          
          <div className="space-y-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CodeLove, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">2. Service Usage and Restrictions</h2>
              <p>
                CodeLove provides a tool to download publicly available media. You agree to use this service only for personal, non-commercial purposes. You are strictly prohibited from using our service to download copyrighted material without the explicit permission of the copyright owner.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">3. Disclaimer of Liability</h2>
              <p>
                The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. CodeLove makes no warranties, expressed or implied, regarding the availability, accuracy, or reliability of the service. We shall not be liable for any damages arising from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">4. Intellectual Property</h2>
              <p>
                We do not claim ownership of any media downloaded through our service. All videos, images, and audio belong to their respective creators and copyright holders. Our service acts merely as a conduit for accessing publicly available data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">5. Modifications to Service</h2>
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
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
