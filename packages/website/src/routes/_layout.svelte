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

<Header {segment}/>

<main>
	<slot></slot>
</main>