const path = require('path');
const slsw = require('serverless-webpack');

/**
 * Generates absolute path to sub directories of `src`
 *
 * @param {string} subdir relative path to the folder with `src` as root
 */
const srcPath = (subdir) => path.join(__dirname, 'src', subdir);

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    alias: {
      constants: srcPath('constants'),
      helpers: srcPath('helpers'),
      types: srcPath('@types'),
      packageJson: path.join(__dirname, 'package.json'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
};
