/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');

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
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV !== 'production',
    },
    target: 'serverless',
  }
);
