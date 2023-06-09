/*By adding the withNextRuntimeDotenv() function as a wrapper around nextConfig, the next-runtime-dotenv package 
will handle the loading of environment variables on the client side.*/
const withNextRuntimeDotenv = require('next-runtime-dotenv');

const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = withNextRuntimeDotenv()(nextConfig);

/*Please note that you may need to run pnpm install after modifying the next.config.js file to ensure that all dependencies are up to date.*/