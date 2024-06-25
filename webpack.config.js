// webpack.config.js

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  // other configuration options...
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log statements
          },
          mangle: true, // Obfuscate variable and function names
          output: {
            comments: false, // Remove comments
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          { loader: '@svgr/webpack', options: { svgUrl: true } },
          'file-loader',
        ],
      },
    ],
  },
  plugins: [
new MiniCssExtractPlugin({
      // Options here
      ignoreOrder: true, // Enable this to remove order warnings
    }),
  ],
};
