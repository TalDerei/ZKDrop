module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, stream: false, path: false, crypto: false, os: false };
    return config;
  },
};