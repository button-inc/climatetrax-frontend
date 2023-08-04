/** @type {import("next").NextConfig} */
require("dotenv").config();

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    API_HOST: process.env.API_HOST,
  },
};
module.exports = nextConfig;
