import { createClient } from '@urql/svelte';

const URL = process.env.URL;

export default createClient({
  url: `${URL}/api/graphql`,
});
