<script>
    import { onMount } from "svelte";

    export let seriya;
    let planeImage;
    onMount(() => {
        planeImage.decode().then(() => {
            console.log(seriya.Id, "onMount");
        });
    });
</script>

<picture class="standart__picture">
    <source
        media="(orientation: portrait)"
        srcset="image/image2/600_{seriya.PortraitFileName}.webp"
        type="image/webp"
    />
    <source
        media="(orientation: portrait)"
        srcset="image/image2/600_{seriya.PortraitFileName}.jpg"
        type="image/jpg"
    />
    <source
        media="(orientation: landscape)"
        srcset="image/image2/600_{seriya.LandscapeFileName}.webp"
        type="image/webp"
    />

    <img
        on:load={() => console.log(seriya.Id, "load")}
        bind:this={planeImage}
        style="opacity:0"
        data-sampler="planeTexture"
        data-id={seriya.Id}
        class="slider__img"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decoding="async"
        draggable="false"
        src="image/image2/600_{seriya.LandscapeFileName}.jpg"
    />
</picture>
