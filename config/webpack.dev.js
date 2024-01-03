const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CommonConfig = require('./webpack.common.js');

const x = merge(CommonConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'assets/'),
    publicPath: '/assets/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new BrowserSyncPlugin({
      host: '0.0.0.0',
      port: 5000,
      proxy: {
        target: 'http://localhost:4000',
        ws: true
      },
      files: ['_site', '_src'],
      ui: false
    }, {
      reload: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000'
      }
    },
    allowedHosts: 'all',
    port: 4000,
    hot: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:5000/ws',
    },
    devMiddleware: {
      writeToDisk: true,
    },
  }
});

console.log(x);

module.exports = x;