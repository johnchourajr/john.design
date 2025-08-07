const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['three'],
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'motion',
      'framer-motion-3d',
    ],
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
            chunks: 'async',
            reuseExistingChunk: true,
          },
          motion: {
            name: 'motion',
            test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
            priority: 25,
            chunks: 'async',
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = withPlausibleProxy()(nextConfig);
