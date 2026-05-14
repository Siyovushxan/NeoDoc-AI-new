import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'canvas', // Already present
        sharp: 'sharp',   // Already present
        'protobufjs': 'protobufjs', // Add this line
      });
    }
    return config;
  },
};

export default nextConfig;
