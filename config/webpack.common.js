/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');

module.exports = {
  entry: {
    app: './_src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './_src/template/frontpage.html',
      filename: '../_layouts/frontpage.html',
    }),
    new WebappWebpackPlugin({
      logo: './icon.svg',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([{
      from: path.resolve('_images'),
      to: 'images/',
    }]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          // }, {
          //   loader: MiniCssExtractPlugin.loader,
          }, {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js',
              },
            },
          }, {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};
