const path = require('path');
const Merge = require('webpack-merge');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const ProdConfig = require('./webpack.prod.js');

module.exports = Merge(ProdConfig, {
  mode: 'production',
  plugins: [
    new WebpackPwaManifest({
      name: 'Super-website',
      short_name: 'Super PWA',
      description: 'A super website made with love',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '/',
      theme_color: '#c0ffee',
      background_color: '#ffffff',
      icons: [
        {
          src: path.resolve('icon.svg'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    })
  ]
});
