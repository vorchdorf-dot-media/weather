<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { EntrySchema } from '@saschazar/weather-app-functions/db/schemata/entry';
  import type { StationSchema } from '@saschazar/weather-app-functions/db/schemata/station';

  import Card from 'components/Card/Card.svelte';

  export let variant: 'grey' | 'primary' | 'secondary';

  export let data: EntrySchema;

  const {
    temperature,
    temperature2,
    humidity,
    feels,
    station
  } = data;

  const {
      config: {
        temperature: temperatureConfig,
        temperature2: temperature2Config
      }
    } = station as StationSchema;
</script>

<style lang="scss">
  .container {
    flex: 1;
    padding: var(--space-s);

    @media screen and (min-width: 768px) {
      padding: var(--space-m);
    }
  }

  .data,
  .label {
    display: block;
    width: 100%;
    text-align: right;
  }

	.data {
    font-size: 2.5rem;
  }

  .label {
    opacity: 0.667;
  }
</style>

<Card {variant}>
    {#if temperature}
      <div class="container">
        <small class="label">{$_(`config.${temperatureConfig}`)}:</small><span class="data">{temperature}<sup>°C</sup></span>
      </div>
    {/if}
    {#if temperature2}
      <div class="container">
        <small class="label">{$_(`config.${temperature2Config}`)}:</small><span class="data">{temperature2}<sup>°C</sup></span>
      </div>
      <div class="container">
        <small class="label">{$_('feels')}:</small><span class="data">{feels}<sup>°C</sup></span>
      </div>
      <div class="container">
        <small class="label">{$_('humidity')}:</small><span class="data">{humidity}<sup>%</sup></span>
      </div>
    {/if}
</Card>
