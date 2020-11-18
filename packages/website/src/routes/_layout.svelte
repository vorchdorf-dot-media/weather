<style>
</style>

<script context="module">
  import { isLoading, waitLocale } from 'svelte-i18n';

  export async function preload() {
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

  const production = process.env.CONTEXT === 'production';
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
