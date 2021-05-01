/* eslint-disable @typescript-eslint/no-var-requires */
const { nanoid } = require('nanoid/async');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');

const locales = require('./locales');

module.exports = withPlugins(
  [
    withBundleAnalyzer({
      enabled:
        process.env.ANALYZE === 'true' && process.env.CONTEXT !== 'production',
    }),
    withPreact,
    withPWA,
  ],
  {
    future: {
      webpack5: true,
    },
    generateBuildId: async () => process.env.GITHUB_SHA || nanoid(),
    i18n: {
      defaultLocale: 'en',
      locales,
    },
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV !== 'production',
    },
    target: 'serverless',
    webpack: (config, { webpack }) => {
      config.module.rules.push(
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ['@svgr/webpack'],
        }
      );
      process.env.GITHUB_SHA &&
        config.plugins.push(
          new webpack.EnvironmentPlugin(Object.keys(process.env))
        );
      return config;
    },
  }
);
