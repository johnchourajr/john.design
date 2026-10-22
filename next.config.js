const { withPlausibleProxy } = require('next-plausible');
const { wgslTurbopackRule } = require('@vgpu/wgsl/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['three'],
  turbopack: {
    rules: {
      // Prepares .wgsl imports for vgpu at build time (app/exp/vgpu-shader).
      '*.wgsl': wgslTurbopackRule({ minify: true }),
    },
  },
};

module.exports = withPlausibleProxy()(nextConfig);
