import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // The YouTube tools were removed; send their old URLs to the home page instead of a 404.
  async redirects() {
    return [
      { source: "/youtube", destination: "/", permanent: true },
      { source: "/youtube/:path*", destination: "/", permanent: true },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/__/auth/:path*",
  //       destination: "https://downloader-codelove.firebaseapp.com/__/auth/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
