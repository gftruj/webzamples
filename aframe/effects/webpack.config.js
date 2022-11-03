const path = require('path');

module.exports = {
  entry: './src/anaglyph-render-component.js',
  mode: "development",
  output: {
    filename: 'anaglyph-render-component.js',
    iife: true,
    path: path.resolve(__dirname),
  },
  externals: [
    { "three": "THREE" }
  ]
};