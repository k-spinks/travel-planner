import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARNING !!
    // Set to true to ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh", // UploadThing file storage
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google avatar
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Github avatar
      },
    ],
  },
};

export default nextConfig;
