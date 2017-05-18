const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

const extractSass = new ExtractTextPlugin({
  filename: "style.css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = Merge(
  CommonConfig, {
    resolve: {
      modules: [],
      extensions: ['*', '.js', '.json']
    },
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      stats: 'errors-only',
      host: 'localhost', // Defaults to localhost
      noInfo: false
    },
  }
);