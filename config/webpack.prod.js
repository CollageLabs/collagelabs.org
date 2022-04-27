const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CommonConfig = require('./webpack.common.js');

module.exports = merge(CommonConfig, {
  mode: 'production',
  output: {
    filename: '[name]-[fullhash].js',
    path: path.resolve('assets'),
    publicPath: '/assets/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[fullhash].css'
    }),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            encodeOptions: {
              mozjpeg: {
                quality: 80,
              },
            },
          },
        },
      }),
    ]
  }
});
