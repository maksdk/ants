const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist/")
  },
  devServer: {
    contentBase: "./dist/",
    compress: false,
    hot: false,
    liveReload: false,
    port: 8000
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.webpack.json"
          }
        }],
        exclude: /(node_modules|bower_components|assets)/
      }
    ]
  }
};