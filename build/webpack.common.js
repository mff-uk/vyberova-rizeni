const path = require("path");
const webpack = require("webpack");
const {VueLoaderPlugin} = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin =
  require("html-webpack-inline-source-plugin");

module.exports = {
  "entry": {
    "main": path.join(__dirname, "..", "client", "index.js"),
    "standalone": path.join(__dirname, "..", "client", "index-standalone.js"),
  },
  "output": {
    "path": path.join(__dirname, "..", "dist"),
    "filename": "bundle.js",
    "publicPath": "./"
  },
  "optimization": {
    "splitChunks": {
      "cacheGroups": {
        "commons": {
          "test": /[\\/]node_modules[\\/]/,
          "filename": "[name].[chunkhash].js",
          "name": "vendor",
          "chunks": "all"
        },
      },
    },
  },
  "resolve": {
    "modules": ["node_modules"],
    "extensions": [".js", ".vue", ".ts"],
    "alias": {}
  },
  "module": {
    "rules": [
      {
        "test": /\.vue$/,
        "use": "vue-loader"
      }, {
        "test": /\.js$/,
        "use": "babel-loader"
      }, {
        "test": /\.tsx?$/,
        "use": "ts-loader",
        "exclude": /node_modules/
      }
    ]
  },
  "plugins": [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      "filename": "index.html",
      "template": path.join(__dirname, "..", "public", "index.html"),
      "inject": true,
      "chunks": ["main", "vendor"],
    }),
    new HtmlWebpackPlugin({
      "filename": "index-standalone.html",
      "template": path.join(__dirname, "..", "public", "index.html"),
      "inject": true,
      "chunks": ["standalone", "vendor"],
      "inlineSource": ".(js|css)$",
    }),
    new webpack.DefinePlugin({}),
    new HtmlWebpackInlineSourcePlugin(),
  ]
};