// Rollup plugins
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import path from 'path';

// CSS plugins
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';

const PATHS = {
	src: path.resolve(__dirname, 'src'),
	dist: path.resolve(__dirname, 'dist')
};

const babelConfig = {  
	'presets': [
		['env', {
			'targets': {
				'browsers': ['last 2 versions'],
			},
			'loose': true,
		}]
	]
};

export default {  
	entry: './src/components/map/map.js',
	dest: './dist/js/maps.bundle.js',
	format: 'umd',
	moduleName: 'Maps',
	sourceMap: true,
	plugins: [
		postcss({
			sourceMap: true,
			extensions: ['.css', '.scss', '.sass'],
			extract: './dist/styles/maps.bundle.css',
			plugins: [
				// allows for sass like variables
				simplevars(),
				// allows rules to be nested
				nested(),
				// enables most current CSS syntax transpailing it to work in older browsers that 
				// do not support the new features
				cssnext({ 
					// cssnano and cssnext use autoprefixer which triggers a warning (harmless) so we
					// are disbaling its warning for duplicates
					warnForDuplicates: false, 
				}),
			],
		}),
		resolve({
			// not all files you want to resolve are .js files
			extensions: [ '.js', '.json' ],  // Default: ['.js']
			jsnext: true,
			main: true,
			browser: true,
			module: true,
		}),
		babel(babelrc({
			addExternalHelpersPlugin: false,
			config: babelConfig,
			exclude: './node_modules/**',
		})),
		commonjs(),
		serve({
			open: true,
			contentBase: 'dist',
			host: 'localhost',
			port: 3000,
		}),
		livereload(),
	],
};
