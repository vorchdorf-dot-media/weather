'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const SVGO = require('svgo');

const defaults = {
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeDimensions: true,
    },
  ],
};

module.exports = snowpackPluginSvgo;

function snowpackPluginSvgo(snowpackConfig, pluginOptions) {
  return {
    name: '@saschazar/snowpack-plugin-svgo',
    resolve: {
      input: ['.svg'],
      output: ['.js'],
    },
    async load({ filePath }) {
      const contents = fs.readFileSync(filePath, 'utf-8');
      const svgo = new SVGO(pluginOptions || defaults);
      const { data } = await svgo.optimize(contents);
      return {
        '.js': `export default '${data}';`,
      };
    },
  };
}
