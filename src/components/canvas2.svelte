<script>
    import { Curtains, Plane, Vec3, Vec2 } from "curtainsjs/src/index.mjs";
    import anime from "animejs";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        eventAnimation,
        photoseries,
        leaveIndex,
        leaveRoute,
    } from "store.js";
    import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
    import { goto, stores } from "@sapper/app";
    const { preloading, page, session } = stores();
    export let pageslug;

    // SORT PHOTOSERIES
    $: if (pageslug) {
        const object = $photoseries.find((el) => el.Route === pageslug);
        photoseries.update((n) => [
            ...n.slice(object.Id),
            ...n.slice(0, object.Id),
        ]);
    }

    let clickDown = "",
        clickUp = "",
        curtains,
        webgl,
        planes = [],
        activePlane,
        translation = 0,
        currentPosition = 0,
        animationFrame = null,
        startPosition = 0,
        endPosition = 0,
        mousePosition = 0,
        moveSpeed = 3,
        transVec,
        radius = null,
        elWidth,
        aspect = 0,
        startTransitionDone = false,
        transitionVec = null,
        startAnimation = null,
        textures = [],
        isTrackpad = true,
        isMouseDown = false,
        isTranslating = false,
        previousTranslation = { x: 0 },
        calcCords = {},
        customCorr = 0;

    $: if ($leaveIndex) {
        introActivePlane(activePlane);
    }
    $: if ($leaveRoute) {
        outroActivePlane(activePlane);
    }

    $: if (pageslug) {
        afterUpdate(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
            }
        });
        onMount(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
            }
            eventAnimation.set(false);
            activePlane.visible = 1;
            activePlane.uniforms.uProgress.value = 1;
            curtains.needRender();
        });
    }

    // INIT
    function addPlane(planeElement, trPlane = false) {
        const params = {
            widthSegments: 10,
            heightSegments: 10,
            vertexShader: vertex,
            // fragmentShader: fragment,
            // visible: 0,
            // autoloadSources: false,
            // depthTest: false,
            fov: 1,
            // alwaysDraw: false,
            // shareProgram: true,
            watchScroll: false,
            uniforms: {
                uColor: { name: "uColor", type: "3f", value: [] },
                uScaleVector: { name: "uScaleVector", type: "2f", value: [] },
                uMouse: { name: "uMouse", type: "2f", value: [] },
                uPlanePosition: {
                    name: "uPlanePosition",
                    type: "2f",
                    value: [],
                },
                uFragmentCorrection: {
                    name: "uFragmentCorrection",
                    type: "2f",
                    value: [],
                },
                uProgress: { name: "uProgress", type: "1f", value: 0 },
            },
        };
        // if (Array.isArray(planeElement)) {
        for (const element of planeElement) {
            const plane = new Plane(curtains, element, {
                ...params,
                fragmentShader: fragment,
            });
            plane.userData = {
                route: element.dataset.route,
                color: element.dataset.color,
                id: element.dataset.id,
            };
            planes.push(plane);
        }
        // }
        // console.log(planes);
        if (trPlane) {
            planes.trPlane = new Plane(curtains, trPlane, {
                ...params,
                fragmentShader: fragmentM,
            });

            planes.trPlane.visible = 1;
        }
    }
    function initActivePlane() {}
    function customCorrection(coef) {
        const angle = (Math.PI * 2) / $photoseries.length;
        customCorr = angle * coef;
        translation = 0;
        currentPosition = 0;
        endPosition = 0;
    }
    function getUnifors(
        plane,
        opt = {
            pCorr: true,
            sCorr: true,
            fCorr: true,
            widthUn: 0.7,
            heightUn: 0.8,
        }
    ) {
        // GET BOUND
        const { width, height, left, top } = plane.getWebGLBoundingRect();
        const {
            width: curtainsWidth,
            height: curtainsHeight,
        } = curtains.getBoundingRect();
        const calcCords = {};

        // SET CORRECTION FRAGMENT SHADER NEED TO START AND RESIZE
        if (opt.fCorr) {
            const scaleWidth = window.innerWidth * opt.widthUn;
            const scaleHeight = window.innerHeight * opt.heightUn;
            if (scaleHeight / scaleWidth > aspect) {
                calcCords.xNorm = (scaleWidth / scaleHeight) * aspect;
                calcCords.yNorm = 1;
            } else {
                calcCords.xNorm = 1;
                calcCords.yNorm = scaleHeight / scaleWidth / aspect;
            }
            plane.uniforms.uFragmentCorrection.value = [
                calcCords.xNorm,
                calcCords.yNorm,
            ];
        }

        // SET SCALE VECTOR NEED TO START AND RESIZE
        if (opt.sCorr) {
            plane.uniforms.uScaleVector.value = [
                (curtainsWidth * opt.widthUn) / width - 1, // * 0.5,
                (curtainsHeight * opt.heightUn) / height - 1, //* 0.7
            ];
        }
        // PLANE SIZE
        calcCords.w = curtainsWidth / width;
        calcCords.h = curtainsHeight / height;
        // PLANE POSITION VECTOR
        calcCords.x = (left / width - calcCords.w / 2 + 0.5) * 2;
        calcCords.y = (-(top / height - calcCords.h / 2) - 0.5) * 2;

        if (opt.pCorr) {
            plane.uniforms.uPlanePosition.value = [calcCords.x, calcCords.y];
        } else {
            plane.uniforms.uPlanePosition.value = [0, 0];
        }
    }
    function handlePortrait(e) {
        console.log("from handlePortrait");
        if (e.matches) {
            // PORTAIT
            console.log("from handlePortrait PORTAIT");
            aspect = 1.5;
            getElementWidth(0.65);
            planes.forEach((p, i) => {
                p.onReady(() => {
                    getUnifors(p, {
                        pCorr: false,
                        sCorr: true,
                        fCorr: true,
                        widthUn: 1,
                        heightUn: 1,
                    });
                });
                // p.loadImage(
                //   `/image/${$fileEx}/720/${$store.state.photoseries[i].Portrait}.${$fileEx}`
                // )
                // p.textures[0].needUpdate()
                // console.log(p)
            });
        } else {
            // LANDSCAPE
            console.log("from handlePortrait LANDSCAPE");
            aspect = 0.668;
            getElementWidth(0.52);
            planes.forEach((p, i) => {
                p.onReady(() => {
                    getUnifors(p, {
                        pCorr: false,
                        sCorr: true,
                        fCorr: true,
                        widthUn: 0.7,
                        heightUn: 0.8,
                    });
                });
            });
        }
    }
    function getElementWidth(height, margin = 0.06) {
        elWidth =
            (window.innerHeight * height) / aspect +
            window.innerWidth * margin * 2;

        document.documentElement.style.setProperty(
            "--plane__width",
            `${(window.innerHeight * height) / aspect}px`
        );
        document.documentElement.style.setProperty(
            "--plane__height",
            `${window.innerHeight * height}px`
        );
        console.log("from getElementWidth", elWidth);
    }

    //AANIMATE

    function introActivePlane(activePlane) {
        if (!activePlane) {
            activePlane = planes.find((p) => p.userData.route === pageslug);
        }
        if (!activePlane.isDrawn()) {
            customCorrection(activePlane.index);
        }
        anime({
            changeBegin: () => {
                getUnifors(activePlane);
                eventAnimation.set(false);
            },
            duration: 1400,
            targets: activePlane.uniforms.uProgress,
            value: 1,
            easing: "easeOutQuad",
            changeComplete: () => {
                leaveIndex.set(false);
            },
        });
    }
    function outroActivePlane(activePlane) {
        getUnifors(activePlane, {
            pCorr: true,
            sCorr: false,
            fCorr: false,
        });
        anime({
            duration: 1400,
            targets: activePlane.uniforms.uProgress,
            value: 0,
            easing: "easeInSine",
            changeComplete: () => {
                leaveRoute.set(false);
                eventAnimation.set(true);
                startTransitionDone = true;
                currentPosition = endPosition = translation;
            },
        });
    }

    function startAnimate() {
        if (!pageslug) {
            const angleStep = (Math.PI * 2) / $photoseries.length;
            const step = Math.PI / 2 - angleStep;
            const startTransition = {
                t: 0,
                r: Math.min((window.innerWidth * 0.11) / 1.3882 / 2, 100),
                sx: 0.02,
                sy: 0.02,
                a: 1,
                plus: 0,
            };
            planes.forEach((pl, i) => {
                const angle = angleStep * i;
                pl.setScale(new Vec2(startTransition.sx, startTransition.sy));
                startAnimation = anime
                    .timeline({
                        // autoplay: false,
                    })
                    .add({
                        targets: startTransition,
                        duration: 5500,
                        easing: "easeOutSine",
                        t: Math.PI * 4,
                        changeComplete: () => {
                            if (pl.relativeTranslation.z < 0) {
                                pl.visible = false;
                            } else {
                                pl.visible = true;
                            }
                            startTransitionDone = true;
                        },
                        update: () => {
                            pl.setRelativeTranslation(
                                new Vec3(
                                    Math.cos(
                                        angle +
                                            step +
                                            angleStep -
                                            customCorr +
                                            startTransition.t
                                    ) * startTransition.r,
                                    startTransition.r *
                                        startTransition.a *
                                        Math.cos(angle + startTransition.t),
                                    startTransition.plus *
                                        Math.sin(
                                            angle +
                                                step +
                                                angleStep -
                                                customCorr +
                                                startTransition.t
                                        ) *
                                        startTransition.r
                                )
                            );
                        },
                    })
                    .add(
                        {
                            duration: 2000,
                            // delay: 2000,
                            targets: [
                                startTransition,
                                ".svobodina",
                                ".photo",
                                ".logo",
                            ],
                            opacity: [1, 0],
                            r: radius,
                            sx: 1,
                            sy: 1,
                            a: 0,
                            t: 0,
                            plus: 1,
                            update: () => {
                                pl.setScale(
                                    new Vec2(
                                        startTransition.sx,
                                        startTransition.sy
                                    )
                                );
                            },
                            easing: "easeInOutSine",
                        },
                        3000
                    );
            });
        }
    }
    function translateSlider(t) {
        curtains.render();
        // this.$planes.plane.forEach((pl, i) => {
        //   this.startAnimation.tick(t)
        // })
        // ANIMATION HTML SLIDER
        // this.$refs.slider.style.transform = `translateX( ${this.translation}px)`
        // } else {
        // ANIMATION CANVAS SLIDER
        if ($eventAnimation) {
            translation += (currentPosition - translation) * 0.05;
            planes.forEach((plane, i) => {
                const angleStep = (Math.PI * 2) / $photoseries.length;
                const step = Math.PI / 2 - angleStep;
                const angle = angleStep * i;
                transVec.set(
                    Math.cos(
                        angle +
                            step +
                            angleStep -
                            customCorr -
                            translation / 1300
                    ) * radius,
                    0,
                    Math.sin(
                        angle +
                            step +
                            angleStep -
                            customCorr -
                            translation / 1300
                    ) * radius
                );
                if (startTransitionDone) {
                    // $planes.title[i].setRelativeTranslation(transVec)
                    plane.setRelativeTranslation(transVec);
                    if (plane.relativeTranslation.z < 0) {
                        plane.visible =
                            //   $planes.title[i].visible =
                            false;
                    } else {
                        plane.visible =
                            //   $planes.title[i].visible =
                            true;
                    }
                }
            });
        }
        animationFrame = requestAnimationFrame(translateSlider);
        // }
        // ANIMATION TITLE
        // this.$refs.titlePlane.style.transform = `translateY(${
        //   (this.translation / this.elWidth) * (20 + innerWidth * 0.04)
        // }px)`
        // this.animation.tick(t)
    }

    // EVENT CONTROLS
    function onPlaneClick(mouse) {
        planes.forEach((el) => {
            if (!el.isDrawn()) {
                return;
            }
            const { left, width } = el.getWebGLBoundingRect();
            if (
                !(
                    mouse >= left / curtains.pixelRatio &&
                    mouse <= (left + width) / curtains.pixelRatio
                )
            ) {
                return;
            }
            // Clicked
            eventAnimation.set(false);
            activePlane = el;
            goto(`blog/${el.userData.route}`);
        });
    }
    function onMouseDown(e) {
        if ($eventAnimation) {
            isMouseDown = true;
            clickDown = getMousePosition(e);
            startPosition = clickDown[0];
        }
    }
    function onMouseMove(e) {
        if (!isMouseDown) return;
        mousePosition = getMousePosition(e);
        currentPosition =
            endPosition + (mousePosition[0] - startPosition) * moveSpeed;
    }
    function onMouseUp(e) {
        if ($eventAnimation) {
            isMouseDown = false;
            endPosition = currentPosition;
            clickUp = getMousePosition(e);
            if (
                clickUp[0] === clickDown[0] &&
                eventAnimation &&
                clickUp[1] === clickDown[1]
            ) {
                onPlaneClick(clickUp[0]);
            }
        }
    }
    function onWheel(e) {
        if ($eventAnimation) {
            e.preventDefault();
            if (isTrackpad) {
                if (e.wheelDeltaY) {
                    if (Math.abs(e.wheelDeltaY) !== 120) {
                        isTrackpad = false;
                    }
                } else if (e.deltaMode === 0) {
                    isTrackpad = false;
                }
            }
            const delta = window.navigator.userAgent.includes("Firefox")
                ? e.deltaY * 33
                : e.deltaY;
            !isTrackpad
                ? (currentPosition += e.deltaY * -1)
                : (currentPosition += delta * -1);
            endPosition = currentPosition;
        }
    }
    function getMousePosition(e) {
        let mousePosition;
        if (e.targetTouches) {
            if (e.targetTouches[0]) {
                mousePosition = [
                    e.targetTouches[0].clientX,
                    e.targetTouches[0].clientY,
                ];
            } else if (e.changedTouches[0]) {
                // handling touch end e
                mousePosition = [
                    e.changedTouches[0].clientX,
                    e.changedTouches[0].clientY,
                ];
            } else {
                // fallback
                mousePosition = [e.clientX, e.clientY];
            }
        } else {
            mousePosition = [e.clientX, e.clientY];
        }
        return mousePosition;
    }

    onMount(() => {
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
        });
        const planeElements = document.getElementsByClassName("plane");
        addPlane(planeElements);
        const portrait = window.matchMedia("(orientation: portrait)");
        handlePortrait(portrait);
        portrait.addEventListener("change", handlePortrait);

        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        transVec = new Vec3();
        startAnimate();
        translateSlider();
        console.log($eventAnimation);
        // const params = {
        //     vertexShader: vertex,
        //     fragmentShader: fragment,
        //     widthSegments: 16,
        //     heightSegments: 16,
        //     uniforms: {
        //         time: {
        //             name: "uTime", // uniform name that will be passed to our shaders
        //             type: "1f", // this means our uniform is a float
        //             value: 0,
        //         },
        //     },
        // };
        // for (const iterator of planeElements) {
        //     new Plane(curtains, iterator, params);
        // }
    });
