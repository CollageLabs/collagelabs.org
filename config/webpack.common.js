const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: {
    app: './_src/index.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './_src/template/default.html',
      filename: '../_layouts/default.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ['/node_modules/', '/functions/', '/lambda/'],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }, {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "expose-loader",
            options: {
              exposes: ['$'],
            },
          }
        ]
      }, {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            }
          }, {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js'
              }
            }
          }, {
            loader: 'sass-loader'
          }
        ]
      }, {
        test: /\.(woff|woff2)$/,
        type: 'asset/inline'
      }, {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset/resource'
      }, {
        test: /\.svg$/,
        include: /sprite/,
        use: [
          {
            loader: 'svg-sprite-loader',
          }, {
            loader: 'svg-transform-loader'
          }, {
            loader: 'svgo-loader'
          }
        ]
      }
    ]
  }
};
