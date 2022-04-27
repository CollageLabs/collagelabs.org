module.exports = ({ file, options, env }) => ({
  parser: 'postcss-scss',
  plugins: {
    'postcss-import': {},
    'postcss-advanced-variables': {},
    'postcss-preset-env': {},
    'postcss-nested': {},
    'css-mqpacker': {},
    'autoprefixer': env === 'prod' ? {} : false,
    'cssnano': env === 'prod' ? {} : false
  }
});
