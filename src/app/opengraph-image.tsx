import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MediaExplorer Free Video Downloader';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to top right, #e53e3e, #d53f8c, #ed8936)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </div>
        <div style={{ fontSize: '72px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'sans-serif' }}>
          MediaExplorer Hub
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'normal', textAlign: 'center', marginTop: '20px', fontFamily: 'sans-serif' }}>
          Free Video Downloader & Manager
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
