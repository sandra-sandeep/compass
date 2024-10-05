/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    console.log('Rewrites called')
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*'
      }
    ]
  }
}

export default nextConfig