import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'canvas',
        sharp: 'sharp',
      });
    }
    return config;
  },
};

export default nextConfig;
