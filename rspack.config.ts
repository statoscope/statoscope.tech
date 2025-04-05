/* eslint-env node */

import path from "node:path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import StatoscopeWebpackPlugin from "@statoscope/webpack-plugin";
import reports from "./reports";
import WebpackContextExtension from "./custom-ext";
import rspack from "@rspack/core";
import {RsdoctorRspackPlugin} from "@rsdoctor/rspack-plugin";

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
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
        type: 'javascript/auto',
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
    process.env.RSDOCTOR &&
    new RsdoctorRspackPlugin({
      // plugin options
    }),
    new StatoscopeWebpackPlugin({
      statsOptions: {
        context: __dirname,
      },
      saveStatsTo: path.resolve('./public/demo-stats.rspack.json'),
      normalizeStats: true,
      open: 'file',
      reports,
      extensions: [new WebpackContextExtension()],
    }),
    new rspack.CssExtractRspackPlugin({
      filename: '[name].[contenthash:7].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: false,
    }),
  ],
};
