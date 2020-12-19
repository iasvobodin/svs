<script>
  import { onMount } from "svelte";

  export let src, wwidth;
  let visible = false,
    gallery;
  //   pic;
  onMount(() => {
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
      // console.log(entries);
      visible = entries[0].isIntersecting;
      // для каждой записи-целевого элемента
      entries.forEach((entry, i) => {
        // console.log(entry);
        // если элемент является наблюдаемым
        if (entry.isIntersecting) {
          const lazyImg = entry.target;
          // выводим информацию в консоль - проверка работоспособности наблюдателя
          // console.log(lazyImg);
          // меняем фон контейнера
          lazyImg.style.background = "deepskyblue";
          // прекращаем наблюдение
          observer.unobserve(lazyImg);
        }
      });
    }, options);

    observer.observe(gallery);
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

<div class="holder" bind:this={gallery}>
  {#if visible}
    <picture>
      <source srcset="/image/webp/{wwidth}/{src}.webp" type="image/webp" />
      <img
        class="gallery__img"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decoding="async"
        draggable="false"
        src="/image/jpg/{wwidth}/{src}.jpg" />
    </picture>
  {/if}
</div>
