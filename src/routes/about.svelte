<style>
  .svobodina__holder {
    position: absolute;
    top: 0;
    width: inherit;
  }
  .svobodina {
    position: fixed;
    width: min(60vw, 1600px);
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -200%);
  }
</style>

<div class="svobodina">
  <div style="clip-path: inset(0% 50% 0px 0px);" class="svobodina__holder">
    <picture>
      <source
        media="(orientation: portrait)"
        srcset="image/photoPortrait.svg"
        type="image/svg+xml" />
      <img src="image/svobodinaFill.svg" alt="ph" />
    </picture>
  </div>
  <picture>
    <source
      media="(orientation: portrait)"
      srcset="image/photoPortrait.svg"
      type="image/svg+xml" />
    <img src="image/svobodinaPath.svg" alt="ph" />
  </picture>
</div>
