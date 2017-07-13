const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const BellOnBundlerErrorPlugin = require("bell-on-bundler-error-plugin");

const config = {
  entry: {
    main: "./src/main.js"
  },

  output: {
    path: path.resolve(__dirname, "/dist"),
    publicPath: "/",
    filename: "[name].js"
  },

  devtool: "eval-source-map",

  resolve: {
    extensions: [".js", ".html", ".css"],
    alias: {
      vue$: "vue/dist/vue.common.js",
      "dot-prop$": "dot-prop-es5/index.js"
    }
  },

  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.html$/, use: "raw-loader", exclude: ["./src/index.html"] }
    ]
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new BellOnBundlerErrorPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: "./src/index.html" })
  ],

  devServer: {
    port: 8080,
    host: "localhost",
    historyApiFallback: true,
    open: false,
    inline: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      modules: true,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: "\u001b[32m"
      }
    }
  }
};

module.exports = config;
