<script>
  import { onMount } from "svelte";
  import anime from "animejs";
  let ava, video;
  function getScrollPercent() {
    var h = document.documentElement,
      b = document.body,
      st = "scrollTop",
      sh = "scrollHeight";
    return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
  }
  onMount(() => {
    let tl = anime.timeline({
      autoplay: false,
    });
    let persentage = 0;
    const { width, height, left, top } = ava.getBoundingClientRect();
    let current = 0;
    let scaleAvaX = window.innerWidth / width;
    let scaleAvaY = window.innerHeight / height;

    const raf = () => {
      //   video.currentTime = current;
      current += (persentage / (100 / 65) - current) * 0.1;
      video.currentTime = current;
      console.log(current);
      //   setInterval(() => {}, 33, 3);
      requestAnimationFrame(raf);
    };
    raf();
    tl.add({
      targets: ".hellow__ava",
      //   translateX: "50%",
      //   update: (anim) => {
      //     currentTime += (persentage - currentTime) * 0.05;
      //     console.log(anim.progress);
      //     video.currentTime = currentTime;
      //   },
      scaleX: scaleAvaX,
      scaleY: scaleAvaY,
      easing: "linear",
    });

    // setInterval(() => {
    //   current += (persentage / (100 / 65) - current) * 0.1;
    //   video.currentTime = current;
    // }, 41.16);

    window.addEventListener("scroll", () => {
      persentage = getScrollPercent();

      //   tl.seek(tl.duration * (persentage * 0.01));
      //   video.currentTime = persentage / 41.6;
    });
  });
</script>

<div class="holder">
  <section class="hellow">
    <!-- <h1 class="hellow__hedline">
      Привет,<br />
      меня зовут Настя.
    </h1> -->
    <div bind:this={ava} class="hellow__ava">
      <video bind:this={video} preload autobuffer muted="muted" playsinline="">
        <source src="/image/jpg/backstage.mp4" type="video/mp4" />
      </video>
      <!-- <img src="image/ava.jpg" alt="" /> -->
    </div>
    <div class="description__social" />
  </section>
</div>

<style>
  .holder {
    height: 65000px;
  }
  .hellow {
    /* height: 50vh; */
    /* display: grid; */
    position: sticky;
    top: 0px;
    /* width: 95vw; */
    /* padding-top: 15vh; */
    /* padding-bottom: 15vh; */
    grid-template-columns: max(350px, 100vw) minmax(250px, 40vw);
    justify-content: center;
  }
  .hellow__ava {
    height: 100vh;
    width: 100%;
    /* max-width: 80vw; */
    border-radius: 5px;
    overflow: hidden;
    /* grid-area: 1/1/3/2; */
  }

  .description__social {
    height: 40vh;
    grid-area: 1/2/2/3;
    position: relative;
    place-self: end;
    display: flex;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
