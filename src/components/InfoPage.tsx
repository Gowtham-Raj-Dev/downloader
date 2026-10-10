import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface InfoPageProps {
  title: string;
  /** Shown at the bottom as "Last updated: ...". Omit for pages that are not policies. */
  lastUpdated?: string;
  children: React.ReactNode;
}

// Shared shell for the About, Contact, Privacy and Terms pages.
export default function InfoPage({ title, lastUpdated, children }: InfoPageProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-50 selection:bg-rose-500/20 selection:text-rose-600 dark:selection:text-rose-400">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="glass-panel p-8 md:p-12 rounded-outer border border-neutral-200/60 dark:border-zinc-800/80 shadow-premium dark:shadow-premium-dark bg-white dark:bg-zinc-950">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
            {title}
          </h1>

          <div className="space-y-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {children}

            {lastUpdated && (
              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-500">
                  Last updated: {lastUpdated}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function InfoSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function InfoLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "font-semibold text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors";

  if (href.startsWith('/')) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
    >
      {children}
    </a>
  );
}
