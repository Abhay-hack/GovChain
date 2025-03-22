// postcss.config.js
module.exports = {
    plugins: [
      require('tailwindcss'),   // Make sure you require 'tailwindcss' here
      require('autoprefixer')    // Autoprefixer is optional, but useful for browser compatibility
    ]
};
  