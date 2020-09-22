const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index',
  target: 'node',
  mode: 'none',
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.js'],
    alias: {
      'sync-request$': path.resolve(__dirname, 'src/shims/sr.ts')
    }
  },
  externals: {
    'coc.nvim': 'commonjs coc.nvim'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  plugins: [
  ],
  node: {
    __dirname: false,
    __filename: false
  }
};
