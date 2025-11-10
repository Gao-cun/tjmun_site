/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during `next build` so deployment can proceed when lint errors exist
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

