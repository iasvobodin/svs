<script>
    import Canvas2 from "../../components/canvas2.svelte";
    export let segment;
</script>

<style>
    /* .canvas {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: green;
    } */
</style>

<div class="canvas">
    <Canvas2 bind:page={segment} />
</div>
<slot />
