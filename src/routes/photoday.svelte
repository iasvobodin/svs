<script>
	import {
		Curtains,
		TextureLoader,
		Plane,
		Vec3,
	} from "curtainsjs/src/index.mjs";
	import { onMount } from "svelte";
	import anime from "animejs";
	import vertex from "assets/photoday.vert";
	import fragment from "assets/photoday.frag";
	let canvas,
		curtains,
		scrollEffect = 0,
		noiseFreq = 0.9,
		noiseAmp = 0.04,
		noiseEffect = 0,
		planes = [],
		animate,
		photos = [
			"20-08-31-12-01-02",
			"20-08-31-12-16-04",
			"20-09-06-13-12-33",
			"20-09-06-13-24-23",
			"20-09-06-13-22-33",
			"20-09-06-13-25-23",
			"20-08-31-12-24-31",
			"20-08-31-12-33-54",
		];
	// ==========================

	function initPlane(planesElement) {
		for (const iterator of planesElement) {
			const plane = new Plane(curtains, iterator, {
				vertexShader: vertex,
				fragmentShader: fragment,
				widthSegments: 16,
				heightSegments: 16,
				//   autoloadSources: false,
				fov: 75,
				alwaysDraw: false,
				shareProgram: true,
				texturesOptions: {
					minFilter: curtains.gl.LINEAR_MIPMAP_NEAREST,
				},
				uniforms: {
					noiseFreq: {
						name: "uNoiseFreq",
						type: "1f",
						value: noiseFreq,
					},
					noiseAmp: {
						name: "uNoiseAmp",
						type: "1f",
						value: noiseAmp,
					},
					noiseEffect: { name: "uNoiseEffect", type: "1f", value: 0 },
					scrollEffect: {
						name: "uScrollEffect",
						type: "1f",
						value: 0,
					},
					time: { name: "uTime", type: "1f", value: 0 },
				},
			});

			planes.push(plane);

			handlePlanes(plane);
		}
	}
	function initAnimate() {
		animate = anime.timeline({
			autoplay: false,
		});
		animate
			.add({
				targets: ".top",
				translateY: "-101%",
				easing: "linear",
				duration: 500,
			})
			.add(
				{
					targets: ".bottom",
					translateY: "101%",
					easing: "linear",
					duration: 500,
				},
				0
			)
			.add(
				{
					targets: ".webgl",
					scale: [1.13, 1],
					easing: "linear",
					duration: 700,
				},
				"-=300"
			)
			.add(
				{
					update: () => {
						scrollEffect += (80 - scrollEffect) * 0.3;
					},
					duration: 500,
				},
				0
			);
	}
	function handlePlanes(plane) {
		plane
			.onReady(() => {
				if (plane.index === planes.length - 1) {
					document.body.classList.add("planes-loaded");

					animate.play();
				}
			})
			.onRender(() => {
				noiseEffect += scrollEffect / 45000;
				plane.uniforms.time.value += 0.01;
				plane.uniforms.scrollEffect.value = scrollEffect / 100;
				plane.uniforms.noiseEffect.value = noiseEffect;
				// scale plane and its texture
				// plane.setScale(new Vec2(1, 1 + Math.abs(this.scrollEffect) / 1500))
				// plane.textures[0].setScale(
				//   new Vec2(1, 1 + Math.abs(this.scrollEffect) / 1550)
				// )
			});
	}

	function initCurtains() {
		curtains = new Curtains({
			container: canvas,
			pixelRatio: Math.min(1.5, window.devicePixelRatio),
		});

		curtains
			.onRender(() => {
				scrollEffect = curtains.lerp(scrollEffect, 0, 0.035);
			})
			.onScroll(() => {
				const delta = curtains.getScrollDeltas();
				delta.y = -delta.y;
				// threshold
				if (delta.y > 95) {
					delta.y = 95;
				} else if (delta.y < -95) {
					delta.y = -95;
				}

				if (Math.abs(delta.y) > Math.abs(scrollEffect)) {
					scrollEffect = curtains.lerp(scrollEffect, delta.y, 0.5);
				}
			})
			.onError(() => {
				document.body.classList.add("no-curtains", "planes-loaded");
			})
			.onContextLost(() => {
				curtains.restoreContext();
			});
	}
	onMount(() => {
		const planeElements = document.getElementsByClassName("plane");
		initCurtains();
		initPlane(planeElements);
		initAnimate();
		const frontPlane = new Vec3(0, 0, 80);
		planes[1].setRelativeTranslation(frontPlane);
		planes[3].setRelativeTranslation(frontPlane);
		planes[7].setRelativeTranslation(frontPlane);
		const rearPlane = new Vec3(0, 0, -80);
		planes[0].setRelativeTranslation(rearPlane);
		planes[2].setRelativeTranslation(rearPlane);
	});
