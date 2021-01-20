<script>
	import Canvas2 from "../components/canvas2.svelte";
	import Preloader from "../components/preloader.svelte";
	import { stores } from "@sapper/app";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { showPrelader } from "store.js";
	onMount(() => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
		window.addEventListener("resize", () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		});
	});
	// const { preloading } = stores();
	// $: console.log($preloading, "$preloading");
	export let segment;
	segment = !segment;
</script>

<!-- {/if} -->
<style>
	main {
		position: relative;
		background-color: black;
		box-sizing: border-box;
	}
	.canvas {
		height: 100vh;
		height: calc(var(--vh, 1vh) * 100);
	}
</style>

<!-- {#if !$preloading} -->
<main transition:fade>
	{#if $showPrelader}
		<Preloader />
	{/if}
	<div class="canvas">
		<Canvas2 />
	</div>
	<!-- <section class="photoseries" /> -->
	<section class="route">
		<slot />
	</section>
</main>
