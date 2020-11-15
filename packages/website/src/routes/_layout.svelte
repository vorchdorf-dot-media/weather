<script context="module">
	import { isLoading, waitLocale } from 'svelte-i18n';

	export async function preload() {
		return waitLocale();
	}
</script>

<script lang="ts">
	import Header from 'components/Header/Header.svelte';

	export let segment: string;

	const production = process.env.CONTEXT === 'production';
</script>

<style>
</style>

<svelte:head>
	{#if !production}
		<meta name="robots" content="noindex,nofollow" />
	{/if}
</svelte:head>

{#if $isLoading}
<span>Loading...</span>
{:else}
<Header {segment}/>

<main>
	<slot></slot>
</main>
{/if}
