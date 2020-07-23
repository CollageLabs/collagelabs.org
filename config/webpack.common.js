const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: {
    app: './_src/index.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      d3: 'd3',
      $: "jquery",
      jQuery: "jquery",
      'window.jQuery': "jquery"
    }),
    new HtmlWebpackPlugin({
      template: './_src/template/default.html',
      filename: '../_layouts/default.html'
    }),
    new FaviconsWebpackPlugin({
      logo: './icon.svg',
      prefix: 'icons/'
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve('_images'),
        to: 'images/'
      }],
    })
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
              importLoaders: 2
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
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader'
          },
          {
            loader: 'svg-transform-loader'
          },
          {
            loader: 'svgo-loader'
          }
        ]
      }, {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          'file-loader'
        ]
      }, {
        test: /\.(woff|woff2)$/,
        use: [
          'url-loader'
        ]
      }
    ]
  }
};
