const path = require('path');
const Merge = require('webpack-merge');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const ProdConfig = require('./webpack.prod.js');

module.exports = Merge(ProdConfig, {
  mode: 'production',
  plugins: [
    new WebpackPwaManifest({
      name: 'Collage Labs',
      short_name: 'Collage Labs',
      description: 'Web, Mobile, ERP & IT Solutions',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '/',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        {
          src: path.resolve('_images/icon.svg'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    })
  ]
});
