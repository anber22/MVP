// api/proxy.js
// 该服务为 vercel serve跨域处理
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
    let target = ''
    let rewrite = {}
    // 代理目标地址
    // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
    // target 替换为你跨域请求的服务器 如： http://baidu.com
    if (req.url.startsWith('/api')) {
      target = 'https://stable-diffsuion.aiproshots.com/'
      Reflect.set(rewrite, '^/api/', '/')
    } else if (req.url.startsWith('/mvp')){
      target = 'https://back-end-api.aiproshots.com/'
      Reflect.set(rewrite, '^/mvp/', '/')
    } else if (req.url.startsWith('/img')){
      target = 'https://aiproshots-image.s3.amazonaws.com/'
      Reflect.set(rewrite, '^/img/', '/')
    }
    // 创建代理对象并转发请求
    createProxyMiddleware({
        target,
        proxy: {
          timeout: 300000, // 自己想要的时间
          proxyTimeout: 300000,

        },
        changeOrigin: true,
        pathRewrite: rewrite
    })(req, res)
}