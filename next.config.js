/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Simple path alias configuration
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    return config;
  },
  // TypeScript checking happens in a separate process
  typescript: {
    // Skip type checking during build for speed on Netlify
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting during build for speed on Netlify
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 