/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('@sveltejs/snowpack-config');

const svgoConfig = require('./svgo.config.json');

// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  ...base,
  alias: {
    ...base.alias,
    assets: './src/assets',
    components: './src/components',
    locales: './locales',
    routes: './src/routes',
    utils: './src/utils',
  },
  mount: {
    ...base.mount,
    'src/assets': '/_app/assets',
    locales: '/_app/locales',
    'src/utils': '/_app/utils',
  },
  plugins: [
    ...base.plugins,
    ['@snowpack/plugin-typescript'],
    ['@snowpack/plugin-optimize', { minifyJS: false, preloadModules: true }],
  ],
  proxy: {
    '/api/graphql': '/.netlify/functions/graphql',
  },
};
