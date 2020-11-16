<style>
  section {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 0 5px 10px 0px HSL(var(--bg), 0.666);
    padding: var(--space-m);
    margin: var(--space-s);
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

<script lang="ts">
  export let variant: 'grey' | 'primary' | 'secondary';
</script>

<section class="{variant}">
  <slot />
</section>
