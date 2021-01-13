<!--<script context="module" ✂prettier:content✂="CiAgICBsZXQgcGxhbmVzID0gW107Cg==" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>-->
<script>
    // import { setContext } from "svelte";

    import Canvas2 from "../../components/canvas2.svelte";
    export let segment;
    segment = !segment;
    // setContext("planes", []);
    // setContext("curtains", {});
</script>

<style>
    .canvas {
        height: 100vh;
    }
</style>

<div class="canvas">
    <Canvas2 />
</div>
<div class="route">
    <slot />
</div>
