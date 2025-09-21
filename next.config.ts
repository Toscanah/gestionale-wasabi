import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    incomingRequests: {
      ignore: [/^\/api\/trpc/],
    },
  },
  distDir: "build",
};

export default nextConfig;
