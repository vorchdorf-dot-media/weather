<style lang="scss">
  svg {
    --gradient: var(--color-main);

    position: absolute;
    background: transparent;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;

    rect {
      height: 100%;
      width: 100%;
    }

    stop {
      stop-color: HSL(var(--gradient), 0.125);
    }

    stop:first-of-type,
    stop:last-of-type {
      stop-color: HSL(var(--bg));
    }
  }

  span {
    display: block;
    position: absolute;
    font-size: var(--space-m);
    letter-spacing: var(--letter-spacing);
    text-transform: uppercase;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>

<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Card from 'components/Card/Card.svelte';

  export let height = '200px';
  export let variant: 'grey' | 'primary' | 'secondary';
</script>

<Card variant="{variant}">
  <div style="height: {height}">
    <svg width="100%" height="100%">
      <defs>
        <linearGradient id="grad-2">
          <stop offset="0%"></stop>
          <stop offset="100%"></stop>
          <stop offset="0%"></stop>
          <animate
            attributeName="x1"
            from="-150%"
            to="150%"
            dur="3s"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="x2"
            from="0%"
            to="300%"
            dur="3s"
            repeatCount="indefinite"
          ></animate>
        </linearGradient>
      </defs>
      <rect fill="url(#grad-2)"></rect>
    </svg>
    <span role="heading" aria-level="2">{$_('loading')}</span>
  </div>
</Card>
