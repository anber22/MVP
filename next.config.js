/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://8.217.225.166:7860/:path*'
      }
    ]
  }
}

module.exports = nextConfig
