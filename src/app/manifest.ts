import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediaExplorer Free Video Downloader',
    short_name: 'MediaExplorer',
    description: 'Best free video downloader online. Fast, responsive, and free insta downloader and YouTube downloader tool.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  }
}