</script>

<style>
    :root {
        --margin__wrapper: calc((100vh - var(--plane__height)) / 2);
        --title__height: calc(14px + 4vw);
        --translationSlide: 0;
        --plane__height: 52vh;
        --plane__width: calc(var(--plane__height) * 1.5);
        --plane__margin: 5vw;
        --plane__shift: calc(
            50vw - ((var(--plane__width) + var(--plane__margin) * 2) * 3.5)
        );
    }
    @media (orientation: landscape) {
        .wrapper {
            justify-content: center;
            width: 100%;
            height: var(--plane__height);
            top: 50vh;
            transform: translateY(-50%);
            /* left: var(--plane__shift);
      top: var(--margin__wrapper); */
            display: flex;
            position: absolute;
        }
        .plane {
            align-self: center;
            /* top: 0; */
            /* left: 0; */
            position: absolute;
            box-sizing: border-box;
            height: var(--plane__height);
            width: var(--plane__width);
            /* margin: auto var(--plane__margin); */
        }
    }
    @media (orientation: portrait) {
        :root {
            --plane__height: 65vh;
            --plane__width: calc(var(--plane__height) * 0.66);
        }
        .wrapper {
            justify-content: center;
            width: 100%;
            height: 100vh;
            /* left: var(--plane__shift);
      top: var(--margin__wrapper); */
            display: flex;
            position: absolute;
        }
        .plane {
            align-self: center;
            /* top: 0; */
            /* left: 0; */
            position: absolute;
            box-sizing: border-box;
            height: var(--plane__height);
            width: var(--plane__width);
            /* margin: auto var(--plane__margin); */
        }
    }
    .slider__img {
        display: none;
        opacity: 0;
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    /* #curtains canvas {
        display: block;
    } */
    #curtains {
        /* overflow: hidden; */
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        height: 100vh;
        /* bottom: 0;
  right: 0; */
        /* opacity: 0; */
    }
