<script>
  import { onMount } from "svelte";
  import anime from "animejs/lib/anime.es.js";
  let rot;
  onMount(async () => {
    const locomotiveModule = await import("locomotive-scroll");

    rot = anime({
      targets: ".test",
      translateX: 1000,
      rotate: 180,
      easing: "linear",
      autoplay: false,
    });

    scroll = new locomotiveModule.default({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      // smoothMobile: false,
    });

    scroll.on("scroll", (func) => {
      // Get all current elements : func.currentElements
      if (typeof func.currentElements["hey"] === "object") {
        let progress = func.currentElements["hey"].progress;
        // console.log(progress);
        rot.seek(progress * 1000);
        // ouput log example: 0.34
        // gsap example : myGsapAnimation.progress(progress);
      }
    });
  });
</script>

<div data-scroll-container>
  <div data-scroll-section>
    <h1 data-scroll>Hey</h1>
    <p data-scroll>👋</p>
  </div>
  <div data-scroll-section>
    <h2 data-scroll-id="hey" data-scroll data-scroll-speed="1" class="test">
      What's up?
    </h2>
    <p data-scroll data-scroll-speed="2">😬</p>
  </div>
</div>

<style>
  [data-scroll-section] {
    height: 200vh;
    /* background-color: black; */
  }
</style>
