// frontend/config-overrides.js
const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    console.log('Applying config-overrides.js');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "stream": require.resolve("stream-browserify"),
      "tty": require.resolve("tty-browserify"),
      "url": require.resolve("url/"),
      "zlib": require.resolve("browserify-zlib"),
      "fs": false,
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/"), // Add this line
    };
    return config;
  }
);