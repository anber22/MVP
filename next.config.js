/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://stable-diffsuion.aiproshots.com/:path*'
      },
      {
        source: '/mvp/:path*',
        destination: 'https://back-end-api.aiproshots.com/:path*'
      },
      {
        source: '/img/:path*',
        destination: 'https://aiproshots-image.s3.amazonaws.com/:path*'
      }
    ]
  }
}

module.exports = nextConfig
