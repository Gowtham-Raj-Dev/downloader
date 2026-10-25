import Link from 'next/link';

// Reference content under the Insta Downloader tool: which links work and what each kind of post gives you.
const LINK_FORMATS = [
  { kind: 'Reel', example: 'instagram.com/reel/C8xYz…', result: 'MP4 video with sound' },
  { kind: 'Video post', example: 'instagram.com/p/C8xYz…', result: 'MP4 video' },
  { kind: 'Former IGTV', example: 'instagram.com/tv/C8xYz…', result: 'MP4 video' },
  { kind: 'Photo post', example: 'instagram.com/p/C8xYz…', result: 'Full-size JPG' },
];

const TIPS = [
  {
    title: 'Copy the post link, not the profile',
    text: 'A profile link (instagram.com/username) has nothing to download. Open the Reel or post itself and use Share → Copy link.',
  },
  {
    title: 'Short links work too',
    text: 'Links copied from the app often end in ?igsh=… — paste them as they are. The tracking part is ignored.',
  },
  {
    title: 'Saving many Reels?',
    text: 'Switch to the Multiple Links tab and paste one link per box, then download them one by one or all together.',
  },
  {
    title: 'Need just the audio or a still?',
    text: 'After downloading, use Video to Images to pull the audio out as MP3 or grab a frame as a JPG thumbnail.',
  },
];

export default function InstaGuide() {
  return (
    <section className="max-w-4xl mx-auto px-4 mt-20 space-y-14 text-left" aria-labelledby="insta-guide">
      <div>
        <h2 id="insta-guide" className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Which Instagram links can I download?
        </h2>
        <p className="mt-3 text-sm md:text-base text-neutral-600 dark:text-zinc-400 leading-relaxed">
          Insta Downloader accepts the link of any public Reel, video or photo post. Here is what each kind of link
          looks like and what you get back.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-neutral-500 dark:text-zinc-500">
              <tr className="border-b border-neutral-200/80 dark:border-zinc-800/80">
                <th className="px-5 py-3 font-bold">Post type</th>
                <th className="px-5 py-3 font-bold">Link looks like</th>
                <th className="px-5 py-3 font-bold">You get</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-zinc-300">
              {LINK_FORMATS.map((row) => (
                <tr key={row.kind} className="border-b last:border-0 border-neutral-100 dark:border-zinc-900">
                  <td className="px-5 py-3 font-semibold whitespace-nowrap">{row.kind}</td>
                  <td className="px-5 py-3 font-mono text-xs text-neutral-500 dark:text-zinc-400 whitespace-nowrap">{row.example}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-zinc-500">
          Private accounts, close-friends Stories and age-restricted posts cannot be downloaded.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Tips for downloading Instagram Reels
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-2xl border border-neutral-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5">
              <h3 className="font-bold text-neutral-900 dark:text-white">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{tip.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-600 dark:text-zinc-400">
          New to this? Read the full{' '}
          <Link href="/#how-it-works" className="font-semibold text-instagram-pink underline underline-offset-2">step-by-step guide</Link>,
          see{' '}
          <Link href="/#devices" className="font-semibold text-instagram-pink underline underline-offset-2">where files are saved on iPhone and Android</Link>, or
          check the{' '}
          <Link href="/#faq" className="font-semibold text-instagram-pink underline underline-offset-2">FAQ</Link>.
        </p>
      </div>
    </section>
  );
}
