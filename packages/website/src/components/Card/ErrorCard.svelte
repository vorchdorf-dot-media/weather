<style lang="scss">
  button {
    font-size: 0.875em;
  }

  code {
    display: block;
    text-align: left;
  }

  [role='heading'] {
    font-size: 1.25rem;
  }

  .svg-container {
    margin-right: var(--space-l);
    height: var(--space-l);
    width: var(--space-l);
  }

  .content-container {
    flex: 1;
  }

  .more-container {
    margin-top: var(--space-l);
    text-align: right;

    .svg-container {
      margin-right: var(--space-s);
    }
  }
</style>

<script lang="ts">
  import { _ } from 'svelte-i18n';

  import AlertIcon from 'assets/icons/alert.svg';
  import MoreIcon from 'assets/icons/more.svg';
  import Card from 'components/Card/Card.svelte';

  export let error: string;
  export let message: string;

  let show = false;

  const toggleShow = (e: MouseEvent) => {
    e.preventDefault();
    show = !show;
  };
</script>

<Card variant="grey">
  <div class="svg-container">
    {@html AlertIcon}
  </div>
  <div class="content-container">
    <span role="heading" aria-level="2">{message}</span>
    {#if error}
      <div class="more-container">
        {#if !show}
          <button on:click="{toggleShow}"><div class="svg-container">
              {@html MoreIcon}
            </div>{$_('actions.showMore')}
          </button>
        {:else}<code>{error}</code>{/if}
      </div>
    {/if}
  </div>
</Card>
