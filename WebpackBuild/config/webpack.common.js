const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  src: path.resolve(__dirname, 'app'),
  dist: path.resolve(__dirname, 'dist'),
  node_modules: path.resolve(__dirname, "node_modules")
};

module.exports = {
  entry: {
    app: PATHS.src
  },

  output: {
    path: PATHS.build,
    chunkFilename: '[name].js',
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map'
  },

  resolve: {
    extensions: ['*', '.js', '.json'],
    modules: [path.join(__dirname, 'node_modules']
  },

  module: {
    rules: [
      {
        test: /.js$/,
        exclude: PATHS.node_modules,
        use: {
          loader: 'babel-loader'
        },
        options: {
          // Enable caching for improved performance during
          // development.
          // It uses default OS directory by default. If you need
          // something more custom, pass a path to it.
          // I.e., { cacheDirectory: '<path>' }
          cacheDirectory: true,
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
      title: 'Maps Module',
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ])
  ]
}