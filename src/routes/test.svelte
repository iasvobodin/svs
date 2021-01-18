<script>
    import anime from "animejs";
    import { onMount } from "svelte";

    const obj = [
        {
            id: {
                index: 1,
                need: 0,
            },
            value: 0,
        },
        {
            id: {
                index: 1,
                need: 0,
            },
            value: 0,
        },
        {
            id: {
                index: 1,
                need: 0,
            },
            value: 0,
        },
        {
            id: {
                index: 1,
                need: 0,
            },
            value: 0,
        },
    ];
    onMount(() => {
        anim(obj, [0, 1]);
        // console.log(obj);
    });
    function anim(target, duration) {
        anime({
            targets: target,
            id: (el) => {
                el.id.need = 1;
            },
            duration: 1000,
            easing: "linear",
            update: () => {
                console.log(obj[0].id.need);
            },
        });
    }
</script>

<div class="holder">
    <div class="color" />
    <!-- <img class="svg-clipped" src="flowers.jpg" alt="Cherry Blossoms." /> -->
</div>

<svg height="0" width="0">
    <defs>
        <clipPath
            clipPathUnits="objectBoundingBox"
            transform="scale(0.00125, 0.002)"
            id="svgPath">
            <path
                fill="#FFFFFF"
                stroke="#FFFFFF"
                stroke-width="1.5794"
                stroke-miterlimit="10"
                d="M215,100.3c97.8-32.6,90.5-71.9,336-77.6
        c92.4-2.1,98.1,81.6,121.8,116.4c101.7,149.9,53.5,155.9,14.7,178c-96.4,54.9,5.4,269-257,115.1c-57-33.5-203,46.3-263.7,20.1
        c-33.5-14.5-132.5-45.5-95-111.1C125.9,246.6,98.6,139.1,215,100.3z"
            />
        </clipPath>
    </defs>
</svg>

<style>
    /* .svg-clipped {
        -webkit-clip-path: url(#svgPath);
       
    } */
    .holder {
        width: 400px;
        height: 250px;
        clip-path: url(#svgPath);
    }
    .color {
        width: 100%;
        height: 20%;
        background-color: violet;
    }
</style>
