<script lang="ts">
  import { operationStore, query } from '@urql/svelte';
  import { _ } from 'svelte-i18n';

  import LoadingCard from 'components/Card/LoadingCard.svelte';
  import SEO from 'components/SEO/SEO.svelte';
  import TemperatureCard from 'components/Card/TemperatureCard.svelte';
  import { GET_LATEST_ENTRY, GET_STATIONS } from 'utils/queries';

  const stations = operationStore(GET_STATIONS);
  query(stations);

  const entry = operationStore(
    GET_LATEST_ENTRY,
    { station: undefined },
    { pause: true }
  );
  query(entry);

  stations.subscribe(({ data = {} }) => {
    const { stations: [{ id = null } = {}] = [] } = data;
    if (id) {
      $entry.variables.station = id;
      $entry.context.pause = false;
    }
  });
</script>

<svelte:head>
  <SEO
    title="{String($_('index.title'))}"
    description="{String($_('index.description'))}"
  />
</svelte:head>

{#if $entry.fetching || !$entry.data}
  <LoadingCard variant="primary" />
{:else if $entry.error}
  <div>{$entry.error.message}</div>
{:else}
  <TemperatureCard variant="primary" data="{$entry.data.entry}" />
{/if}
