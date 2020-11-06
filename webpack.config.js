const { resolve } = require('path');
const { EnvironmentPlugin } = require('webpack');
const DotenvPlugin = require('dotenv-webpack');

const isLocal = !process.env.CONTEXT;
const isProd =
  process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';

const devPlugins = [new DotenvPlugin()];

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
  plugins: [new EnvironmentPlugin(Object.keys(process.env))].concat(
    isLocal ? devPlugins : []
  ),
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts'],
    mainFields: ['module', 'main'],
  },
  stats: true,
};
