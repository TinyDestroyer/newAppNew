// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["pdf-parse"],
    },
    webpack: (config, { isServer }) => {
      // If it's server-side code (API routes), exclude onnxruntime-node from Webpack bundling
      if (isServer) {
        config.externals.push('onnxruntime-node');
      }
  
      // Add a rule for handling .node files using node-loader
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader', // Ensure Webpack knows how to handle .node files
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
