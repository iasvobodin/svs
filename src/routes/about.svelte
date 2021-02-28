<script>
  // import reviews from '~/components/reviews.vue'
  let play = true;
  let play2 = true;
</script>

<main class="main">
  <section class="hellow">
    <div class="hellow__ava">
      <img src="image/ava.jpg" alt="" />
    </div>
    <h1 class="hellow__hedline">
      Привет,<br />
      меня зовут Настя.
    </h1>
    <h2 class="hellow__subhedline subhedline">
      <!-- eslint-disable-next-line prettier/prettier -->
      &nbsp;&nbsp;&nbsp;Я свадебный фотограф, живу и работаю в основном в Челябинске,
      но сниму свадьбу в любом месте кроме всратой деревни<br />
      PS. Знаю английский как родной!
    </h2>
    <div class="social">
      <a
        target="_blank"
        class="social__icon"
        href="https://vk.com/svobodinaphoto"
        ><img src="icons/vk.svg" alt="vk" /></a
      >
      <a
        target="_blank"
        class="social__icon"
        href="https://www.facebook.com/svobodinaphoto"
        ><img src="icons/facebook.svg" alt="facebook" /></a
      >
      <a
        target="_blank"
        class="social__icon"
        href="https://www.instagram.com/svobodinaphoto/"
        ><img src="icons/instagram.svg" alt="instagram" /></a
      >
    </div>
  </section>
  <section class="backstage">
    <div class="backstage__video">
      <h2 class="vertical hedline">О себе</h2>
      {#if play2}
        <div class="vimeo__video__placeholder">
          <svg
            on:click={() => (play2 = !play2)}
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 60 60"
            style="enable-background: new 0 0 60 60"
            xml:space="preserve"
          >
            <g>
              <path
                d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
              />
              <path
                d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
              />
            </g>
          </svg>
          <img src="/image/about.webp" alt="" />
        </div>
      {:else}
        <iframe
          title="backstage"
          src="https://player.vimeo.com/video/495014995?autoplay=1&loop=1&title=0&byline=0&portrait=0"
          class="backstage_iframe"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        />
      {/if}
      <p class="video__decription subhedline">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic modi,
        animi atque debitis fugit delectus iste eligendi excepturi nam ea.
      </p>
    </div>
    <div class="backstage__video">
      <h2 class="vertical hedline">Backstage</h2>

      {#if play}
        <div class="vimeo__video__placeholder">
          <svg
            on:click={() => (play = !play)}
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 60 60"
            style="enable-background: new 0 0 60 60"
            xml:space="preserve"
          >
            <g>
              <path
                d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
              />
              <path
                d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
              />
            </g>
          </svg>
          <img src="/image/backstage.png" alt="" />
        </div>
      {:else}
        <iframe
          title="backstage"
          src="https://player.vimeo.com/video/477028282?autoplay=1&loop=1&title=0&byline=0&portrait=0"
          class="backstage_iframe"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        />
      {/if}
      <p class="video__decription subhedline">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic modi,
        animi atque debitis fugit delectus iste eligendi excepturi nam ea.
      </p>
    </div>
  </section>
</main>

<style>
  :root {
    --video_width: min(90vw, 700px);
  }
  .vertical {
    z-index: 2;
    /* left: 0px;
    top: 0px;
    position: absolute; */
    transform: translate(-3vw, 30%);
  }
  .hedline {
    font-family: Cormorant Infant;
    font-size: max(36px, 5.8vw);
    line-height: max(40px, 6.2vw);
    font-weight: 300;
    color: #ffffff;
    margin: 1vh;
  }
  .backstage {
    margin-bottom: 10vh;
  }
  .backstage_iframe {
    grid-area: 2/1/3/2;
    /* position: absolute;
    top: 0;
    right: 0; */
    height: calc(var(--video_width) / 1.77);
    width: var(--video_width);
  }
  .backstage__video {
    position: relative;
    justify-content: center;
    display: grid;
    justify-content: center;
    grid-template-columns: minmax(200px, 700px) minmax(40ch, 50ch);
    grid-template-rows: max(40px, 6.2vw) calc(var(--video_width) / 1.77);
    /* margin-left: 5vw; */
    /* margin-top: 15vh; */
  }
  @media (max-width: 1200px) {
    .backstage__video {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      /* grid-template-columns: 1fr;
      grid-template-rows: auto auto auto; */
      /* margin-left: 5vw; */
      /* margin-top: 15vh; */
    }
    .video__decription {
      padding: 2vh;
      margin: 0;
      max-width: var(--video_width);
    }
    .vimeo__video__placeholder {
      /* margin: auto; */
    }
    .vertical {
      width: var(--video_width);
    }
  }
  .vimeo__video__placeholder {
    grid-area: 2/1/3/2;
    border-radius: 5px;
    overflow: hidden;
    height: calc(var(--video_width) / 1.77);
    width: var(--video_width);
    /* width: 100%;
    height: 100%; */
  }
  .video__decription {
    grid-area: 2/2/3/3;
    place-self: center;
    padding-left: 2vw;
    padding-right: 2vw;
    margin: 0;
  }
  .hellow {
    height: 70vh;
    display: grid;
    width: 95vw;
    padding-top: 15vh;
    padding-bottom: 15vh;
    margin-left: auto;
    margin-right: auto;
    /* margin-bottom: 15vh; */
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .hellow__ava {
    height: 70vh;
    min-width: 350px;
    border-radius: 5px;
    overflow: hidden;
    grid-area: 1/1/3/2;
  }
  .hellow__hedline {
    grid-area: 1/2/2/4;
    /* place-self: center; */
    justify-self: start;
    align-self: center;
    /* height: 100%; */
    padding: 5px;
    margin-left: -3vw;
    text-align: start;
    font-family: Cormorant Infant;
    font-size: max(36px, 4.8vw);
    line-height: max(40px, 5.2vw);
    font-weight: 300;
    color: #ffffff;
  }

  .subhedline {
    font-family: Comfortaa;
    font-weight: 150;
    font-size: clamp(16px, 32px, 1.8vw);
    line-height: clamp(18px, 40px, 2.6vw);
    color: #ffffff;
  }
  .hellow__subhedline {
    width: 140%;

    place-self: center;
    grid-area: 2/3/4/3;
    transform: translateX(-50%);
    /* margin-bottom: 40px; */
  }

  .social {
    height: 100%;
    align-content: center;
    grid-area: 2/3/3/4;
    display: grid;
    grid-auto-flow: row;
    place-self: end stretch;
  }
  .social__icon {
    /* margin: 12px; */
    justify-self: end;
    padding: 13px;
    align-self: center;
    width: 25px;
    height: 25px;
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
    transition: transform 0.5s;
  }
  .social__icon:hover {
    -webkit-filter: grayscale(0);
    filter: grayscale(0);
    transform: translateX(-20%);
  }
  /* .hedline {
    font-family: Roboto Slab;
    padding: 5px;
    margin: 0;
    text-align: center;
    font-size: calc(16px + 3vw);
    line-height: calc(16px + 3.2vw);
    font-weight: 120;
    color: #03a9f4;
  } */
  .main {
    position: relative;
  }
  .vimeo__video {
    position: relative;
    height: calc(60vw / 1.77);
    max-width: 60vw;
    display: grid;
  }
  .vimeo__video__placeholder {
  }
  svg {
    cursor: pointer;
    position: absolute;
    width: 60px;
    margin: 2vw;
    align-self: center;
    justify-self: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
