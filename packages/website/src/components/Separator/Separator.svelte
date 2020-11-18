<style>
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: var(--space-l) var(--space-s) var(--space-m);
  }

  hr {
    background-color: HSL(var(--color-main));
    height: 2px;
    width: 100%;
    opacity: 0.333;
  }

  hr:first-child {
    margin-right: var(--space-l);
  }

  hr:last-child {
    margin-left: var(--space-l);
  }
</style>

<div>
  <hr />
  <slot />
  <hr />
</div>
