// Rollup plugins
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import path from 'path';

// CSS plugins
//import uglify from 'rollup-plugin-uglify';
// import scss from 'rollup-plugin-scss'
import css from 'rollup-plugin-css-only'

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
  entry: './src/index.js',
  dest: './dist/maps.bundle.js',
  format: 'umd',
  moduleName: 'Maps',
  sourceMap: true,
  plugins: [
    babel(babelrc({
      addExternalHelpersPlugin: false,
      config: babelConfig,
      exclude: './node_modules/**'
    })),
    css({ output: 'maps.bundle.css' }),
    // scss({ // css has to be imported in entry file e.g. inside old_maps.js
    //   // Output if set to true, the default behaviour is to write all styles to the bundle destination where .js is replaced by .css
    //   // Using specific file in this case
    //   output: 'maps.bundle.css'
    // }),
    resolve({
      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ],  // Default: ['.js']
      jsnext: true,
      main: true,
      browser: true,
      module: true,
    }),
    commonjs(),
		serve({
			open: true,
			contentBase: 'dist',
			host: 'localhost',
			port: 3000
		}),
    livereload()
  ]
};
