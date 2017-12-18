const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      AC: path.resolve(__dirname, 'src/AC/'),
      Reducer: path.resolve(__dirname, 'src/reducer/'),
      Component: path.resolve(__dirname, 'src/components/'),
    }
  },
  entry: ['./src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.min.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
};
