<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`/db/${params.Route}.json`);
    const data = await res.json();
    const Route = params.Route;
    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import { onMount } from "svelte";
  import justifiedLayout from "justified-layout";
  import { stores } from "@sapper/app";
  import About from "../about.svelte";
  import App from "../../../../svelte-photoday/src/App.svelte";
  let width = 1500;
  let height = 1000;
  if (process.browser) {
    height = window.innerHeight;
    width = window.innerWidth;
  }
  const { page } = stores();
  const { Route } = $page.params;
  export let post;

  let layout;
  async function getRandomNumber() {
    const res = await fetch(`/db/${Route}.json`);
    const text = await res.json();

    if (res.ok) {
      layout = justifiedLayout([...text.Aspect], {
        fullWidthBreakoutRowCadence: 2,
        targetRowHeight: window.innerHeight * 0.55,
        containerWidth: window.innerWidth,
        containerPadding: {
          top: 50,
          right: window.innerWidth * 0.05,
          bottom: 50,
          left: window.innerWidth * 0.05,
        },
        boxSpacing: {
          horizontal: window.innerWidth * 0.04,
          vertical: window.innerHeight * 0.07,
        },
      });
      layout.boxes.forEach((el, i) => {
        el.info = text.Spec[i];
        el.src = text.ImageName[i];
        el.imageWidth = imageWidth(el.width);
        el.style = {
          transform: `translate(${Math.floor(el.left)}px, ${Math.floor(
            el.top
          )}px)`,
          position: "absolute",
          boxShadow: `inset 0px 0px 0px 2px ${text.Spec[i].Color}`,
          width: `${Math.floor(el.width)}px`,
          height: `${Math.floor(el.height)}px`,
          backgroundImage: `radial-gradient(circle at bottom center, ${text.Spec[i].Colors[0]},${text.Spec[i].Colors[1]})`,
        };
      });
      return layout;
    } else {
      throw new Error(text);
    }
  }

  let promise = getRandomNumber();
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
    let promise = getRandomNumber();
    getjl(window.innerWidth, window.innerHeight);
    console.log(layout);
  });
  function getjl(w, h) {
    layout = justifiedLayout([...post.Aspect], {
      fullWidthBreakoutRowCadence: 2,
      targetRowHeight: h * 0.55,
      containerWidth: w,
      containerPadding: {
        top: 50,
        right: window.innerWidth * 0.05,
        bottom: 50,
        left: window.innerWidth * 0.05,
      },
      boxSpacing: {
        horizontal: window.innerWidth * 0.04,
        vertical: h * 0.07,
      },
    });
    layout.boxes.forEach((el, i) => {
      el.info = post.Spec[i];
      el.src = post.ImageName[i];
      el.imageWidth = imageWidth(el.width);
      el.style = {
        transform: `translate(${Math.floor(el.left)}px, ${Math.floor(
          el.top
        )}px)`,
        position: "absolute",
        boxShadow: `inset 0px 0px 0px 2px ${post.Spec[i].Color}`,
        width: `${Math.floor(el.width)}px`,
        height: `${Math.floor(el.height)}px`,
        backgroundImage: `radial-gradient(circle at bottom center, ${post.Spec[i].Colors[0]},${post.Spec[i].Colors[1]})`,
      };
    });
    return layout;
  }
</script>

<style>
</style>

<svelte:head>
  <title>{post.Title}</title>
</svelte:head>

<h1>{post.Title}</h1>

{#await promise}
  <p>...подождите</p>
{:then value}
  <!-- <p>{value.ImageName}</p> -->
  {#each value.boxes as pos, index (index)}
    <!-- <picture>
  <source
    :srcset="`/image/webp/${data.imageWidth}/${data.src}.webp`"
    type="image/webp" />
  <img
    class="gallery__img"
    alt="SvobodinaPhoto"
    crossorigin="anonimous"
    decoding="async"
    draggable="false"
    src="/image/jpg/${data.imageWidth}/${data.src}.jpg" />
</picture> -->
    <!-- style={layout.boxes[index].style} -->
    <div style={JSON.stringify(...pos.style)}>
      <img src="/image/jpg/720/{pos.src}.jpg" alt="" />
    </div>
    <!-- <li>{pos}</li> -->
  {/each}
  <!-- <p>Число равно {number}</p> -->
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
