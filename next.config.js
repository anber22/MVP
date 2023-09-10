/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://47.252.36.141:7860/:path*'
      }
    ]
  }
}

module.exports = nextConfig
