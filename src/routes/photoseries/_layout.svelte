<script>
  import Canvas2 from "../../components/canvas2.svelte";
  import Preloader from "../../components/preloader.svelte";
  import { stores } from "@sapper/app";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { showPrelader } from "store.js";
  const { page } = stores();
  // if ($page.params.Route) {
  //   showPrelader.set(false);
  // }
  console.log("_layoutInit");
  onMount(() => {
    console.log($page.params, "onMount layout");
    // let vh = window.innerHeight * 0.01;
    // document.documentElement.style.setProperty("--vh", `${vh}px`);
    // window.addEventListener("resize", () => {
    // 	let vh = window.innerHeight * 0.01;
    // 	document.documentElement.style.setProperty("--vh", `${vh}px`);
    // });
  });
  // const { preloading } = stores();
  // $: console.log($preloading, "$preloading");
  export let segment;
  console.log(segment, "segment");
  // segment = !segment;
</script>

<!-- {#if !$preloading} -->
<main transition:fade>
  {#if $showPrelader}
    <Preloader />
  {/if}

  <a class="link_to" href="/about/">О себе</a>
  <!-- {#if $page.params.Route } -->
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
  .link_to {
    z-index: 3;
    position: fixed;
    top: 20px;
    right: 40px;
    color: white;
    text-decoration-line: none;
    font-family: Comfortaa;
    font-weight: 150;
    font-size: 20px;
    line-height: 24px;
  }
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
