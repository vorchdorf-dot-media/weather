const {
  env: { URL },
} = import.meta as any;

export const contents = {
  author: 'Sascha Zarhuber',
  background: {
    persistent: false,
  },
  background_color: '#587B7E',
  description: 'Test',
  default_locale: 'en',
  display: 'standalone',
  homepage_url: URL,
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
  version: '0.0.1',
  scope: '/',
  start_url: '/?source=pwa',
  theme_color: '#587B7E',
};

export const get = (): {
  headers: { [key: string]: string };
  body: unknown;
} => ({
  headers: {
    'Content-Type': 'application/json',
  },
  body: contents,
});
