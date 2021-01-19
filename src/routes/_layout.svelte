<script>
	import Canvas2 from "../components/canvas2.svelte";
	import Preloader from "../components/preloader.svelte";
	import { stores } from "@sapper/app";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	// onMount(() => {
	// 	console.log("layout is mounted");
	// });
	// const { preloading } = stores();
	// $: console.log($preloading, "$preloading");
	export let segment;
	segment = !segment;
</script>

<!-- {#if !$preloading} -->
<main transition:fade>
	<Preloader />
	<div class="canvas">
		<Canvas2 />
	</div>
	<!-- <section class="photoseries" /> -->
	<section class="route">
		<slot />
	</section>
</main>
<!-- {/if} -->

<style>
	main {
		position: relative;
		background-color: black;
		box-sizing: border-box;
	}
	.canvas {
		height: 100vh;
	}
</style>
