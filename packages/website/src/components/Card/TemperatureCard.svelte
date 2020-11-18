<style lang="scss">
  a {
    transition: opacity 200ms ease-in;
    flex: 0 0 auto;
    display: block;
    border-radius: 9999px;
    padding: var(--space-s);
    color: HSL(var(--bg));
    background-color: HSL(var(--fg));
    height: var(--size-touch);
    width: var(--size-touch);
    opacity: 0.667;

    @media (hover: none) {
      opacity: 1;
    }

    &:focus {
      outline: none;
    }

    &:focus,
    &:hover {
      opacity: 1;
    }
  }
  .container {
    flex: 1;
    padding: var(--space-m);
  }

  .header,
  .footer {
    flex: 1 0 auto;
    width: 100%;
  }

  .header {
    display: flex;
    align-items: flex-end;
    align-self: start;
    justify-content: space-between;
    border-bottom: 1px solid HSL(var(--color-main), 0.25);
    margin-bottom: var(--space-m);
    text-transform: uppercase;
  }

  .header,
  .footer,
  .label {
    letter-spacing: var(--letter-spacing);
  }

  .footer,
  .data,
  .label {
    text-align: right;
  }

  .data,
  .label {
    display: block;
    width: 100%;
  }

  .data {
    font-size: 2.5rem;
  }

  .footer,
  .label {
    opacity: 0.875;
  }

  .footer {
    align-self: end;

    span {
      display: inline-block;
      height: 1em;
    }
  }
</style>

<script lang="ts">
  import { _, date, number, time } from 'svelte-i18n';
  import type { EntrySchema } from '@saschazar/weather-app-functions/db/schemata/entry';
  import type { StationSchema } from '@saschazar/weather-app-functions/db/schemata/station';

  import AlertIcon from 'assets/icons/alert.svg';
  import ArrowUpRighticon from 'assets/icons/arrow-up-right.svg';
  import Card from 'components/Card/Card.svelte';
  import { DAY } from 'utils/constants';

  export let segment: string;

  export let variant: 'grey' | 'primary' | 'secondary';

  export let data: EntrySchema;

  const {
    timestamp,
    temperature,
    temperature2,
    humidity,
    feels,
    station,
  } = data;

  const {
    name,
    id,
    config: {
      temperature: temperatureConfig,
      temperature2: temperature2Config,
    },
  } = station as StationSchema;
</script>

<Card variant="{variant}">
  {#if name}
    <div class="container header">
      <span
        role="heading"
        aria-level="2"
        aria-label="{$_('station.latestEntry')}: {name}"
      >
        <strong>{name}</strong>
      </span>
      {#if id && segment !== id}
        <a rel="prefetch" href="/stations/{id}">{@html ArrowUpRighticon}</a>
      {/if}
    </div>
  {/if}
  {#if temperature}
    <div class="container">
      <small class="label">{$_(`config.${temperatureConfig}`)}:</small><span
        class="data"
      >{$number(temperature, { format: 'compactShort' })}<sup>°C</sup></span>
    </div>
  {/if}
  {#if temperature2}
    <div class="container">
      <small class="label">{$_(`config.${temperature2Config}`)}:</small><span
        class="data"
      >{$number(temperature2, { format: 'compactShort' })}<sup>°C</sup></span>
    </div>
    <div class="container">
      <small class="label">{$_('feels')}:</small><span
        class="data"
      >{$number(feels, { format: 'compactShort' })}<sup>°C</sup></span>
    </div>
    <div class="container">
      <small class="label">{$_('humidity')}:</small><span
        class="data"
      >{$number(humidity, { format: 'compactShort' })}<sup>%</sup></span>
    </div>
  {/if}
  {#if timestamp}
    <small class="container footer">
      {$_('station.lastUpdated')}:
      {#if new Date(timestamp).valueOf() < Date.now() - DAY}
        <span>{@html AlertIcon}</span>
        {$date(new Date(timestamp), { format: 'medium' })}
      {/if}
      {$time(new Date(timestamp), { format: 'short' })}
    </small>
  {/if}
</Card>
