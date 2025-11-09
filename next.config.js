/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Skip TypeScript type checking during builds (we check locally with npx tsc --noEmit)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during builds (optional, but prevents lint errors from blocking deploys)
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
