<script>
    import Canvas from "../../components/canvas.svelte";
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
    <Canvas bind:page={segment} />
</div>
<slot />
