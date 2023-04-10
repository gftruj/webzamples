const path = require('path');

module.exports = {
  entry: './src/fbx-model.js',
  mode: 'development',
  output: {
    filename: 'fbx-model.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    three: "THREE"
  }
};