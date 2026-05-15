import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      if (Array.isArray(config.externals)) {
        config.externals.push({
          canvas: "canvas",
          sharp: "sharp",
          protobufjs: "protobufjs",
        });
      }
    }
    return config;
  },
};

export default nextConfig;