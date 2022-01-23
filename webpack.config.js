/* eslint-env node */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const reports = require('./reports');
const WebpackContextExtension = require('./custom-ext');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve('public'),
    filename: '[name].[contenthash:7].js',
  },
  devServer: {
    port: 8888,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  resolve: {
    symlinks: false,
  },
  module: {
    noParse: [/@statoscope/],
    rules: [
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: [path.resolve('src')],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
          },
        },
      },
    ],
  },
  plugins: [
    new StatoscopeWebpackPlugin({
      statsOptions: {
        context: __dirname,
      },
      saveStatsTo: path.resolve('./public/demo-stats.json'),
      normalizeStats: true,
      open: 'file',
      reports,
      extensions: [new WebpackContextExtension()],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:7].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: false,
    }),
  ],
};
