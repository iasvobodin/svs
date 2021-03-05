<section class="hellow">
  <h1 class="hellow__hedline">
    Привет,<br />
    меня зовут Настя.
  </h1>
  <div class="hellow__ava">
    <!-- <video controls autoplay preload="metadata" muted="muted" playsinline="">
      <source src="/backstage.mp4" type="video/mp4" />
    </video> -->
    <img src="image/ava.jpg" alt="" />
  </div>
  <div class="description__social">
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
  </div>
</section>

<style>
  .hellow {
    height: 70vh;
    display: grid;
    /* width: 95vw; */
    padding-top: 15vh;
    padding-bottom: 15vh;
    grid-template-columns: max(350px, 45vw) minmax(250px, 40vw);
    justify-content: center;
  }
  .hellow__ava {
    height: 70vh;
    /* max-width: 80vw; */
    border-radius: 5px;
    overflow: hidden;
    /* grid-area: 1/1/3/2; */
  }

  .hellow__hedline {
    grid-area: 1/2/2/3;
    position: relative;
    padding: 5px;
    text-align: start;
    place-self: start;
    margin: 0;
    font-family: Cormorant Infant;
    font-size: max(36px, 4.8vw);
    line-height: max(40px, 5.2vw);
    font-weight: 300;
    color: #ffffff;
    transform: translateX(-5vw);
  }
  .description__social {
    height: 40vh;
    grid-area: 1/2/2/3;
    position: relative;
    place-self: end;
    display: flex;
  }
  .subhedline {
    font-family: Comfortaa;
    font-weight: 150;
    font-size: clamp(16px, 26px, 1.5vw);
    line-height: clamp(20px, 36px, 2.5vw);
    color: #ffffff;
  }
  .hellow__subhedline {
    width: 90%;
    margin: 0;
    place-self: center;
    padding-left: 3vw;
    /* grid-area: 2/3/4/3; */
    /* transform: translateX(-50%); */
    /* margin-bottom: 40px; */
  }

  .social {
    width: 10%;
    height: 100%;
    align-content: center;
    /* grid-area: 2/3/3/4; */
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
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 1200px) {
    .hellow__ava {
      height: 50vh;
      width: min(700px, 80vw);
      border-radius: 5px;
      overflow: hidden;

      /* grid-area: 1/1/3/2; */
    }
    .description__social {
      height: auto;
      margin: auto;
      margin-top: 5vh;
      width: min(700px, 80vw);
      display: flex;
      justify-content: center;
    }
    .hellow {
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 0px;
      padding-top: 0px;
      /* width: 95vw; */
      /* padding-top: 15vh;
    padding-bottom: 15vh;
    grid-template-columns: minmax(350px, 700px) minmax(250px, 40vw); */
    }
    .hellow__hedline {
      transform: translateX(0);
      width: min(700px, 80vw);
      margin: auto;
    }
    .subhedline {
      font-family: Comfortaa;
      font-weight: 150;
      font-size: clamp(16px, 34px, 1.8vw);
      line-height: clamp(20px, 36px, 2.5vw);
      color: #ffffff;
    }
  }
</style>
