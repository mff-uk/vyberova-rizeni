const merge = require("webpack-merge");
const common = Object.assign({}, require("./webpack.common"));
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  "mode": "production",
  "devtool": "source-map",
  "output": {
    "filename": "[name].[chunkhash].js",
  },
  "optimization": {
    "minimize": true,
    "minimizer": [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        "cache": true,
        "parallel": false,
        "sourceMap": true,
        "terserOptions": {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ]
  },
  "module": {
    "rules": [
      {
        "test": /\.css?$/,
        "use": [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  "plugins": [
    new MiniCssExtractPlugin({
      "filename": "[name].[chunkhash].css"
    }),
    new CopyPlugin([
      { "from": "./data/public", "to": "./dist/api/v1/data" },
    ]),
  ]
});
