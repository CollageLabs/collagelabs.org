module.exports = {
  staticFileGlobs: [
    '_site/**.html',
    '_site/**/**.html',
    '_site/assets/images/**.*',
    '_site/assets/icons/**.*',
    '_site/assets/**.css',
    '_site/assets/**.js'
  ],
  stripPrefix: '_site/',
  runtimeCaching: [{
    urlPattern: '/',
    handler: 'networkFirst'
  }],
  root: '_site'
};
