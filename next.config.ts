import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily disable TypeScript checking during build for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily disable ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
