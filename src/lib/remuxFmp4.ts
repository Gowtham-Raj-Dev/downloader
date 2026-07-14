/**
 * Client-side MP4 remuxer.
 *
 * Cobalt's YouTube "tunnel" endpoints mux video+audio on the fly and emit a
 * FRAGMENTED MP4 (ftyp + empty moov + moof/mdat fragments). In a fragmented
 * MP4 the movie header (mvhd) duration is written as 0 because the total length
 * isn't known when the header is streamed. Mobile gallery apps and many players
 * read mvhd and therefore show the clip as "0:00" and can't scrub it.
 *
 * We fix this in the browser (the tunnel is bound to the client's residential
 * IP, so it can't be re-fetched server-side) by remuxing the fragmented MP4
 * into a plain progressive MP4 with `-c copy -movflags +faststart`. This is a
 * stream copy (no re-encode), so it's fast and rewrites mvhd with the real
 * duration and a front-loaded moov atom.
 */
import type { FFmpeg } from '@ffmpeg/ffmpeg';

// ffmpeg-core single-threaded build works without SharedArrayBuffer /
// cross-origin isolation (COOP/COEP), which we can't guarantee on mobile.
const CORE_VERSION = '0.12.10';
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpegPromise: Promise<FFmpeg> | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    })().catch((err) => {
      // Reset so a later download can retry loading the core.
      ffmpegPromise = null;
      throw err;
    });
  }
  return ffmpegPromise;
}

/**
 * Returns true when the blob looks like a fragmented MP4 that needs remuxing
 * (contains a `moof` box). Non-fragmented / direct googlevideo files already
 * carry a correct duration and are returned untouched to save work + memory.
 */
async function isFragmentedMp4(blob: Blob): Promise<boolean> {
  // A fragmented MP4 begins with `ftyp` then `moov` then the first `moof`
  // fairly early. Scan the first 256 KB which reliably covers the header +
  // first fragment without loading the whole (potentially large) file.
  const head = new Uint8Array(await blob.slice(0, 256 * 1024).arrayBuffer());
  const needle = [0x6d, 0x6f, 0x6f, 0x66]; // "moof"
  for (let i = 0; i + 4 <= head.length; i++) {
    if (
      head[i] === needle[0] &&
      head[i + 1] === needle[1] &&
      head[i + 2] === needle[2] &&
      head[i + 3] === needle[3]
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Remux a (possibly fragmented) MP4 blob into a progressive MP4 with a correct
 * duration. If the input isn't fragmented, or if remuxing fails for any reason
 * (e.g. low-memory mobile devices), the original blob is returned so the
 * download still succeeds.
 */
export async function remuxToPlayableMp4(input: Blob): Promise<Blob> {
  try {
    if (!(await isFragmentedMp4(input))) {
      return input;
    }

    const { fetchFile } = await import('@ffmpeg/util');
    const ffmpeg = await getFFmpeg();

    const inName = 'in.mp4';
    const outName = 'out.mp4';
    await ffmpeg.writeFile(inName, await fetchFile(input));
    // -c copy: stream copy, no re-encode (fast, low CPU).
    // +faststart: move the rebuilt moov (with real mvhd duration) to the front.
    await ffmpeg.exec(['-i', inName, '-c', 'copy', '-movflags', 'faststart', outName]);
    const data = await ffmpeg.readFile(outName);

    // Clean up MEMFS to free wasm heap for the next download.
    try { await ffmpeg.deleteFile(inName); } catch { /* ignore */ }
    try { await ffmpeg.deleteFile(outName); } catch { /* ignore */ }

    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    if (!bytes || bytes.length === 0) return input;
    // Copy into a plain ArrayBuffer-backed view so it's a valid BlobPart
    // (ffmpeg.wasm may hand back a SharedArrayBuffer-backed Uint8Array).
    const out = new Uint8Array(bytes.byteLength);
    out.set(bytes);
    return new Blob([out], { type: 'video/mp4' });
  } catch (err) {
    console.warn('fMP4 remux failed, falling back to original stream:', err);
    return input;
  }
}
