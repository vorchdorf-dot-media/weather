import { createClient } from '@urql/preact';
import fetch from 'isomorphic-unfetch';

const client = createClient({
  fetch,
  url: new URL(
    '/api/graphql',
    process.env.DEPLOY_PRIME_URL || 'http://localhost:3000'
  ).toString(),
});

export default client;
