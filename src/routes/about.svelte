<script>
  // import reviews from '~/components/reviews.vue'
  let play = true;
  let play2 = true;
</script>

<main class="main">
  <section class="hellow">
    <div class="hellow__ava">
      <img src="image/displacement2.jpg" alt="" />
    </div>
    <h1 class="hellow__hedline">
      Привет,<br />
      меня зовут Настя.
    </h1>
    <h2 class="hellow__subhedline">
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
      <!-- <a class="social__icon" href=""
          ><img src="icons/telegram.svg" alt="vk"
        /></a>
        <a class="social__icon" href=""
          ><img src="icons/whatsapp.svg" alt="vk"
        /></a>
        <a class="social__icon" href=""
          ><img src="icons/viber.svg" alt="vk"
        /></a>
        <a class="social__icon" href=""
          ><img src="icons/mail.svg" alt="vk"
        /></a> -->
    </div>
  </section>
</main>

<style lang="css" scoped>
  .hellow {
    height: 70vh;
    display: grid;
    width: 95vw;
    padding-top: 15vh;
    padding-bottom: 15vh;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15vh;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .hellow__ava {
    /* background-attachment: fixed, scroll;
  background-size: cover;
  background-image: url(image/ava.jpg);
  background-position: center; */
    /* background-repeat: space; */

    height: 70vh;
    min-width: 350px;
    /* width: 40vw; */
    border-radius: 5px;
    overflow: hidden;
    grid-area: 1/1/3/2;
  }
  .hellow__hedline {
    grid-area: 1/2/2/4;
    /* place-self: center; */
    justify-self: start;
    align-self: center;
    font-family: Cormorant Infant;
    /* height: 100%; */
    padding: 5px;
    margin-left: -3vw;
    text-align: start;
    font-size: max(36px, 4.8vw);
    line-height: max(40px, 5.2vw);
    font-weight: 300;
    color: #ffffff;
  }
  .hellow__subhedline {
    width: 140%;
    font-family: Comfortaa;
    font-weight: 150;
    font-size: 26px;
    line-height: 36px;
    color: #ffffff;
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
  .hedline {
    font-family: Roboto Slab;
    padding: 5px;
    margin: 0;
    text-align: center;
    font-size: calc(16px + 3vw);
    line-height: calc(16px + 3.2vw);
    font-weight: 120;
    color: #03a9f4;
  }
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
    border-radius: 5px;
    overflow: hidden;
  }
  svg {
    cursor: pointer;
    position: absolute;
    width: 15%;
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
