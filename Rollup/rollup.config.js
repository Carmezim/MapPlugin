// Rollup plugins
import globals from "rollup-plugin-node-globals"
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import path from 'path';
import html from 'rollup-plugin-html';

// CSS plugins
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import sass from 'node-sass';


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

const preprocessor = (content, id) => new Promise((resolve, reject) => {
    const result = sass.renderSync({ file: id });
    resolve({ code: result.css.toString() });
});

export default {  
	onwarn: function(warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

    // console.warn everything else
    console.warn( warning.message );
	},
	entry: './src/components/map/map.js',
	dest: './dist/js/maps.bundle.js',
	format: 'umd',
	moduleName: 'Maps',
	sourceMap: true,
	plugins: [
		resolve({
			// not all files you want to resolve are .js files
			extensions: [ '.js', '.json' ],  // Default: ['.js']
			jsnext: true,
			main: true,
			browser: true,
			module: true,
		}),
		commonjs(),
		globals(),
		multiEntry(),
		postcss({
			preprocessor,
			sourceMap: true,
			extensions: ['.css', '.scss', '.sass'],
			extract: './dist/styles/main.bundle.css',
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
				cssnano({
					browser: ['last 2 versions'],
					discardComments: {
							removeAll: true
					}
				}),
			],
		}),
		html({
			// Required to be specified
			include: '**/*.html',

			// Undefined by default
			exclude: './node_modules/**',
		}),
		babel(babelrc({
			addExternalHelpersPlugin: false,
			config: babelConfig,
			exclude: './node_modules/**',
			include: './node_modules/whatwg-fetch'
		})),
		serve({
			open: true,
			contentBase: 'dist',
			host: 'localhost',
			port: 3000,
		}),
		livereload(),
	],
};
