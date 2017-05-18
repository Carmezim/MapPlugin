const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');


module.exports = Merge(
  CommonConfig, {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new BabiliPlugin(),
      new CleanWebpackPlugin(PATHS.dist),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations.
            safe: true,
          }
        },
        canPrint: false,
      }),
      new PurifyCSSPlugin({
        glob.sync(`${PATHS.src}/**/*.js`, { nodir: true })
      })
    ]
  })
};
