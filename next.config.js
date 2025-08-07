const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'three']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            priority: 30,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          motion: {
            name: 'motion',
            test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
            priority: 25,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = withPlausibleProxy()(nextConfig);
