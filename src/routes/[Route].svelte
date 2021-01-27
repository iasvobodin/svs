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
  let createJL = true;
  $: width = 0;
  $: height = 0;
  $: paddingCoef = 0;
  $: poStyle = [];
  let layout,
    gallery = {},
    visible = false;
  function getJL(text, paddingCoef) {
    console.log(window.innerWidth, 1);
    // debugger;
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
    poStyle = [];
    layout.boxes.forEach((el, i) => {
      el.info = text.Spec[i];
      el.src = text.ImageName[i];
      el.imageWidth = imageWidth(el.width);

      poStyle.push(`
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
      el.style = `
          transform: translate(${Math.floor(el.left)}px, ${Math.floor(
        el.top
      )}px);
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
    paddingCoef = window.innerWidth / window.innerHeight > 1 ? 0.12 : 0.03;
    getJL(post, paddingCoef);

    // window.innerWidth / window.innerHeight >= 1
    //   ? paddingCoef.set(0.12)
    //   : paddingCoef.set(0.03);
    // window.addEventListener(
    //   "resize",
    //   // debounce(
    //   resize
    //   // , 1000)
    // );
  });
  function resize(e) {
    console.log(e.srcElement.innerWidth);
    paddingCoef = window.innerWidth / window.innerHeight > 1 ? 0.12 : 0.03;
    // // setTimeout(() => {
    // console.log(window.innerWidth);
    // width = window.innerWidth;
    // height = window.innerHeight;
    // if (e.isTrusted) {
    getJL(post, paddingCoef);
    // }
    // }, 0);
  }
</script>

<style>
  h1 {
    display: none;
  }
  .gallery {
    /* max-width: 95vw; */
    /* width: 80vw;
    margin: auto; */
  }
  .spic__holder {
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
  }
</style>

<svelte:head>
  <title>{post.Title}</title>
</svelte:head>
<svelte:window
  on:resize={resize}
  bind:innerWidth={width}
  bind:innerHeight={height} />
<h1 transition:fly on:outrostart={() => leaveRoute.set(true)}>{post.Title}</h1>
{#if layout && !$leaveIndex}
  <div style="height: {layout.containerHeight}px" class="gallery">
    {#each layout.boxes as pos, index (index)}
      <div class="spic__holder" style={poStyle[index]}>
        <Spic src={post.ImageName[index]} wwidth={pos.imageWidth} />
      </div>
    {/each}
  </div>
{/if}
