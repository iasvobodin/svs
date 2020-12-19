<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let entry = {};
  let element;

  $: inView = entry.isIntersecting;
</script>

<IntersectionObserver {element} bind:entry>
  <div class="element" bind:this={element}>
    {#if inView}
      <slot />
    {/if}
  </div>
</IntersectionObserver>
