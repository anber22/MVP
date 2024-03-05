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
  },
  serverRuntimeConfig: {
    maxDuration: 300000, // 设置超时时间为60秒
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
},
}

module.exports = nextConfig
