<style>
</style>

<script context="module">
  import {
    addMessages,
    init,
    getLocaleFromNavigator,
    isLoading,
    waitLocale,
  } from 'svelte-i18n';

  import en from 'locales/en.json';
  import de from 'locales/de.json';

  const INIT_OPTIONS = {
    fallbackLocale: 'en',
    initialLocale: null,
    loadingDelay: 200,
    formats: {},
    warnOnMissingMessages: true,
  };

  addMessages('en', en);
  addMessages('de', de);

  export async function preload() {
    init({
      ...INIT_OPTIONS,
      initialLocale: getLocaleFromNavigator(),
    });
    return waitLocale();
  }
</script>

<script lang="ts">
  import { setClient } from '@urql/svelte';

  import LoadingCard from 'components/Card/LoadingCard.svelte';
  import Header from 'components/Header/Header.svelte';
  import client from 'utils/graphql';

  export let segment;

  setClient(client);

  const production = import.meta.env.CONTEXT === 'production';
</script>

<svelte:head>
  {#if !production}
    <meta name="robots" content="noindex,nofollow" />
  {/if}
</svelte:head>

{#if $isLoading}
  <LoadingCard variant="grey" height="100vh" />
{:else}
  <Header segment="{segment}" />

  <main>
    <slot />
  </main>
{/if}
