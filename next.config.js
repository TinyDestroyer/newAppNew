// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    experimental: {
      runtime: 'nodejs',
      serverComponentsExternalPackages: ["pdf-parse"],
      optimizeCss: false,
      scrollRestoration: false,
    },
    webpack: (config, { isServer,dev }) => {
      // If it's server-side code (API routes), exclude onnxruntime-node from Webpack bundling
      if (!dev && isServer) {
        config.externals = [
          ...(config.externals || []),
          'onnxruntime-node',
          'pdf-parse',
          'canvas',
          '@huggingface/transformers'
        ];
      }
  
      // Add these optimizations
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
        }
      };
  
      // Add a rule for handling .node files using node-loader
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader', // Ensure Webpack knows how to handle .node files
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
