import pkg from 'package.json';

import { getUrl } from 'utils/constants';

const { author, description, manifest, version } = pkg;

export default {
  $schema: 'http://json.schemastore.org/web-manifest',
  author: author.name,
  background: {
    persistent: false,
  },
  short_name: manifest.short_name,
  name: manifest.name,
  description: description,
  scope: '/',
  default_locale: 'en',
  display: 'standalone',
  homepage_url: getUrl(),
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
  background_color: '#587B7E',
  theme_color: '#587B7E',
  start_url: '/?utm_source=web_app_manifest',
  orientation: 'any',
  version: version,
};
