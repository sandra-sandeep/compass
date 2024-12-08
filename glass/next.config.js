/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*/`,
      },
    ];
  },
};

module.exports = nextConfig;
