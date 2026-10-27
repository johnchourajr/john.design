const { withPlausibleProxy } = require('next-plausible');
const { wgslTurbopackRule } = require('@vgpu/wgsl/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['three'],
  images: {
    // Journal media is served from the R2 bucket, see lib/media/hosted.ts.
    remotePatterns: [{ protocol: 'https', hostname: 'media.john.design' }],
    // AVIF first: usually well under WebP for the work page's screenshots.
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      // Prepares .wgsl imports for vgpu at build time (app/exp/vgpu-shader).
      '*.wgsl': wgslTurbopackRule({ minify: true }),
    },
  },
};

module.exports = withPlausibleProxy()(nextConfig);
