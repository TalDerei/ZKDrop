const nextConfig = {
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback = { fs: false, stream: false, path: false, crypto: false, os: false };
    }
    // config.experiments = { asyncWebAssembly: true };
    return config;
  },
}

module.exports = nextConfig