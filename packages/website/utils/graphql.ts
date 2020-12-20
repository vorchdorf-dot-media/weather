import { createClient } from '@urql/preact';
import fetch from 'isomorphic-unfetch';

import { URL as serverURL } from 'utils/constants';

const client = createClient({
  fetch,
  url: new URL('/api/graphql', serverURL).toString(),
});

export default client;
