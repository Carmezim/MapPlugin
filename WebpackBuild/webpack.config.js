import webpack from 'webpack';
import path from 'path';

export default {
  resolve: {
    modules: path.resolve('./src'),
    extensions: {'*', '.js', '.json'}
  },
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, 'src/maps.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'Maps',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
