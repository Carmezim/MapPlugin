import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss'
import path from 'path';

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
};

const babelConfig = {  
  'presets': [
    ['env', {
      'targets': {
        'browsers': ['last 2 versions']
      },
      'loose': true
    }]
  ]
};

export default {  
  entry: path.resolve(PATHS.src, 'index.js'),
  format: 'umd',
  moduleName: 'Maps',
  sourceMap: true,
  plugins: [
    babel(babelrc({
      addExternalHelpersPlugin: false,
      config: babelConfig,
      exclude: 'node_modules/**'
    })),
    scss([ // css has to be imported in entry file e.g. inside old_maps.js
      // Output if set to true, the default behaviour is to write all styles to the bundle destination where .js is replaced by .css
      // Using specific file in this case
      output: '[name].bundle.css'
    ]),
    resolve({
      module: true,
      jsnext: true,  // Default: false
      main: true,  // Default: true
      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ],  // Default: ['.js']
      preferBuiltins: true,  // Default: true
      browser: true
    })
  ],
  dest: 'dist/Maps.bundle.js'
};
