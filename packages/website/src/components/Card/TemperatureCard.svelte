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
  }
</style>

<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import type { EntrySchema } from '@saschazar/weather-app-functions/db/schemata/entry';
  import type { StationSchema } from '@saschazar/weather-app-functions/db/schemata/station';

  import ArrowUpRighticon from 'assets/icons/arrow-up-right.svg';
  import Card from 'components/Card/Card.svelte';

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

  const updated =
    timestamp &&
    new Intl.DateTimeFormat($locale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(new Date((timestamp as unknown) as string));
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
      >{temperature}<sup>°C</sup></span>
    </div>
  {/if}
  {#if temperature2}
    <div class="container">
      <small class="label">{$_(`config.${temperature2Config}`)}:</small><span
        class="data"
      >{temperature2}<sup>°C</sup></span>
    </div>
    <div class="container">
      <small class="label">{$_('feels')}:</small><span class="data">{feels}<sup
        >°C</sup></span>
    </div>
    <div class="container">
      <small class="label">{$_('humidity')}:</small><span
        class="data"
      >{humidity}<sup>%</sup></span>
    </div>
  {/if}
  {#if updated}
    <small class="container footer">
      {$_('station.lastUpdated')}:
      {updated}
    </small>
  {/if}
</Card>
