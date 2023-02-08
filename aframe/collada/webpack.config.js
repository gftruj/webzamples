const path = require('path');

module.exports = {
  entry: './collada-model.js',
  output: {
    filename: 'collada-model.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    three: "THREE"
  }
};