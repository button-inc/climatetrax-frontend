/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
module.exports = nextConfig;
