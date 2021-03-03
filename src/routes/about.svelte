<script>
  import VimeoComponent from "../components/vimeoComponent.svelte";
  import HellowComponent from "../components/hellowComponent.svelte";
  import Reviews from "../components/reviews.svelte";
  import Price from "../components/price.svelte";
  import Footer from "../components/footer.svelte";
  let play = true;
  let play2 = true;
</script>

<!-- <video
  width="50%"
  height="auto"
  autoplay
  preload="metadata"
  muted="muted"
  playsinline=""
>
  <source src="/image/backstage.mp4" type="video/mp4" />
</video> -->
<HellowComponent />
<VimeoComponent />
<Reviews />
<Price />
<Footer />

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
    font-size: clamp(16px, 26px, 1.5vw);
    line-height: clamp(20px, 36px, 2.5vw);
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
    .subhedline {
      font-family: Comfortaa;
      font-weight: 150;
      font-size: clamp(16px, 34px, 1.8vw);
      line-height: clamp(20px, 36px, 2.5vw);
      color: #ffffff;
    }
    .vimeo__video__placeholder {
      /* margin: auto; */
    }
    .vertical {
      width: var(--video_width);
    }
  }
</style>
