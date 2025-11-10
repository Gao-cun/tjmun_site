/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  eslint: {
    // Skip ESLint during `next build` so deployment can proceed when lint errors exist
    ignoreDuringBuilds: true,
  },
=======
>>>>>>> 5edc018894a634715c39e6a190c13ee7937c8999
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

