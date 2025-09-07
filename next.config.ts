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
    ],
  },
};

export default nextConfig;
