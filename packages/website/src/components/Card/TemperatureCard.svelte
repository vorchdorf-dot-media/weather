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

<style>
	.data {
		font-size: 2.5rem;
		justify-self: right;
	}
</style>

<Card {variant}>
	<div>
    {$_(`config.${temperatureConfig}`)} <span class="data">{temperature}<sup>°C</sup></span>
    <br />
    {$_(`config.${temperature2Config}`)} <span class="data">{temperature2}<sup>°C</sup></span>
    </div>
    <div>
      {$_('feels')} <span class="data">{feels}<sup>°C</sup></span>
    </div>
    <div>
      {$_('humidity')} <span class="data">{humidity}<sup>%</sup></span>
    </div>
</Card>