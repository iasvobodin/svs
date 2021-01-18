<script>
    import { progress, photoseries } from "store.js";
    import { onMount } from "svelte";
    export let preloading;
    onMount(() => {
        progress.update((n) => n + 25);
    });
    $: style = `clip-path: inset(0% ${50 - $progress}% 0px 0px);`;
</script>

<style>
    .inset-leave-active {
        animation: 4s inset;
    }

    @keyframes inset {
        0% {
            clip-path: inset(0% 100% 0px 0px);
        }
        100% {
            clip-path: inset(0% 50% 0px 0px);
        }
    }
    .preloader {
        height: 100vh;
        position: absolute;
        top: 0;
        bottom: 0;
    }
    @media (orientation: landscape) {
        .svobodina {
            position: fixed;
            width: min(60vw, 1600px);
            height: calc(min(60vw, 1600px) / 6.83);
            left: 50vw;
            top: 50vh;
            transform: translate(-50%, -200%);
        }
        .svobodina__holder {
            position: absolute;
            top: 0;
            width: inherit;
        }
        /* 1.3882 */
        .photo {
            position: fixed;
            width: min(33.3vw, 889px);
            left: 50vw;
            top: 50vh;
            transform: translate(-52.8%, -64%);
        }
        .logo {
            width: 6vw;
            height: auto;
            position: fixed;
            bottom: 50px;
            right: 50px;
        }
    }
    @media (orientation: portrait) {
        .svobodina {
            height: 90vh;
            top: 50vh;
            position: fixed;
            left: 50vw;
            transform: translate(-220%, -51.45%);
        }
        .photo {
            position: fixed;
            top: 50vh;
            height: 50vh;
            left: 50vw;
            transform: translate(-50%, -52.5%);
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

<!-- {#if $preloading} -->
<div class="preloader">
    <div class="svobodina">
        <div {style} class="svobodina__holder inset-leave-active">
            <picture>
                <!-- <source
                    media="(orientation: portrait)"
                    srcset="image/photoPortrait.svg"
                    type="image/svg+xml" /> -->
                <img src="image/svobodinaFill.svg" alt="ph" />
            </picture>
        </div>
        <picture class="svobodina__holder">
            <!-- <source
                media="(orientation: portrait)"
                srcset="image/photoPortrait.svg"
                type="image/svg+xml" /> -->
            <img src="image/svobodinaPath.svg" alt="ph" />
        </picture>
    </div>
    <picture>
        <!-- <source
            media="(orientation: portrait)"
            srcset="image/photoPortrait.svg"
            type="image/svg+xml" /> -->
        <img class="photo" src="image/photo.svg" alt="ph" />
    </picture>
    <img src="image/logo.svg" class="logo" alt="logo" />
</div>
<!-- {/if} -->
