import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'canvas',
        sharp: 'sharp',
        protobufjs: 'protobufjs',
      });
    }
    return config;
  },
};

export default nextConfig;
