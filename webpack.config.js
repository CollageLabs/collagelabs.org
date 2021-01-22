module.exports = function getWebpackConfig (env) {
  return require(`./config/webpack.${env}.js`);
};