</style>

<!-- <h1 style="color: white">I'm LAYOUT Canvas2</h1> -->
<div
    on:mousemove={onMouseMove}
    on:touchmove|passive={onMouseMove}
    on:mouseleave={onMouseUp}
    on:mouseup={onMouseUp}
    on:mousedown|preventDefault={onMouseDown}
    on:touchstart|preventDefault={onMouseDown}
    on:touchend={onMouseUp}
    on:wheel={onWheel}
    class="wrapper">
    {#each $photoseries as seriya, index (index)}
        <div
            data-id={index}
            data-route={seriya.Route}
            data-color={[seriya.ColorVector]}
            class="plane">
            <picture class="standart__picture">
                <source
                    media="(orientation: portrait)"
                    srcset="/image/webp/720/{seriya.Portrait}.webp"
                    type="image/webp" />
                <source
                    media="(orientation: landscape)"
                    srcset="/image/webp/720/{seriya.FileName}.webp"
                    type="image/webp" />
                <a href="blog/{seriya.Route}">
                    <img
                        data-sampler="planeTexture"
                        class="slider__img"
                        alt="SvobodinaPhoto"
                        crossorigin="anonimous"
                        decoding="async"
                        draggable="false"
                        src="/image/jpg/720/{seriya.FileName}.jpg" />
                </a>
            </picture>
        </div>
    {/each}
</div>
<div bind:this={webgl} id="curtains" />
