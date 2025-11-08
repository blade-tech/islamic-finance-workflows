/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Netlify deployment with OpenNext adapter
  output: 'standalone',
}

module.exports = nextConfig
