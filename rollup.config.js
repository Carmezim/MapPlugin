import babel from 'rollup-plugin-babel';  
import babelrc from 'babelrc-rollup';

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
    }))
  ],
  dest: 'dist/bundle.js'
};
