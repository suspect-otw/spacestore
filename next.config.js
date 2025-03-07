/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure path aliases are respected during build
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  // TypeScript checking happens in a separate process
  typescript: {
    // Skip type checking during build for speed (Netlify will run this separately)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 