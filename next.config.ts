import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/asmaul-husna/en',
        permanent: true,
      },
      {
        source: '/asmaul-husna',
        destination: '/asmaul-husna/en',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
