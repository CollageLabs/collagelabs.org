const path = require('path');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './config/optimization-fix/do-not-delete.js',
  output: {
    filename: 'optimization-fix-this-file-is-ignored.js'
  },
  plugins: [
    new HtmlCriticalWebpackPlugin({
      base: path.resolve('_layouts'),
      src: 'default.html',
      dest: '_layouts/default.html',
      css: ['assets/app.css'],
      inline: true,
      minify: true
    })
  ]
};
