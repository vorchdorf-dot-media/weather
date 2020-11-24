/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync } = require('fs');
const { basename } = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');

const locales = readdirSync('./locales').map(f => basename(f, '.json'));

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
    i18n: {
      defaultLocale: 'en',
      locales,
    },
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV !== 'production',
    },
    target: 'serverless',
    webpack: config => {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
      return config;
    },
  }
);
