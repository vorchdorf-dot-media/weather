import { createClient } from '@urql/preact';
import fetch from 'isomorphic-unfetch';

import { getUrl } from 'utils/constants';

const client = createClient({
  fetch,
  url: new URL('/api/graphql', getUrl()).toString(),
});

export default client;
