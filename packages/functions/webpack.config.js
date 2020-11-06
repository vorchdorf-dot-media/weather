const path = require('path');
const globby = require('globby');

const base = require('../../webpack.config');

const functions = globby.sync('./*.ts');
const entry = functions.reduce((prev, current) => {
  const basename = path.basename(current, '.ts');
  return {
    ...prev,
    [basename]: `./${current}`,
  };
}, {});

module.exports = {
  ...base,
  context: path.resolve(__dirname),
  entry,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../../functions'),
  },
  target: 'node',
};
