const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');
const Merge = require('webpack-merge');
const CommonConfig = require('webpack.common')
const BabiliPlugin = require('babili-webpack-plugin');


const PATHS = {
  lib: path.join(__dirname, 'lib'),
  build: path.join(__dirname, 'dist'),
};

const libraryConfig = Merge(
  CommonConfig,
  {
    output: {
      filename: '[name].js',
    }
  }
)};

const libraryMinConfig = merge([
  CommonConfig,
  {
    output: {
      filename: '[name].min.js',
    },
  },
  plugins: [
    new BabiliPlugin()
  ]
]);

module.exports = [
  libraryConfig,
  libraryMinConfig,
];

