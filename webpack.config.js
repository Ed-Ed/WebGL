const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

const isProd = process.env.NODE_ENV === "production" ? true : false;

module.exports = {
  name: "web",
  mode: isProd ? "production" : "development",
  entry: ["./src/index.ts"],
  devtool: isProd ? false : "source-map",
  output: {
    path: path.resolve("public/js"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-typescript", "@babel/preset-env"],
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      }
    ]
  },
  plugins: isProd
    ? []
    : [
        new webpack.DefinePlugin({
          "process.env": JSON.stringify(dotenv.config().parsed)
        })
      ]
};
