/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://47.89.150.214:7860/:path*'
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
  },
  serverRuntimeConfig: {
    maxDuration: 300000, // 设置超时时间为60秒
  },
  experimental: {
    proxyTimeout: 1000 * 300,
  }
}

module.exports = nextConfig
