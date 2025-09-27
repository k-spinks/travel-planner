import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
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
