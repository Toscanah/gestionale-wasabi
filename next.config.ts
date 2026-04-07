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
  output: "standalone",
};

export default nextConfig;
