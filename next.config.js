const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['three'],
};

module.exports = withPlausibleProxy()(nextConfig);
