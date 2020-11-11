<script>
	import { _ } from 'svelte-i18n';
	
	import SEO from 'components/SEO/SEO.svelte';
	import pkg from '../../package.json';
</script>

<style>
</style>

<svelte:head>
	<SEO title={$_('index.title')} description={$_('index.description')} />
</svelte:head>

<h1>{$_('index.headline')}</h1>

