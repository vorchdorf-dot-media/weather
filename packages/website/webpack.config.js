/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const sveltePreprocess = require('svelte-preprocess');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = {
  svelte: path.resolve('node_modules', 'svelte'),
  assets: path.resolve('src', 'assets'),
  components: path.resolve('src', 'components'),
  routes: path.resolve('src', 'routes'),
};
const extensions = ['.mjs', '.js', '.ts', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif)$/i,
  use: ['file-loader'],
};

module.exports = {
  client: {
    entry: { main: config.client.entry().main.replace(/\.js$/, '.ts') },
    output: config.client.output(),
    resolve: { alias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              preprocess: sveltePreprocess(),
              hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
            },
          },
        },
        fileLoaderRule,
      ],
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
      }),
      new webpack.EnvironmentPlugin(Object.keys(process.env)),
    ].filter(Boolean),
    devtool: dev && 'inline-source-map',
  },

  server: {
    entry: { server: config.server.entry().server.replace(/\.js$/, '.ts') },
    output: config.server.output(),
    target: 'node',
    resolve: { alias, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat('encoding'),
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
              hydratable: true,
              preprocess: sveltePreprocess(),
              dev,
            },
          },
        },
        fileLoaderRule,
      ],
    },
    mode,
    plugins: [
      new WebpackModules(),
      new webpack.EnvironmentPlugin(Object.keys(process.env)),
    ],
    performance: {
      hints: false, // it doesn't matter if server.js is large
    },
  },

  serviceworker: {
    entry: {
      'service-worker': config.serviceworker
        .entry()
        ['service-worker'].replace(/\.js$/, '.ts'),
    },
    output: config.serviceworker.output(),
    resolve: { extensions: ['.mjs', '.js', '.ts', '.json'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
      ],
    },
    mode,
  },
};
