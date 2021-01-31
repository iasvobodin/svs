<script>
    import { progress } from "store.js";
    import { onMount } from "svelte";
    $: style = `clip-path: inset(0% ${100 - $progress}% 0px 0px);`;
    // onMount(() => {
    //     // let vh = window.innerHeight * 0.01;
    //     // document.documentElement.style.setProperty("--vh", `${vh}px`);
    //     console.log("onMount preloader");
    // });
</script>

<div class="preloader">
    <div class="svobodina">
        <div {style} class="svobodina__holder">
            <picture>
                <source
                    media="(orientation: portrait)"
                    srcset="image/svobodinaFillPortrait.svg"
                    type="image/svg+xml"
                />
                <img src="image/svobodinaFill.svg" alt="ph" />
            </picture>
        </div>
        <picture class="svobodina__holder">
            <source
                media="(orientation: portrait)"
                srcset="image/svobodinaPathPortrait.svg"
                type="image/svg+xml"
            />
            <img src="image/svobodinaPath.svg" alt="ph" />
        </picture>
    </div>
    <picture>
        <source
            media="(orientation: portrait)"
            srcset="image/photoPortrait.svg"
            type="image/svg+xml"
        />
        <img class="photo" src="image/photo.svg" alt="ph" />
    </picture>
    <img src="image/logo.svg" class="logo" alt="logo" />
</div>

<style>
    /* .inset-leave-active {
        animation: 4s inset;
    } */

    /* @keyframes inset {
        0% {
            clip-path: inset(0% 100% 0px 0px);
        }
        100% {
            clip-path: inset(0% 50% 0px 0px);
        }
    } */
    .preloader {
        height: 100vh;
        height: calc(var(--vh) * 100);
        width: 100vw;
        position: absolute;
        /* top: 0;
        bottom: 0; */
        display: grid;
        place-items: center;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
    }
    @media (orientation: landscape) {
        .svobodina {
            position: absolute;
            /* grid-area: 1/1/2/2; */
            /* position: fixed; */
            width: min(62vw, 1600px);
            height: calc(min(62vw, 1600px) / 6.83);
            /* left: 50vw; */
            /* top: 50vh; */
            /* top: calc(var(--vh) * 50); */
            transform: translate(0, -150%);
        }
        .svobodina__holder {
            position: absolute;
            /* top: 0; */
            width: inherit;
        }
        /* 1.3882 */
        .photo {
            position: absolute;
            /* grid-area: 1/1/2/2; */
            /* position: fixed; */
            width: min(33.3vw, 889px);
            /* left: 50vw; */
            /* top: 50vh; */
            /* top: calc(var(--vh) * 50); */
            transform: translate(-52.8%, -64%);
        }
        .logo {
            position: absolute;
            /* grid-area: 1/1/2/2; */
            width: 6vw;
            height: auto;
            /* position: fixed; */
            bottom: 50px;
            right: 50px;
        }
    }
    @media (orientation: portrait) {
        .svobodina {
            height: 90vh;
            height: calc(var(--vh) * 90);
            top: 50vh;
            top: calc(var(--vh) * 50);
            width: 6vh;
            width: calc(var(--vh) * 6);
            position: fixed;
            left: 50vw;
            transform: translate(-220%, -47.45%);
        }
        .svobodina__holder {
            position: absolute;
            height: inherit;
            width: auto;
        }
        .svobodina__holder > picture {
            width: auto;
        }
        .photo {
            position: fixed;
            top: 50vh;
            top: calc(var(--vh) * 50);
            height: 50vh;
            height: calc(var(--vh) * 50);
            left: 50vw;
            transform: translate(-50%, -52.5%);
        }
        .logo {
            width: 15vw;
            height: auto;
            position: fixed;
            bottom: 4vh;
            /* bottom: calc(var(--vh, 1vh) * 4); */
            right: 3vh;
            /* right: calc(var(--vh, 1vh) * 3); */
        }
    }
</style>
