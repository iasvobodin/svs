<script>
  import { onMount } from "svelte";
  import anime from "animejs";
  let isVisible = true;
  let pulse = null;

  function hidebutton(visible) {
    if (visible) {
      pulse.play();
    } else {
      pulse.pause();
    }
  }
  function animateButton() {
    pulse = anime({
      targets: ".button",
      loop: true,
      scale: [0.85, 1],
      duration: 1500,
      easing: "linear",
      direction: "alternate",
    });
    anime({
      targets: ".button",
      opacity: [0, 1],
      duration: 1000,
      easing: "linear",
      delay: 700,
    });
  }
  function scrollDown() {
    const currentScroll = { value: window.pageYOffset };
    anime({
      targets: currentScroll,
      value: window.innerHeight,
      duration: 400,
      easing: "easeOutSine",
      update: () => {
        window.scrollTo(0, currentScroll.value);
      },
    });
  }

  onMount(() => {
    animateButton();
  });
</script>

<div>
  <svg
    on:click={scrollDown}
    class="button"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 490.4 490.4"
    xml:space="preserve"
  >
    <!-- :style="{ fill: `${$store.state.seriyaAll.Cover.Params.Colors[5]}` }" -->
    <g>
      <path
        d="M490.4,245.2C490.4,110,380.4,0,245.2,0S0,110,0,245.2s110,245.2,245.2,245.2S490.4,380.4,490.4,245.2z M24.5,245.2    c0-121.7,99-220.7,220.7-220.7s220.7,99,220.7,220.7s-99,220.7-220.7,220.7S24.5,366.9,24.5,245.2z"
      />
      <path
        d="M253.9,360.4l68.9-68.9c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-48,48V138.7c0-6.8-5.5-12.3-12.3-12.3    s-12.3,5.5-12.3,12.3v183.4l-48-48c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l68.9,68.9c2.4,2.4,5.5,3.6,8.7,3.6    S251.5,362.8,253.9,360.4z"
      />
    </g>
  </svg>
</div>

<style lang="css" scoped>
  .button {
    opacity: 0;
    width: 60px;
    height: 60px;
    fill: white;
    position: absolute;
    top: calc(var(--vh, 1vh) * 100 - 70px);
    left: calc(50vw - 30px);
    cursor: pointer;
  }
</style>
