<script>
  import Canvas2 from "../components/canvas2.svelte";
  import Preloader from "../components/preloader.svelte";
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { showPrelader, photoseries, titleIndex } from "store.js";
  const { page } = stores();
  if ($page.params.Route) {
    showPrelader.set(false);
    const object = $photoseries.find((el) => el.Route === $page.params.Route);
    photoseries.update((n) => [
      ...n.slice(object.Id),
      ...n.slice(0, object.Id),
    ]);
    console.log("sortph");
    titleIndex.set(object.Id);
  }
  console.log("_layoutInit");
  onMount(() => {
    console.log("onMount layout");
  });
  // const { preloading } = stores();
  // $: console.log($preloading, "$preloading");
  export let segment;
  segment = !segment;
</script>

<!-- {#if !$preloading} -->
<main transition:fade>
  {#if $showPrelader}
    <Preloader />
  {/if}
  <div class="canvas">
    <Canvas2 />
  </div>
  <!-- <section class="photoseries" /> -->
  <section class="route">
    <slot />
  </section>
</main>

<!-- {/if} -->
<style>
  main {
    position: relative;
    background-color: black;
    box-sizing: border-box;
  }
  .canvas {
    height: calc(var(--vh, 1vh) * 100);
    /* height: 100vh; */
  }
</style>
