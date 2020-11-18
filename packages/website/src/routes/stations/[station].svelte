<style>
  h2 {
    margin: 0;
    letter-spacing: var(--letter-spacing);
    text-transform: uppercase;
  }
</style>

<script lang="ts" context="module">
  export async function preload(page) {
    const { station } = page.params;
    return { station };
  }
</script>

<script lang="ts">
  import { operationStore, query } from '@urql/svelte';
  import { _ } from 'svelte-i18n';
  import ErrorCard from 'components/Card/ErrorCard.svelte';
  import LoadingCard from 'components/Card/LoadingCard.svelte';
  import TemperatureCard from 'components/Card/TemperatureCard.svelte';
  import { DAY } from 'utils/constants';
  import { GET_ENTRIES, GET_LATEST_ENTRY } from 'utils/queries';
  import Separator from 'components/Separator/Separator.svelte';

  export let station: string;

  const from = new Date(Date.now() - DAY).toISOString();

  const entry = operationStore(GET_LATEST_ENTRY, { station });
  query(entry);

  const entries = operationStore(GET_ENTRIES, { station, from });
  query(entries);
</script>

{#if $entry.fetching || !$entry.data}
  <LoadingCard variant="primary" />
{:else if $entry.error}
  <ErrorCard
    message="{String($_('stations.entry.error'))}"
    error="{$entry.error.message}"
  />
{:else}
  <TemperatureCard
    segment="{station}"
    variant="primary"
    data="{$entry.data.entry}"
  />
{/if}
<Separator>
  <h2>{$_('stations.statistics')}</h2>
</Separator>
{#if $entries.fetching || !$entry.data}
  <LoadingCard variant="secondary" />
{:else if $entries.error}
  <ErrorCard
    message="{String($_('stations.entries.error'))}"
    error="{$entries.error.message}"
  />
{:else}
  <div>Hello</div>
{/if}