</script>

<style>
	:root {
		--row__height: calc(var(--column__width) * 1.5);
		--column__width: min(8.5vw, 140px);
	}
	.half {
		background-color: black;
		width: 100%;
		height: 50vh;
		position: fixed;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	h2 {
		font-family: "Roboto Slab", serif;
		margin: 0;
	}
	.bottom h2 {
		grid-column: 2/3;
	}
	.top h2 {
		justify-self: end;
		align-self: end;
		grid-column: 1/2;
	}
	.bottom {
		top: 50vh;
	}
	.plane0 {
		grid-row: 2 / 7;
		grid-column: 2/7;
	}
	.plane1 {
		grid-row: 6 / 9;
		grid-column: 6/9;
	}
	.plane2 {
		width: 90%;
		height: 90%;
		justify-self: center;
		align-self: center;
		grid-row: 8 / 13;
		grid-column: 1/6;
	}
	.plane3 {
		width: 120%;
		height: 120%;
		grid-row: 10 / 12;
		grid-column: 5/7;
		justify-self: center;
		align-self: end;
	}
	.plane4 {
		width: 80%;
		height: 80%;
		grid-row: 13 / 18;
		grid-column: 1/6;
		justify-self: center;
		align-self: center;
	}
	.plane5 {
		width: 95%;
		height: 95%;
		grid-row: 13 / 18;
		grid-column: 6/11;
		justify-self: center;
		align-self: center;
	}
	.plane6 {
		/* width: 90%;
  height: 90%; */
		grid-row: 18 / 23;
		grid-column: 5/10;
		/* justify-self: center;
  align-self: center; */
	}
	.plane7 {
		width: 70%;
		height: 70%;
		grid-row: 19 / 23;
		grid-column: 1/5;
		justify-self: center;
		align-self: center;
	}
	.plane8 {
		width: 130%;
		height: 130%;
		grid-row: 24 / 26;
		grid-column: 3/8;
		justify-self: center;
		align-self: center;
	}
	.webgl {
		position: fixed;
		pointer-events: none;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* opacity: 0.3; */
	}

	.plane__wrapper {
		height: auto;
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(10, var(--column__width));
		grid-template-rows: 20px repeat(24, var(--row__height));
		/* grid-gap: 2vw; */
	}
	img {
		display: none;
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100&display=swap"
		rel="stylesheet" />
</svelte:head>
<main>
	<div bind:this={canvas} class="webgl" />
	<div class="top half">
		<h2>Svobodina</h2>
	</div>
	<div class="bottom half">
		<h2>Photo</h2>
	</div>
	<div class="plane__wrapper">
		{#each photos as photo, index (index)}
			<div class="plane plane{index}">
				<img
					data-sampler="planeTexture"
					alt="SvobodinaPhoto"
					crossorigin="anonimous"
					decoding="async"
					draggable="false"
					src="./photoday/{photo}.webp" />
			</div>
		{/each}
	</div>
</main>
