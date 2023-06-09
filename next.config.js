/*By adding the withNextRuntimeDotenv() function as a wrapper around nextConfig, the next-runtime-dotenv package 
will handle the loading of environment variables on the client side.*/
const dotenv = require('dotenv');
const withRuntimeDotenv = require('next-runtime-dotenv');

// Load the Kubernetes secret using dotenv
dotenv.config({
  path: '/var/run/secrets/kubernetes.io/serviceaccount/eed-nextauth-callback-url',
});

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXTAUTH_CALLBACK_URL: process.env.NEXTAUTH_CALLBACK_URL,
  },
};

module.exports = withRuntimeDotenv()(nextConfig);



/*Please note that you may need to run pnpm install after modifying the next.config.js file to ensure that all dependencies are up to date.*/