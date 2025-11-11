/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 生产环境优化配置（针对 2G 内存服务器优化）
  compress: true, // 启用 gzip 压缩
  poweredByHeader: false, // 移除 X-Powered-By 头
  reactStrictMode: false, // 禁用严格模式以降低构建内存占用
  swcMinify: true, // 使用 SWC 压缩（比 Terser 更快且内存占用更少）
  productionBrowserSourceMaps: false, // 禁用生产环境 source map 以降低内存占用
  experimental: {
    missingSuspenseWithCSRBailout: false,
    optimizePackageImports: ['lucide-react'],
    // 优化内存占用
    webpackBuildWorker: false, // 禁用 webpack 构建工作线程以降低内存占用
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 完全禁用图片优化以大幅降低构建内存占用
    unoptimized: true,
  },
  // 禁用字体优化以避免构建时网络问题
  optimizeFonts: false,
  // 移除 standalone 模式以降低构建复杂度（在 2G 内存环境下）
  // output: 'standalone', // 注释掉以降低构建内存占用
  // Webpack 优化配置 - 最小化配置以降低内存占用
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev) {
      // 完全禁用 webpack 缓存以降低内存占用（2G 服务器）
      config.cache = false
      
      // 限制并行处理以降低内存
      config.parallelism = 1
      
      // 减少模块解析深度
      if (!config.resolve) {
        config.resolve = {}
      }
      config.resolve.symlinks = false
    }
    
    return config
  },
}

module.exports = nextConfig

