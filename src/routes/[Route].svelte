<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    return { data };
  }
</script>

<script>
  import { onMount, tick } from "svelte";
  import justifiedLayout from "justified-layout";
  import Spic from "../components/spic.svelte";
  import { leaveRoute, leaveIndex, paddingCoef, photoseries } from "store.js";
  import { fly } from "svelte/transition";
  // import IntersectionObserver from "../../components/IntersectionObserver.svelte";

  // const object = $photoseries.find((el) => el.Route === pageslug);
  // photoseries.update((n) => [...n.slice(object.Id), ...n.slice(0, object.Id)]);
  let width,
    height,
    layout,
    gallery = {},
    visible = false;
  function getJL(w, h, text) {
    layout = justifiedLayout([...text.Aspect], {
      fullWidthBreakoutRowCadence: 2,
      targetRowHeight: h * 0.55,
      containerWidth: w,
      containerPadding: {
        top: 50,
        right: w * $paddingCoef,
        bottom: 50,
        left: w * $paddingCoef,
      },
      boxSpacing: {
        horizontal: w * 0.04,
        vertical: h * 0.07,
      },
    });
    layout.boxes.forEach((el, i) => {
      el.info = text.Spec[i];
      el.src = text.ImageName[i];
      el.imageWidth = imageWidth(el.width);
      el.style = `
          transform: translate(${Math.floor(el.left)}px, ${Math.floor(
        el.top
      )}px);
          overflow: hidden;
          border-radius: 4px;
          position: absolute;
          box-shadow: inset 0px 0px 0px 2px ${text.Spec[i].Color};
          width: ${Math.floor(el.width)}px;
          height: ${Math.floor(el.height)}px;
          background-image: radial-gradient(circle at bottom center, ${
            text.Spec[i].Colors[0]
          },${text.Spec[i].Colors[1]});
        `;
    });
    return layout;
  }
  export let data;
  $: post = data;

  // let promise = getJL(width, height, post);
  function imageWidth(x) {
    const calcWidth =
      x < 480
        ? 480
        : x < 720
        ? 720
        : x < 1024
        ? 1024
        : x < 1440
        ? 1440
        : x < 1920
        ? 1920
        : 2560;
    return calcWidth;
  }
  onMount(() => {
    // window.addEventListener("pagehide", function (event) {
    //   if (event.persisted === true) {
    //     console.log("This page *might* be entering the bfcache.");
    //   } else {
    //     console.log("This page will unload normally and be discarded.");
    //   }
    // });
    // window.addEventListener("pageshow", function (event) {
    //   if (event.persisted) {
    //     console.log("This page was restored from the bfcache.");
    //   } else {
    //     console.log("This page was loaded normally.");
    //   }
    // });
    getJL(width, height, post);
  });
</script>

<svelte:head>
  <title>{post.Title}</title>
</svelte:head>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<h1 transition:fly on:outrostart={() => leaveRoute.set(true)}>{post.Title}</h1>
{#if layout && !$leaveIndex}
  <div style="height: {layout.containerHeight}px" class="gallery">
    {#each layout.boxes as pos, index (index)}
      <div style={pos.style}>
        <Spic src={pos.src} wwidth={pos.imageWidth} />
      </div>
    {/each}
  </div>
{/if}

<style>
  h1 {
    display: none;
  }
</style>
