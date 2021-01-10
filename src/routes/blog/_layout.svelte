<!--<script context="module" ✂prettier:content✂="CiAgICBsZXQgcGxhbmVzID0gW107Cg==" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>-->
<script>
    import { setContext } from "svelte";

    import Canvas2 from "../../components/canvas2.svelte";
    export let segment;
    setContext("planes", []);
    setContext("curtains", {});
</script>

<style>
    .canvas {
        height: 100vh;
    }
</style>

<div class="canvas">
    <Canvas2 bind:pageslug={segment} />
</div>
<div class="route">
    <slot />
</div>
