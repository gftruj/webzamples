const path = require('path');

module.exports = {
  entry: './src/ground-projected-skybox.js',
  output: {
    filename: 'ground-projected-skybox.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    three: "THREE"
  }
};