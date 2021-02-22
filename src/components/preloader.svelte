<div class="preloader">
  <div class="svobodina">
    <div class="svobodina__holder variable__path">
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
    <img class="preloader__img" src="image/photo.svg" alt="ph" />
  </picture>
  <img src="image/logo.svg" class="logo" alt="logo" />
</div>

<style>
  :root {
    --rpeloader__inset: 100%;
  }

  .preloader__img {
    position: absolute;
    /* height: inherit;
    width: inherit; */
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    /* margin: 1px; */
  }
  .preloader {
    height: 100vh;
    height: calc(var(--vh) * 100);
    width: 100%;
    position: absolute;
    display: grid;
    place-items: center;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    /* opacity: 0; */
  }
  @media (orientation: landscape) {
    .variable__path {
      clip-path: inset(0% var(--rpeloader__inset) 0px 0px);
      transition: clip-path 1s;
    }
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
      height: calc(min(33.3vw, 889px) / 3.65353982);
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
    .variable__path {
      clip-path: inset(var(--rpeloader__inset) 0% 0px 0px);
      transition: clip-path 1s;
    }
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
