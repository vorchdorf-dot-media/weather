import React from 'react';
import nextpkg from 'next/package.json';

import pkg from 'package.json';
import socialData from 'data/social.json';

export interface SEOProps {
  description?: string;
  image?: string;
  name: string;
  path: string;
}

const SEOBlock = ({
  description,
  image,
  name,
  path,
}: SEOProps): JSX.Element => {
  const fallback = `${process.env.URL || ''}/card-image.jpg`;
  const url = `${process.env.URL || ''}${path}`;

  const { username } =
    socialData.find(({ provider }) => provider === 'twitter') || {};

  return (
    <>
      <meta name="author" content={pkg.author.name} />
      <meta name="generator" content={`Next ${nextpkg.version}`} />
      <meta name="description" content={description || pkg.description} />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="manifest" href="/api/manifest.json" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link
        rel="apple-touch-icon"
        type="image/png"
        href="/icons/apple-touch-icon-192.png"
      />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={name} />
      <meta
        property="og:description"
        content={description || pkg.description}
      />
      <meta property="og:image" content={image || fallback} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={username} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={name} />
      <meta
        name="twitter:description"
        content={description || pkg.description}
      />
      <meta name="twitter:image" content={image || fallback} />
    </>
  );
};

export default SEOBlock;
