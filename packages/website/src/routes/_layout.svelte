<script lang="ts">
	import Header from 'components/Header/Header.svelte';

	export let segment: string;
</script>

<style>
</style>

<Header {segment}/>

<main>
	<slot></slot>
</main>