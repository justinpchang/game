require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const API_URL = process.env.API_URL;

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: './src/views/index.html',
      filename: 'index.html',
      inject: false,
      API_URL: API_URL,
    }),
    new HtmlWebpackPlugin({
      template: './src/views/signup.html',
      filename: 'signup.html',
      inject: false,
      API_URL: API_URL,
    }),
    new HtmlWebpackPlugin({
      template: './src/views/reset-password.html',
      filename: 'reset-password.html',
      inject: false,
      API_URL: API_URL,
    }),
    new HtmlWebpackPlugin({
      template: './src/views/forgot-password.html',
      filename: 'forgot-password.html',
      inject: false,
      API_URL: API_URL,
    }),
    new HtmlWebpackPlugin({
      template: './src/views/game.html',
      filename: 'game.html',
      API_URL: API_URL,
    }),
  ],
};
