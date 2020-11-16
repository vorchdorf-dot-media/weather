<script lang="ts">
  import { stores } from '@sapper/app';

  import CardImage from 'assets/images/card-image.jpg';
  import seo from 'components/SEO/seo.json';
  import { contents } from 'routes/manifest.json.ts';

  export let description: string = contents.description;
  export let title: string = contents.name;
  export let image: string = `${contents.homepage_url}/${CardImage}`;

  const { page } = stores();
  $: url = `${contents.homepage_url}${$page.path}`;
</script>

<title>{title}</title>
<meta name="description" content="{description}" />

<!-- Facebook Meta Tags-->
<meta property="og:url" content="{url}" />
<meta property="og:type" content="{seo.og.type}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
{#if image}
  <meta property="og:image" content="{image}" />
{/if}

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="{seo.twitter.type}" />
<meta property="twitter:url" content="{url}" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
{#if image}
  <meta property="twitter:image" content="{image}" />
{/if}
