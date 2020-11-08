const path = require('path');
const globby = require('globby');
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const ESlintPlugin = require('eslint-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

const isLocal = !process.env.CONTEXT;
const isProd =
  process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';

const node = process.env.AWS_LAMBDA_JS_RUNTIME
  ? process.env.AWS_LAMBDA_JS_RUNTIME.replace(/^nodejs/, '').replace(/\.x/, '')
  : '12';

const devPlugins = [
  new DotenvPlugin({
    path: path.resolve(__dirname, './.env'),
  }),
  new HotModuleReplacementPlugin(),
];

const functions = globby.sync('./*.ts');
const entry = functions.reduce((prev, current) => {
  const basename = path.basename(current, '.ts');
  return {
    ...prev,
    [basename]: `./${current}`,
  };
}, {});

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
                    node,
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
  watchOptions: {
    ignored: ['**/*.test.ts', 'node_modules/**'],
  },
  context: path.resolve(__dirname),
  entry,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '../../functions'),
  },
  target: 'node',
};
