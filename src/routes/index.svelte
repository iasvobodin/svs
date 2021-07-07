<section class="hedlines">
  <div class="svobodina">
    <img class="preloader__img" src="image/svobodinaFill.svg" alt="ph" />
  </div>
  <div class="photo">
    <img
      width="577.99px"
      height="158.2px"
      class="preloader__img"
      src="image/photo.svg"
      alt="ph"
    />
  </div>
  <!-- <h1>Свадебный<br />фотограф</h1>
   -->
  <div class="backstage">
    <video
      class="preloader__img"
      playsinline
      loop
      muted
      src="image/backstage.webm"
    />
  </div>
</section>
<a href="/photoseries">Photoseries</a>
<a href="/photoday">photoday</a>
<a href="/ttt">ttt</a>

<style>
  :root {
    --height__svg__hedline: 6vh;
  }
  .backstage {
    grid-area: 8/8/11/11;
    overflow: hidden;
  }
  .hedlines {
    position: relative;
    overscroll-behavior: none;
    display: grid;
    width: 100%;
    height: 100vh;
    /* transform: scale(0.5) translate(-100% -100%); */
    background: url(image/ggr.svg) left top / 100% 100vh no-repeat;
    grid-template-rows: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 2fr 4fr 2.66fr 5.33fr 5.33fr 4.33fr 2.83fr 3.5fr 3.5fr 2.83fr 4.33fr 5.33fr 5.33fr 2.66fr 4fr 2fr 1fr 1fr;
  }
  h1 {
    font-family: Cormorant Infant, sans-serif;
    font-weight: 300;
    color: rgb(255, 255, 255);
    margin: 0;
    font-size: clamp(18px, 3vw + 20px, 120px);
    line-height: clamp(20px, 3.5vw + 22px, 130px);
  }
  .svobodina {
    place-self: center;
    /* position: absolute; */
    overflow: hidden;
    grid-area: 7/11/8/15;
    /* width: min(62vw, 1600px);
        height: calc(min(62vw, 1600px) / 6.83); */
    /* transform: translate(0, -150%); */
    /* height: var(--height__svg__hedline);
        width: calc(var(--height__svg__hedline) * 6.83); */
  }
  .photo {
    /* position: absolute; */
    grid-area: 8/14/9/15;
    place-self: center;
    overflow: hidden;
    /* height: calc(min(33.3vw, 889px) / 3.65353982);
        width: min(33.3vw, 889px); */
    /* transform: translate(-2.8%, -14%); */
    /* height: var(--height__svg__hedline);
        width: calc(var(--height__svg__hedline) * 3.65353982); */
  }
  .preloader__img {
    height: 100%;
    /* width: 100%; */
    object-fit: cover;
    object-position: center;
  }
</style>
