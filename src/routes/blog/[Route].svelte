<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import { onMount, tick } from "svelte";
  import justifiedLayout from "justified-layout";
  import Spic from "../../components/spic.svelte";
  // import IntersectionObserver from "../../components/IntersectionObserver.svelte";

  let width = 1500;
  let height = 1000;
  let layout,
    gallery = {},
    visible = false;
  function getJL(w, h, text) {
    layout = justifiedLayout([...text.Aspect], {
      fullWidthBreakoutRowCadence: 2,
      targetRowHeight: h * 0.55,
      containerWidth: w,
      containerPadding: {
        top: 50,
        right: w * 0.05,
        bottom: 50,
        left: w * 0.05,
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
  export let post;

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
    getJL(width, height, post);
  });
</script>

<svelte:head>
  <title>{post.Title}</title>
</svelte:head>

<h1>{post.Title}</h1>
<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if layout}
  <div>
    {#each layout.boxes as pos, index (index)}
      <div style={pos.style}>
        <Spic src={pos.src} wwidth={pos.imageWidth} />
      </div>
    {/each}
  </div>
{:else}
  <p>Loading...</p>
{/if}
