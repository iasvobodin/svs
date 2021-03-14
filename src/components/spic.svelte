<script>
  import { onMount } from "svelte";
  import { progress } from "store.js";
  import { fade } from "svelte/transition";
  export let src, wwidth;
  let visible = false,
    gallery;
  //   pic;
  function setOpacity() {
    console.log("load");
  }
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
    visible = entries[0].isIntersecting;
    entries.forEach((entry, i) => {
      // console.log(entry);
      if (entry.isIntersecting) {
        const lazyImg = entry.target;
        observer.unobserve(lazyImg);
      }
    });
  }, options);

  onMount(() => {
    observer.observe(gallery);
  });
</script>

<div class="holder" bind:this={gallery}>
  {#if visible}
    <picture transition:fade>
      <source srcset="image/image2/{wwidth}_{src}.webp" type="image/webp" />
      <img
        class="gallery__img"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decoding="async"
        draggable="false"
        src="image/image2/{wwidth}_{src}.jpg"
      />
    </picture>
  {/if}
</div>

<style>
  .gallery__img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
