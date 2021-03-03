<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    // let [Route, type] = params.Route;

    return { data };
    // return { data };
  }
</script>

<!--<script context="module" ✂prettier:content✂="CglleHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlbG9hZCh7IHBhcmFtcyB9KSB7CgkJbGV0IFtzbHVnLCB5ZWFyLCBtb250aCwgZGF5XSA9IHBhcmFtcy5zbHVnOwoKCQlyZXR1cm4geyBzbHVnLCB5ZWFyLCBtb250aCwgZGF5IH07Cgl9Cg==" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>-->
<script>
  import { debounce } from "lodash-es/lodash";
  import { onMount, tick } from "svelte";
  import justifiedLayout from "justified-layout";
  import Spic from "../../../../components/spic.svelte";
  import anime from "animejs";
  import Buttondown from "../../../../components/buttondown.svelte";
  import {
    titleIndex,
    showPrelader,
    eventAnimation,
    leaveRoute,
    leaveIndex,
    typePhotoseries,
    photoseries,
    homePageState,
  } from "store.js";
  import { fly } from "svelte/transition";
  import { stores } from "@sapper/app";
  console.log("routeInit");
  const { page } = stores();
  // showPrelader.set(false);
  // eventAnimation.set(false);
  // const object = $photoseries.find((el) => el.Route === $page.params.Route);
  // if (!$homePageState) {
  //   console.log("sort ph");
  //   photoseries.update((n) => [
  //     ...n.slice(object.Id),
  //     ...n.slice(0, object.Id),
  //   ]);
  //   homePageState.set(false);
  // }
  // titleIndex.set(object.Id);
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
        horizontal: window.innerWidth * 0.06,
        vertical: window.innerHeight * 0.09,
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
          transform: translate(${
            Math.floor(el.left) + anime.random(-width * 0.028, width * 0.028)
          }px, ${
        Math.floor(el.top) + anime.random(-height * 0.045, height * 0.045)
      }px);
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
    console.log($typePhotoseries, "typePhotoseries");
    console.log("random", anime.random(0, 270));
    height = window.innerHeight;
    width = window.innerWidth;

    console.log("route onmount");

    window.addEventListener("resize", debounce(resize, 400));
    paddingCoef = window.innerWidth / window.innerHeight > 1 ? 0.12 : 0.03;
    getJL(gallery);
    // resize();
    // anime.set(".spic__holder", {
    //   translateX: {
    //     value: `+=${anime.random(-width * 0.017, width * 0.017)}`,
    //   },
    //   translateY: () => anime.random(-height * 0.03, height * 0.03),
    // });
  });
</script>

<svelte:head>
  <title>{gallery.Title}</title>
</svelte:head>
<Buttondown />
<h1 transition:fly on:outrostart={() => leaveRoute.set(true)}>
  {gallery.Title}
</h1>

<!-- <div class="div"> -->
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
  /* .div {
    width: 100%;
 display: block;
 position: relative;
 top: -2px;
 height: 166px;
 background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1920 166" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="rgba(47, 73, 94, 1)" d="M 0 0 C 388.40000000000003 0 582.5999999999999 110 971 110 L 971 110 L 971 0 L 0 0 Z" stroke-width="0"></path> <path fill="rgba(47, 73, 94, 1)" d="M 970 110 C 1350 110 1540 166 1920 166 L 1920 166 L 1920 0 L 970 0 Z" stroke-width="0"></path> </svg>');
 background-size: cover;
 background-repeat: no-repeat;
}
@media (max-width:1819px) {
 .div {
   background-size: contain;
 }
} */
  h1 {
    display: none;
  }
  .gallery {
    width: 100%;
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
