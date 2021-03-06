const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CommonConfig = require('./webpack.common.js');

module.exports = merge(CommonConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve('assets'),
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
    new webpack.HotModuleReplacementPlugin()
  ],
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       enforce: 'pre',
  //       exclude: /node_modules/,
  //       loader: 'eslint-loader'
  //     }
  //   ]
  // },
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000'
      }
    },
    firewall: false,
    port: 4000,
    hot: true,
    client: {
      port: 5000
    },
  }
});
