<script context="module">
  export function preload() {
    return this.fetch(`/db/Photoseries.json`)
      .then((r) => r.json())
      .then((photoseries) => {
        return { photoseries };
      });
  }
</script>

<script>
  import photoseries from "../../../static/db/Photoseries.json";
  // export let photoseries;
</script>

<style>
  :root {
    --margin__wrapper: calc((100vh - var(--plane__height)) / 2);
    --title__height: calc(14px + 4vw);
    --translationSlide: 0;
    --plane__height: 52vh;
    --plane__width: calc(var(--plane__height) * 1.5);
    --plane__margin: 5vw;
    --plane__shift: calc(
      50vw - ((var(--plane__width) + var(--plane__margin) * 2) * 3.5)
    );
  }
  @media (orientation: landscape) {
    .wrapper {
      justify-content: center;
      width: 100%;
      height: 100vh;
      /* left: var(--plane__shift);
    top: var(--margin__wrapper); */
      display: flex;
      position: absolute;
    }
    .plane {
      align-self: center;
      /* top: 0; */
      /* left: 0; */
      position: absolute;
      box-sizing: border-box;
      height: var(--plane__height);
      width: var(--plane__width);
      /* margin: auto var(--plane__margin); */
    }
  }
  @media (orientation: portrait) {
    :root {
      --plane__height: 65vh;
      --plane__width: calc(var(--plane__height) * 0.66);
    }
    .wrapper {
      justify-content: center;
      width: 100%;
      height: 100vh;
      /* left: var(--plane__shift);
    top: var(--margin__wrapper); */
      display: flex;
      position: absolute;
    }
    .plane {
      align-self: center;
      /* top: 0; */
      /* left: 0; */
      position: absolute;
      box-sizing: border-box;
      height: var(--plane__height);
      width: var(--plane__width);
      /* margin: auto var(--plane__margin); */
    }
  }
  .slider__img {
    /* display: none; */
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>

<div class="wrapper">
  <div
    data-id="index"
    data-route="seriya.Route"
    data-color="[seriya.ColorVector]"
    class="plane">
    {#each photoseries as seriya}
      <picture class="standart__picture">
        <source
          media="(orientation: portrait)"
          srcset="/image/webp/720/{seriya.Portrait}.webp"
          type="image/webp" />
        <source
          media="(orientation: landscape)"
          srcset="/image/webp/720/{seriya.FileName}.webp"
          type="image/webp" />
        <a href="blog/{seriya.Route}">
          <img
            ref="planePicture"
            class="slider__img"
            alt="SvobodinaPhoto"
            crossorigin="anonimous"
            decoding="async"
            draggable="false"
            src="/image/jpg/720/{seriya.FileName}.jpg" />
        </a>
      </picture>
    {/each}
  </div>
</div>
