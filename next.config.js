/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aiproshots-api.uptradeit.com/:path*'
      },
      {
        source: '/mvp/:path*',
        destination: 'https://aiproshots-api.uptradeit.com/aiproshots-api/:path*'
      },
      {
        source: '/img/:path*',
        destination: 'https://aiproshots-image.s3.amazonaws.com/:path*'
      }
    ]
  }
}

module.exports = nextConfig
