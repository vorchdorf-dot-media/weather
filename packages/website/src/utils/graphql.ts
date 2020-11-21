import { createClient } from '@urql/svelte';

export default createClient({
  url: `/api/graphql`,
});
