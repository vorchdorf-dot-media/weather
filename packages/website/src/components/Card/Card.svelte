<script lang="ts">
  export let variant: 'grey' | 'primary' | 'secondary';
</script>

<style>
  section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1.5rem;
    row-gap: 1rem;
    align-items: flex-start;
    border-radius: 8px;
    box-shadow: 0 5px 10px 0px HSL(var(--bg), 0.666);
    padding: 1rem;
    margin: 0.5rem;
    background-color: HSL(var(--bg, var(--color-primary-offset)));
    color: HSL(var(--fg, var(--color-main)));
  }

  .grey {
    --bg: var(--color-grey);
    --fg: var(--color-bg);
  }

  .primary {
    --bg: var(--color-primary-offset);
  }

  .secondary {
    --bg: var(--color-secondary-offset);
  }
</style>

<section class={variant}>
  <slot></slot>
</section>