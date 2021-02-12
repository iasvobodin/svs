<script>
  import { progress } from "store.js";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";
  import anime from "animejs";

  const pr = tweened(0, {
    duration: 11000,
    easing: cubicOut,
  });
  $: style = `inset(0% ${100 - $pr}% 0px 0px)`;
  onMount(() => {
    anime({
      targets: "testholder",
      change: () => {},
    });
    const preloader = document.getElementById("testholder");
    console.log("preloader", preloader.style);
    const change = () => {
      preloader.style.clipPath = style;
      window.requestAnimationFrame(change);
    };
    // preloader.style.clipPath = style; //`clip-path: inset(0% ${100 - $pr}% 0px 0px);`
    pr.set(100);
  });

  // onMount(() => {
  //     // let vh = window.innerHeight * 0.01;
  //     // document.documentElement.style.setProperty("--vh", `${vh}px`);
  //     console.log("onMount preloader");
  // });
</script>

<div class="preloader">
  <div class="svobodina">
    <div id="testholder" class="svobodina__holder">
      <picture>
        <source
          media="(orientation: portrait)"
          srcset="image/svobodinaFillPortrait.svg"
          type="image/svg+xml"
        />
        <img class="preloader__img" src="image/svobodinaFill.svg" alt="ph" />
      </picture>
    </div>
    <picture class="svobodina__holder">
      <source
        media="(orientation: portrait)"
        srcset="image/svobodinaPathPortrait.svg"
        type="image/svg+xml"
      />
      <img class="preloader__img" src="image/svobodinaPath.svg" alt="ph" />
    </picture>
  </div>
  <picture class="photo">
    <source
      media="(orientation: portrait)"
      srcset="image/photoPortrait.svg"
      type="image/svg+xml"
    />
    <img
      width="577.99px"
      height="158.2px"
      class="preloader__img"
      src="image/photo.svg"
      alt="ph"
    />
  </picture>
  <img src="image/logo.svg" class="logo" alt="logo" />
</div>

<style>
  .preloader__img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  /* .inset-leave-active {
        animation: 4s inset;
    } */

  /* @keyframes inset {
        0% {
            clip-path: inset(0% 100% 0px 0px);
        }
        100% {
            clip-path: inset(0% 50% 0px 0px);
        }
    } */
  .preloader {
    height: 100vh;
    height: calc(var(--vh) * 100);
    width: 100%;
    position: absolute;
    /* opacity: 0; */
    display: grid;
    place-items: center;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  @media (orientation: landscape) {
    .svobodina {
      position: absolute;
      width: min(62vw, 1600px);
      height: calc(min(62vw, 1600px) / 6.83);
      transform: translate(0, -150%);
    }
    .svobodina__holder {
      position: absolute;
      height: inherit;
      width: inherit;
    }
    .photo {
      position: absolute;
      height: calc(min(33.3vw, 889px) / 3.65);
      width: min(33.3vw, 889px);
      transform: translate(-2.8%, -14%);
    }
    .logo {
      position: absolute;
      width: 6vw;
      height: auto;
      bottom: 50px;
      right: 50px;
    }
  }
  @media (orientation: portrait) {
    .svobodina {
      height: 90vh;
      height: calc(var(--vh) * 90);
      width: calc(var(--vh) * 90 / 14.91);
      position: absolute;
      transform: translate(-170%, 0%);
    }
    .svobodina__holder {
      position: absolute;
      height: inherit;
      width: inherit;
    }

    .photo {
      position: absolute;
      height: 50vh;
      height: calc(var(--vh) * 50);
      width: calc(var(--vh) * 50 / 8.32);
      transform: translate(0%, -2.5%);
    }
    .logo {
      width: 15vw;
      height: auto;
      position: fixed;
      bottom: 4vh;
      right: 3vh;
    }
  }
</style>
