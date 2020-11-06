const { resolve } = require('path');
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const ESlintPlugin = require('eslint-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

const isLocal = !process.env.CONTEXT;
const isProd =
  process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';

const devPlugins = [
  new DotenvPlugin({
    path: resolve(__dirname, './.env'),
  }),
  new HotModuleReplacementPlugin(),
];

module.exports = {
  mode: isProd ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(m?js|ts)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-typescript',
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: '12.0.0',
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin(Object.keys(process.env)),
    new ESlintPlugin({
      extensions: ['.js', '.ts'],
      files: ['!node_modules/'],
    }),
  ].concat(isLocal ? devPlugins : []),
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts'],
    mainFields: ['module', 'main'],
  },
  stats: true,
  watch: isLocal && !isProd,
  watchOptions: {
    ignored: ['**/*.test.ts', 'node_modules/**'],
  },
};
