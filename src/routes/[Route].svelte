<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    return { data };
  }
</script>

<script>
  import { debounce } from "lodash-es/lodash";
  import { onMount, tick } from "svelte";
  import justifiedLayout from "justified-layout";
  import Spic from "../components/spic.svelte";
  import {
    showPrelader,
    eventAnimation,
    leaveRoute,
    leaveIndex,
    photoseries,
  } from "store.js";
  import { fly } from "svelte/transition";
  import { stores } from "@sapper/app";
  const { page } = stores();
  const object = $photoseries.find((el) => el.Route === $page.params.Route);
  photoseries.update((n) => [...n.slice(object.Id), ...n.slice(0, object.Id)]);
  showPrelader.set(false);
  eventAnimation.set(false);
  let paddingCoef;
  $: galleryParams = {};
  let layout,
    height,
    width,
    gallery = {};
  $: galleryHeight = 0;
  // visible = false;
  function getJL(text) {
    layout = justifiedLayout([...text.Aspect], {
      fullWidthBreakoutRowCadence: 2,
      targetRowHeight: window.innerHeight * 0.55,
      containerWidth: window.innerWidth,
      containerPadding: {
        top: 50,
        right: window.innerWidth * paddingCoef,
        bottom: 50,
        left: window.innerWidth * paddingCoef,
      },
      boxSpacing: {
        horizontal: window.innerWidth * 0.04,
        vertical: window.innerHeight * 0.07,
      },
    });
    galleryHeight = layout.containerHeight;
    galleryParams.style = [];
    galleryParams.width = [];
    layout.boxes.forEach((el, i) => {
      el.info = text.Spec[i];
      // el.src = text.ImageName[i];
      // el.imageWidth = imageWidth(el.width);
      galleryParams.width.push(imageWidth(el.width));
      galleryParams.style.push(`
          transform: translate(${Math.floor(el.left)}px, ${Math.floor(
        el.top
      )}px);
          box-shadow: inset 0px 0px 0px 2px ${text.Spec[i].Color};
          width: ${Math.floor(el.width)}px;
          height: ${Math.floor(el.height)}px;
          background-image: radial-gradient(circle at bottom center, ${
            text.Spec[i].Colors[0]
          },${text.Spec[i].Colors[1]});
        `);
      // el.style = `
      //     transform: translate(${Math.floor(el.left)}px, ${Math.floor(
      //   el.top
      // )}px);
      //     box-shadow: inset 0px 0px 0px 2px ${text.Spec[i].Color};
      //     width: ${Math.floor(el.width)}px;
      //     height: ${Math.floor(el.height)}px;
      //     background-image: radial-gradient(circle at bottom center, ${
      //       text.Spec[i].Colors[0]
      //     },${text.Spec[i].Colors[1]});
      //   `;
    });
    // return layout;
  }
  export let data;
  $: gallery = data;

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
  function resize(e) {
    paddingCoef = window.innerWidth / window.innerHeight > 1 ? 0.12 : 0.03;
    if (width != window.innerWidth) {
      getJL(gallery);
      width = window.innerWidth;
    }
    if (Math.abs(height - window.innerHeight) < 100) {
      return;
    }
    height = window.innerHeight;
    getJL(gallery);
  }
  onMount(() => {
    height = window.innerHeight;
    width = window.innerWidth;
    window.addEventListener("resize", debounce(resize, 400));
    paddingCoef = window.innerWidth / window.innerHeight > 1 ? 0.12 : 0.03;
    getJL(gallery);
    // resize();
  });
</script>

<svelte:head>
  <title>{gallery.Title}</title>
</svelte:head>

<h1 transition:fly on:outrostart={() => leaveRoute.set(true)}>
  {gallery.Title}
</h1>
{#if galleryHeight && !$leaveIndex}
  <div style="height: {galleryHeight}px" class="gallery">
    {#each gallery.ImageName as photo, index (index)}
      <div class="spic__holder" style={galleryParams.style[index]}>
        <Spic src={photo} wwidth={galleryParams.width[index]} />
      </div>
    {/each}
  </div>
{/if}

<style>
  h1 {
    display: none;
  }
  .gallery {
    width: 100vw;
    overflow: hidden;
    position: relative;
    /* max-width: 95vw; */
    /* width: 80vw;
    margin: auto; */
  }
  .spic__holder {
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
    transition: transform 0.5s;
  }
</style>
