<script>
    import photoseries from "db/Photoseries.json";
    import { eventAnimation } from "../routes/blog/store";
    import { afterUpdate, onMount } from "svelte";
    import { Curtains, Plane } from "curtainsjs/src/index.mjs";
    // import { vertex, fragment } from "assets/shaderPhotoseries.js";
    import fragment from "assets/start.frag";
    import vertex from "assets/start.vert";
    onMount(() => {
        // const portrait = window.matchMedia("(orientation: portrait)");
        // portrait.addListener(handlePortrait);
        // handlePortrait(portrait);
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
        })
            .onContextLost(() => {
                curtains.restoreContext();
            })
            .onError(() => {
                document.body.classList.add("no-curtains");
            });

        const planeElement = document.getElementsByClassName("plane");
        for (let i = 0; i < planeElement.length; i++) {
            const params = {
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    time: {
                        name: "uTime", // uniform name that will be passed to our shaders
                        type: "1f", // this means our uniform is a float
                        value: 0,
                    },
                },
            };
            // create our plane using our curtains object, the HTML element and the parameters
            const plane = new Plane(curtains, planeElement[i], params);
            plane.onRender(() => {
                // use the onRender method of our plane fired at each requestAnimationFrame call
                plane.uniforms.time.value++; // update our time uniform value
            });
            // let plane = new Plane(curtains, planeElement[i], {
            //     vertexShader: vertex,
            //     fragmentShader: fragment,
            // }); // we don't need any params here
            // console.log(plane);

            planes.push(plane);
        }

        // addPlane(planeElement);
    });
    // const planes = { plane: [] }

    // export default (ctx, inject) => {
    //   inject('curtains', curtains)
    //   inject('planes', planes)
    // }
    export let page;
    afterUpdate(() => {
        console.log(page, "hellow frome canvas");
    });

    let clickDown = "",
        clickUp = "",
        curtains,
        webgl,
        planes = [],
        translation = 0,
        currentPosition = 0,
        animationFrame = null,
        startPosition = 0,
        endPosition = 0,
        mousePosition = 0,
        moveSpeed = 3,
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

    /// METHODS

    function getElementWidth(height, margin = 0.05) {
        let aspect2;
        if (aspect === 1.5) {
            aspect2 = 0.668;
        }
        if (aspect === 0.668) {
            aspect2 = 1.5;
        }
        return (elWidth =
            window.innerHeight * height * aspect2 +
            window.innerWidth * margin * 2);
    }
    function startAnimate() {
        if (!this.$route.params.Route) {
            const angleStep = (Math.PI * 2) / this.$refs.plane.length;
            const step = Math.PI / 2 - angleStep;
            const startTransition = {
                t: 0,
                r: this.radius / 30,
                sx: 0.02,
                sy: 0.02,
                a: 1,
                plus: 0,
            };
            this.$planes.plane.forEach((pl, i) => {
                const angle = angleStep * i;
                pl.setScale(new Vec2(startTransition.sx, startTransition.sy));
                this.startAnimation = anime
                    .timeline({
                        // autoplay: false,
                    })
                    .add({
                        targets: startTransition,
                        duration: 4300,
                        easing: "easeOutSine",
                        t: Math.PI * 4,
                        update: () => {
                            pl.setRelativeTranslation(
                                new Vec3(
                                    Math.cos(
                                        angle +
                                            step +
                                            angleStep -
                                            this.customCorr +
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
                                                this.customCorr +
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
                                ".headlaine",
                                ".sv",
                                ".logo",
                            ],
                            opacity: [1, 0],
                            r: this.radius,
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
                            easing: "easeOutSine",
                            changeComplete: () => {
                                if (pl.relativeTranslation.z < 0) {
                                    pl.visible = false;
                                } else {
                                    pl.visible = true;
                                }
                                this.startTransitionDone = true;
                            },
                        },
                        2000
                    );
            });
        }
    }
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
        if (Array.isArray(planeElement)) {
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
        }
        if (trPlane) {
            this.$planes.trPlane = new Plane(this.$curtains, trPlane, {
                ...params,
                fragmentShader: fragmentM,
            });

            this.$planes.trPlane.visible = 1;
        }
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
        } = this.$curtains.getBoundingRect();
        const calcCords = {};

        // SET CORRECTION FRAGMENT SHADER NEED TO START AND RESIZE
        if (opt.fCorr) {
            const scaleWidth = window.innerWidth * opt.widthUn;
            const scaleHeight = window.innerHeight * opt.heightUn;
            if (scaleHeight / scaleWidth > this.aspect) {
                calcCords.xNorm = (scaleWidth / scaleHeight) * this.aspect;
                calcCords.yNorm = 1;
            } else {
                calcCords.xNorm = 1;
                calcCords.yNorm = scaleHeight / scaleWidth / this.aspect;
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

    function customCorrection(coef) {
        const angle = (Math.PI * 2) / this.$refs.plane.length;
        this.customCorr = angle * coef;
        this.translation = 0;
        this.currentPosition = 0;
        this.endPosition = 0;
    }
    function handlePortrait(e) {
        if (e.matches) {
            // PORTAIT
            aspect = 1.5;
            getElementWidth(0.65);
            // innerHeight = window.innerHeight
            // innerWidth = window.innerWidth
            // const planeHeight = innerHeight * 0.65
            // const planeWidth = planeHeight * 0.66
            // const planeMargin = innerWidth * 0.05
            // this.elWidth = planeWidth + planeMargin * 2
            // this.$nextTick(() => {
            planes.forEach((p, i) => {
                p.onReady(() => {
                    getUnifors(p, {
                        pCorr: false,
                        sCorr: true,
                        fCorr: true,
                        // aspect: 1.5,
                        widthUn: 1,
                        heightUn: 1,
                    });
                });
                // p.loadImage(
                //   `/image/${this.$fileEx}/720/${photoseries[i].Portrait}.${this.$fileEx}`
                // )
                // p.textures[0].needUpdate()
                // console.log(p)
            });
            // });
        } else {
            // LANDSCAPE
            aspect = 0.668;
            getElementWidth(0.52);
            // innerHeight = window.innerHeight
            // innerWidth = window.innerWidth
            // const planeHeight = innerHeight * 0.52
            // const planeWidth = planeHeight * 1.5
            // const planeMargin = innerWidth * 0.05
            // this.elWidth = planeWidth + planeMargin * 2
            // this.$nextTick(() => {
            planes.forEach((p, i) => {
                p.onReady(() => {
                    getUnifors(p, {
                        pCorr: false,
                        sCorr: true,
                        fCorr: true,
                        // aspect: 0.668,
                        widthUn: 0.7,
                        heightUn: 0.8,
                    });
                });
            });
            // });
        }
    }
    function translateSlider(t) {
        this.$curtains.render();
        // this.$planes.plane.forEach((pl, i) => {
        //   this.startAnimation.tick(t)
        // })
        // ANIMATION HTML SLIDER
        // this.$refs.slider.style.transform = `translateX( ${this.translation}px)`
        // } else {
        // ANIMATION CANVAS SLIDER
        if (eventAnimation) {
            this.translation +=
                (this.currentPosition - this.translation) * 0.05;
            this.$planes.plane.forEach((plane, i) => {
                const angleStep = (Math.PI * 2) / this.$refs.plane.length;
                const step = Math.PI / 2 - angleStep;
                const angle = angleStep * i;

                if (this.startTransitionDone) {
                    plane.setRelativeTranslation(
                        new Vec3(
                            Math.cos(
                                angle +
                                    step +
                                    angleStep -
                                    this.customCorr -
                                    this.translation / 1300
                            ) * this.radius,
                            0,
                            Math.sin(
                                angle +
                                    step +
                                    angleStep -
                                    this.customCorr -
                                    this.translation / 1300
                            ) * this.radius
                        )
                    );
                    if (plane.relativeTranslation.z < 0) {
                        plane.visible = false;
                    } else {
                        plane.visible = true;
                    }
                }
                // plane.setRelativeTranslation(
                //   new Vec3(
                //     Math.cos(
                //       angle +
                //         step +
                //         angleStep -
                //         this.customCorr -
                //         this.translation / 1300
                //     ) * this.r,
                //     0,
                //     Math.sin(
                //       angle +
                //         step +
                //         angleStep -
                //         this.customCorr -
                //         this.translation / 1300
                //     ) * this.r
                //   )
                // )
            });
        }
        that.animationFrame = requestAnimationFrame(this.translateSlider);
        // }
        // ANIMATION TITLE
        //   this.$refs.titleSlider.style.transform = `translateY(${
        //     (this.translation / elWidth) * (20 + innerWidth * 0.04)
        //   }px)`
        // this.animation.tick(t)
    }

    function onPlaneClick(mouse) {
        this.$planes.plane.forEach((el) => {
            if (!el.isDrawn()) {
                return;
            }
            const { left, width } = el.getWebGLBoundingRect();
            if (
                !(
                    mouse >= left / this.$curtains.pixelRatio &&
                    mouse <= (left + width) / this.$curtains.pixelRatio
                )
            ) {
                return;
            }
            this.$store.commit("TOGGLE__STATE", false);
            this.$planes.ctPlane = el;
            this.$router.push({
                path: `/photoseries/${el.userData.route}`,
            });
        });
    }
    // EVENT CONTROLS
    function onMouseDown(e) {
        if (eventAnimation) {
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
        if (eventAnimation) {
            isMouseDown = false;
            endPosition = currentPosition;
            clickUp = getMousePosition(e);
            if (
                clickUp[0] === clickDown[0] &&
                eventAnimation &&
                clickUp[1] === clickDown[1]
            ) {
                // onPlaneClick(clickUp[0]);
            }
        }
    }
    function onWheel(e) {
        if (eventAnimation) {
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
        console.log(mousePosition);
        return mousePosition;
    }
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

<div
    class="wrapper"
    on:mousemove={onMouseMove}
    on:touchmove|passive={onMouseMove}
    on:mouseleave={onMouseUp}
    on:mouseup={onMouseUp}
    on:mousedown|preventDefault={onMouseDown}
    on:touchstart|preventDefault={onMouseDown}
    on:touchend={onMouseUp}
    on:wheel={onWheel}>
    {#each photoseries as seriya}
        <div
            data-id="index"
            data-route="seriya.Route"
            data-color="[seriya.ColorVector]"
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
                        ref="planePicture"
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
