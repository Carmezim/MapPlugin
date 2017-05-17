import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';


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
  entry: 'src/maps.js',
  format: 'umd',
  moduleName: 'Maps',
  sourceMap: true,
  plugins: [
    babel(babelrc({
      addExternalHelpersPlugin: false,
      config: babelConfig,
      exclude: 'node_modules/**'
    })),
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
  dest: 'dist/bundle.js'
};
