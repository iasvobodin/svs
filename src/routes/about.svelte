<style>
  @media (orientation: landscape) {
    .svobodina {
      /* opacity: 0; */
      position: fixed;
      width: min(60vw, 1600px);
      left: 50vw;
      top: 50vh;
      transform: translate(-50%, -200%);
    }
    /* 1.3882 */
    .photo {
      /* opacity: 0; */
      position: fixed;
      width: min(33.3vw, 889px);
      left: 50vw;
      top: 50vh;
      transform: translate(-52.8%, -64%);
    }
    .logo {
      /* opacity: 0; */
      width: 6vw;
      height: auto;
      position: fixed;
      bottom: 50px;
      right: 50px;
    }
  }
  @media (orientation: portrait) {
    .svobodina {
      /* opacity: 0; */
      /* width: min(7vw, 100px); */
      height: 90vh;
      /* margin: auto; */
      top: 50vh;
      position: fixed;
      left: 50vw;
      transform: translate(-220%, -51.45%);
    }
    .photo {
      /* opacity: 0; */
      position: fixed;
      top: 50vh;
      height: 50vh;
      left: 50vw;
      transform: translate(-50%, -52.5%);
      /* right: calc(
    50vw + max(11vw, 100px) / 1.3882 / 2 + max(11vw, 100px) / 1.3882 / 10
  ); */
    }
    .logo {
      /* opacity: 0; */
      width: 15vw;
      height: auto;
      position: fixed;
      bottom: 4vh;
      right: 3vh;
    }
  }
</style>

<picture>
  <source
    media="(orientation: portrait)"
    srcset="image/svobodinaPortrait.svg"
    type="image/svg+xml" />
  <source
    media="(orientation: landscape)"
    srcset="image/svobodina.svg"
    type="image/svg+xml" />
  <img src="image/svobodina.svg" class="svobodina" alt="svobodina" />
</picture>
<picture>
  <source
    media="(orientation: portrait)"
    srcset="image/photoPortrait.svg"
    type="image/svg+xml" />
  <source
    media="(orientation: landscape)"
    srcset="image/photo.svg"
    type="image/svg+xml" />
  <img class="photo" src="image/photo.svg" alt="ph" />
</picture>
<img src="image/logo.svg" class="logo" alt="logo" />
