<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { EntrySchema } from '@saschazar/weather-app-functions/db/schemata/entry';

  import SEO from 'components/SEO/SEO.svelte';
  import TemperatureCard from 'components/Card/TemperatureCard.svelte';

  const entry: EntrySchema = {
    temperature: 22.6,
    temperature2: 22.73,
    humidity: 60,
    feels: 22.8,
    timestamp: new Date('2020-11-15T18:36:27.764Z'),
    hash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
    station: {
      name: 'Einsiedling 1',
      email: 'test@mail.com',
      config: {
        temperature: 'OUT',
        temperature2: 'OUT',
      },
    },
  };
</script>

<svelte:head>
  <SEO
    title="{String($_('index.title'))}"
    description="{String($_('index.description'))}"
  />
</svelte:head>

<TemperatureCard variant="primary" data="{entry}" />
