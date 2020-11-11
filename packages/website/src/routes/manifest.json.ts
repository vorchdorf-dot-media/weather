import type { IncomingMessage, ServerResponse } from 'http';
import pkg from '../../package.json';

export const contents = {
  author: pkg.author.name,
  background: {
    persistent: false,
  },
  background_color: '#587B7E',
  description: pkg.description,
  default_locale: 'en',
  display: 'standalone',
  homepage_url: process.env.URL || pkg.author.url,
  icons: [
    {
      src: '/icons/rounded-icon-192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: '/icons/rounded-icon-512.png',
      type: 'image/png',
      sizes: '512x512',
    },
    {
      src: '/icons/maskable-icon-192.png',
      type: 'image/png',
      sizes: '192x192',
      purpose: 'maskable',
    },
    {
      src: '/icons/maskable-icon-512.png',
      type: 'image/png',
      sizes: '512x512',
      purpose: 'maskable',
    },
  ],
  manifest_version: 2,
  version: pkg.version,
  scope: '/',
  start_url: '/?source=pwa',
  theme_color: '#587B7E',
  ...pkg.manifest,
};

export const get = (_req: IncomingMessage, res: ServerResponse): void => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  return res.end(JSON.stringify(contents));
};
