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
  import { stores } from "@sapper/app";

  let width = 1500;
  let height = 1000;
  let layout,
    gallery,
    visible = false;
  async function getJL(w, h, text) {
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

  let promise = getJL(width, height, post);
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
    promise = getJL(width, height, post);

    const options = {
      // родитель целевого элемента - область просмотра
      root: null,
      // без отступов
      rootMargin: "0px",
      // процент пересечения - половина изображения
      threshold: 0.5,
    };

    // создаем наблюдатель
    const observer = new IntersectionObserver((entries, observer) => {
      // для каждой записи-целевого элемента
      entries.forEach((entry, i) => {
        console.log(entry);
        // если элемент является наблюдаемым
        if (entry.isIntersecting) {
          const lazyImg = entry.target;
          // выводим информацию в консоль - проверка работоспособности наблюдателя
          console.log(lazyImg);
          // меняем фон контейнера
          lazyImg.style.background = "deepskyblue";
          // прекращаем наблюдение
          observer.unobserve(lazyImg);
        }
      });
    }, options);

    // с помощью цикла следим за всеми img на странице
    const arr = document.querySelectorAll(".gallery__img");
    arr.forEach((i) => {
      observer.observe(i);
    });
  });
</script>

<style>
  .gallery__img {
    /* display: none; */
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>

<svelte:head>
  <title>{post.Title}</title>
</svelte:head>

<h1>{post.Title}</h1>
<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if layout}
  <div bind:this={gallery}>
    {#each layout.boxes as pos, index (index)}
      <div style={pos.style}>
        {#if visible}
          <picture>
            <source
              srcset="/image/webp/{pos.imageWidth}/{pos.src}.webp"
              type="image/webp" />
            <img
              class="gallery__img"
              alt="SvobodinaPhoto"
              crossorigin="anonimous"
              decoding="async"
              draggable="false"
              src="/image/jpg/{pos.imageWidth}/{pos.src}.jpg" />
          </picture>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>Loading...</p>
{/if}

<!-- {#await promise}
  <p>...подождите</p>
{:then value}
  <div bind:this={gallery}>
    {#each value.boxes as pos, index (index)}
      <div style={pos.style}>
        <picture>
          <source
            srcset="/image/webp/{pos.imageWidth}/{pos.src}.webp"
            type="image/webp" />
          <img
            class="gallery__img"
            alt="SvobodinaPhoto"
            crossorigin="anonimous"
            decoding="async"
            draggable="false"
            src="/image/jpg/{pos.imageWidth}/{pos.src}.jpg" />
        </picture>
      </div>
    {/each}
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await} -->
