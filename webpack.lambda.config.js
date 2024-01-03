const path = require("path");

module.exports = {
  mode: "production",
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".ts"],
    mainFields: ["module", "main"],
  },
  module: {
    rules: [
      {
        test: /\.(m?js|ts)?$/,
        exclude: new RegExp(
          `(node_modules|bower_components|\\.(test|spec)\\.?)`
        ),
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            cacheDirectory: true,
            presets: [
              [
                require.resolve("@babel/preset-env"),
                { targets: { node: "18" } },
              ],
            ],
          },
        },
      },
    ],
  },
  context: path.resolve(__dirname, "lambda/"),
  entry: './frontpage-contact-form.js',
  target: "node",
  output: {
    path: path.resolve(__dirname, "functions/"),
    filename: "frontpage-contact-form.js",
    libraryTarget: "commonjs",
  },
  bail: true,
  devtool: false,
  stats: {
    colors: true,
  },
};
