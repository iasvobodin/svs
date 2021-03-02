<script>
  import Videoplaybutton from "./videoPlayButton.svelte";
  let play = true;
  let play2 = true;
</script>

<div class="video">
  <div class="first__column">
    <h2 class="video__title hedline">О себе</h2>
    {#if play2}
      <div class="video__placeholder">
        <div
          on:click={() => (play2 = !play2)}
          class="video__placeholder__button"
        >
          <Videoplaybutton />
        </div>
        <img class="video__placeholder__image" src="/image/about.webp" alt="" />
      </div>
    {:else}
      <iframe
        title="about"
        src="https://player.vimeo.com/video/495014995?autoplay=1&loop=1&title=0&byline=0&portrait=0"
        class="video__placeholder__iframe"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
      />
    {/if}
  </div>
  <p class="video__decription subhedline">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic modi, animi
    atque debitis fugit delectus iste eligendi excepturi nam ea.
  </p>
</div>
<div class="video__backstage">
  <p class="video__decription subhedline">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic modi, animi
    atque debitis fugit delectus iste eligendi excepturi nam ea.
  </p>
  <div style="" class="first__column">
    <h2 class="video__title hedline">Backstage</h2>
    {#if play}
      <div class="video__placeholder">
        <div on:click={() => (play = !play)} class="video__placeholder__button">
          <Videoplaybutton />
        </div>
        <img
          class="video__placeholder__image"
          src="/image/backstage.jpg"
          alt=""
        />
      </div>
    {:else}
      <iframe
        title="backstage"
        src="https://player.vimeo.com/video/477028282?autoplay=1&loop=1&title=0&byline=0&portrait=0"
        class="video__placeholder__iframe"
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
      />
    {/if}
  </div>
</div>

<style>
  :root {
    --video_width: min(90vw, 700px);
    --video_translate: 10vw;
  }
  .video__title {
    z-index: 2;
    transform: translate(-3vw, 40%);
  }
  .hedline {
    font-family: Cormorant Infant;
    font-size: max(36px, 5.8vw);
    line-height: max(36px, 5.8vw);
    font-weight: 300;
    color: #ffffff;
    margin: 1vh;
  }
  .video__placeholder__iframe {
    grid-area: 2/1/3/2;
    height: calc(var(--video_width) / 1.77);
    width: var(--video_width);
  }
  .video__backstage {
    position: relative;
    justify-content: center;
    display: grid;
    justify-content: end;
    grid-template-columns: minmax(400px, 50ch) minmax(200px, 700px);
    margin-right: 7vw;
    column-gap: 8vw;
  }
  .video {
    position: relative;
    justify-content: center;
    display: grid;
    justify-content: start;
    grid-template-columns: minmax(200px, 700px) minmax(400px, 50ch);
    margin-left: 7vw;
    column-gap: 8vw;
  }

  .video__placeholder {
    grid-area: 2/1/3/2;
    border-radius: 5px;
    overflow: hidden;
    height: calc(var(--video_width) / 1.77);
    width: var(--video_width);
  }
  .video__decription {
    place-self: center;
    padding-left: 2vw;
    padding-right: 2vw;
    margin-top: max(36px, 5.8vw);
    margin-bottom: 0;
  }

  .subhedline {
    font-family: Comfortaa;
    font-weight: 150;
    font-size: clamp(16px, 26px, 1.5vw);
    line-height: clamp(20px, 36px, 2.5vw);
    color: #ffffff;
  }
  .video__placeholder__button {
    cursor: pointer;
    position: absolute;
    width: 64px;
    padding: 2px;
    margin: 2vw;
    /* align-self: center;
    justify-self: center; */
    bottom: 0px;
  }
  .video__placeholder__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 1250px) {
    :root {
      --video_width: min(90vw, 550px);
    }
    .video {
      margin: 0;
      margin-right: var(--video_translate);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
    .video__placeholder__button {
      position: absolute;
      width: min(64px, 5.5vw);
      padding: 2px;
      margin: 2vw;
      /* align-self: center;
    justify-self: center; */
      bottom: 0px;
    }
    .video__backstage {
      margin: 0;
      margin-left: var(--video_translate);
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-around;
      align-items: center;
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
    .video__title {
      position: relative;
      width: var(--video_width);
      /* z-index: 2; */
    }

    .video__placeholder {
      position: relative;
      margin: auto;
      /* height: calc(min(90vw, 600px) / 1.77);
      width: min(90vw, 600px); */
    }
  }
  @media (max-width: 650px) {
    :root {
      --video_translate: 0vw;
    }
  }
</style>
