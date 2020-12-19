<script>
	import Nav from "../components/Nav.svelte";
	import Canvas from "../components/canvas.svelte";
	export let segment;
</script>

<style>
	.canvas {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-color: green;
	}
	main {
		position: relative;
		background-color: black;
		box-sizing: border-box;
	}
</style>

<Nav {segment} />
<div class="canvas">
	<Canvas bind:page={segment} />
</div>

<main>
	<slot />
</main>
