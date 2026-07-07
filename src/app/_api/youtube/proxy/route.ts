import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max duration for streaming

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  try {
    const isWin = os.platform() === 'win32';
    const binaryName = isWin ? 'yt-dlp.exe' : 'yt-dlp';
    
    // First, try the local node_modules path (works on Windows/local dev)
    const localPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binaryName);
    let ytDlpPath = localPath;

    // Fallback to /tmp download for Vercel/production where node_modules binary might be missing
    if (!fs.existsSync(localPath)) {
      ytDlpPath = path.join(os.tmpdir(), binaryName);
      const tmpDownloadPath = ytDlpPath + '.download';

      if (!fs.existsSync(ytDlpPath)) {
        try {
          console.log('Downloading yt-dlp binary to', ytDlpPath);
          const downloadUrl = isWin 
            ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
            : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
          
          const response = await fetch(downloadUrl);
          const buffer = await response.arrayBuffer();
          // Write to a temporary file first to avoid EBUSY race conditions
          fs.writeFileSync(tmpDownloadPath, Buffer.from(buffer));
          if (!isWin) {
            fs.chmodSync(tmpDownloadPath, 0o777); // Make executable on linux
          }
          // Atomic rename
          fs.renameSync(tmpDownloadPath, ytDlpPath);
          console.log('Downloaded yt-dlp successfully.');
        } catch (downloadErr) {
          console.error('Failed to download yt-dlp:', downloadErr);
          // If another request already downloaded it while we failed, try to use it
          if (!fs.existsSync(ytDlpPath)) {
            throw downloadErr;
          }
        }
      }
    }

    // Start yt-dlp child process and stream output to stdout
    const child = spawn(ytDlpPath, [
      url,
      '-f', '22/18', // Try 720p (22) first, fallback to 360p (18)
      '-o', '-', // output to stdout
      '--quiet',
      '--no-warnings',
      '--no-check-certificates'
    ]);

    if (!child.stdout) {
      throw new Error('yt-dlp stdout is null');
    }

    // Convert Node.js Readable stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        child.stdout!.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        child.stdout!.on('end', () => {
          controller.close();
        });
        child.stdout!.on('error', (err) => {
          console.error('yt-dlp stream error:', err);
          controller.error(err);
        });
        child.stderr?.on('data', (data) => {
          console.log(`yt-dlp stderr: ${data}`);
        });
      },
      cancel() {
        child.kill('SIGKILL');
      }
    });

    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="video.mp4"`);

    return new NextResponse(webStream, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
