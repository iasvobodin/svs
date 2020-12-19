<script context="module">
    export const curtains = {};
</script>

<script>
    import { setContext } from "svelte";
    import { Curtains, Plane, Vec3 } from "curtainsjs/src/index.mjs";
    import { onMount } from "svelte";
    import vertex from "./../../assets/photoday.vert";
    import fragment from "./../../assets/photoday.frag";
    // let current = "module";
    let canvas;
    setContext("curtains", curtains.cc);
    function initCurtains() {
        curtains.cc = new Curtains({
            container: canvas,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
        });
    }
    onMount(() => {
        initCurtains();
    });
</script>

<h1>Настройки</h1>
<div bind:this={canvas} class="webgl" />

<slot />
