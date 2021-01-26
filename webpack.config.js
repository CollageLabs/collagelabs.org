module.exports = function getWebpackConfig (env) {
  if (env.dev) {
    return require(`./config/webpack.dev.js`);
  } else if (env.prod) {
    return require(`./config/webpack.prod.js`);
  } else if (env.pwa) {
    return require(`./config/webpack.pwa.js`);
  } else if (env.optim) {
    return require(`./config/webpack.optim.js`);
  }
};
