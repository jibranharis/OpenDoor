import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/Opportunities',
        destination: '/opportunities',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
