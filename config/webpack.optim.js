const path = require('path');
const glob = require('glob');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './config/optimization-fix/do-not-delete.js',
  output: {
    filename: 'optimization-fix-this-file-is-ignored.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlCriticalWebpackPlugin({
      base: path.resolve('_site'),
      src: 'index.html',
      dest: 'index.html',
      css: glob.sync('_site/assets/*.css'),
      inline: true,
      minify: true,
      extract: true,
      width: 1300,
      height: 900
    })
  ]
};
