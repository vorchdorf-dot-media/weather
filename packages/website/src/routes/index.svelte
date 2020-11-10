<script>
	import { _ } from 'svelte-i18n';
	import successkid from 'assets/successkid.jpg';
</script>

<style>
	figure, p {
		text-align: center;
		margin: 0 auto;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>{$_('index.title')}</h1>

<figure>
	<img alt="Success Kid" src="{successkid}">
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
