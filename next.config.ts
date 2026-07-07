import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  // Note: rewrites() are not supported in output: "export" (GitHub Pages)
  // If you deploy to Firebase/Vercel, you can re-enable this.
  /*
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://downloader-codelove.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
  */
};

export default nextConfig;
