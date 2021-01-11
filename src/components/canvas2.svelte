<script>
    import { Curtains, Plane, Vec3, Vec2 } from "curtainsjs/src/index.mjs";
    import anime from "animejs";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    import vertexT from "assets/start.vert";
    import fragmentT from "assets/start.frag";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        eventAnimation,
        photoseries,
        leaveIndex,
        leaveRoute,
        titlePlaneLoad,
    } from "store.js";
    import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
    import { goto, stores } from "@sapper/app";
    const { preloading, page, session } = stores();
    export let pageslug;
    console.log($page.params.Route, "pagggggggge");
    // SORT PHOTOSERIES
    $: if (pageslug) {
        const object = $photoseries.find((el) => el.Route === pageslug);
        photoseries.update((n) => [
            ...n.slice(object.Id),
            ...n.slice(0, object.Id),
        ]);
    }
    // VARIABLE DATA
    let clickDown = "",
        clickUp = "",
        curtains,
        webgl,
        planesTitle = [],
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
        customCorr = 0,
        angleStep = (Math.PI * 2) / $photoseries.length,
        step = Math.PI / 2 - angleStep,
        width,
        height;
    const startTransition = {
        opacityPlane: 1,
        time: 0,
        radiusAnimation: Math.min((width * 0.11) / 1.3882 / 2, 100),
        scalePlane: 0.02,
        yRoundDisable: 1,
        zRoundEnable: 0,
    };

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
    function addTitlePlane(planeElementTitle) {
        const paramsTitle = {
            vertexShader: vertexT,
            fragmentShader: fragmentT,
            fov: 1,
            alwaysDraw: false,
            visible: 0,
            uOpacity: { name: "uOpacity", type: "1f", value: 1 },
        };
        document.fonts.load("1em Cormorant Infant").then(() => {
            titlePlaneLoad.set(true);
            for (const element of planeElementTitle) {
                const planeTitle = new Plane(curtains, element, paramsTitle);
                const canvas = document.createElement("canvas");
                planeTitle.loadCanvas(canvas);
                planeTitle.onLoading((texture) => {
                    texture.shouldUpdate = false;
                    writeText(planeTitle, texture.source);
                });
                planesTitle.push(planeTitle);
            }
        });
    }
    function addPlane(planeElement, trPlane = false) {
        let load = 0;
        let loadR = 0;
        const paramsPlane = {
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
                uOpacity: { name: "uOpacity", type: "1f", value: 1 },
            },
        };

        // if (Array.isArray(planeElement)) {
        for (const element of planeElement) {
            const plane = new Plane(curtains, element, {
                ...paramsPlane,
                fragmentShader: fragment,
            });
            plane.userData = {
                route: element.dataset.route,
                color: element.dataset.color,
                id: element.dataset.id,
            };
            plane.onLoading((texture) => {
                console.log(load++);
            });
            planes.push(plane);
        }

        if (trPlane) {
            planes.trPlane = new Plane(curtains, trPlane, {
                ...params,
                fragmentShader: fragmentM,
            });

            planes.trPlane.visible = 1;
        }
    }
    function writeText(plane, canvas) {
        const htmlPlane = plane.htmlElement;
        const htmlPlaneStyle = window.getComputedStyle(htmlPlane);
        const planeBoundingRect = plane.getBoundingRect();
        const htmlPlaneWidth = planeBoundingRect.width / curtains.pixelRatio;
        const htmlPlaneHeight = planeBoundingRect.height / curtains.pixelRatio;
        // set sizes
        canvas.width = htmlPlaneWidth;
        canvas.height = htmlPlaneHeight;
        const context = canvas.getContext("2d");
        context.width = htmlPlaneWidth;
        context.height = htmlPlaneHeight;

        // draw our title with the original style
        context.fillStyle = htmlPlaneStyle.color;
        context.font =
            htmlPlaneStyle.fontSize + " " + htmlPlaneStyle.fontFamily;
        context.fontStyle = htmlPlaneStyle.fontStyle;
        context.textAlign = htmlPlaneStyle.textAlign;
        // console.log(htmlPlaneStyle.textAlign)
        // vertical alignment is a bit hacky
        context.textBaseline = "middle";
        context.fillText(
            htmlPlane.textContent,
            htmlPlaneWidth / 2,
            htmlPlaneHeight / 2
        );
        // update our canvas texture once on next draw call
        if (plane.textures.length > 0) {
            // we just changed the texture source sizes, we need to update its texture matrix
            plane.textures[0].resize();
            // update the webgl texture on next draw call
            plane.textures[0].needUpdate();
        }
    }
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
                activePlane.setRelativeTranslation(
                    new Vec3(
                        activePlane.relativeTranslation.x,
                        activePlane.relativeTranslation.y,
                        radius + 10
                    )
                );
            },
            duration: 1400,
            update: () => {
                planes.forEach((pl) => {
                    if (
                        pl.visible &&
                        pl.isDrawn() &&
                        pl.index !== activePlane.index
                    ) {
                        pl.uniforms.uOpacity.value =
                            // planesTitle[
                            //     pl.index
                            // ].uniforms.uOpacity.value =
                            1 - activePlane.uniforms.uProgress.value * 2;
                    }
                });
            },
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
            // const angleStep = (Math.PI * 2) / $photoseries.length;
            // const step = Math.PI / 2 - angleStep;
            const startTransition = {
                opacityPlane: 1,
                time: 0,
                radiusAnimation: Math.min((width * 0.11) / 1.3882 / 2, 100),
                scalePlane: 0.02,
                yRoundDisable: 1,
                zRoundEnable: 0,
            };
            planes.forEach((pl, i) => {
                const angle = angleStep * i;
                pl.setScale(
                    new Vec2(
                        startTransition.scalePlane,
                        startTransition.scalePlane
                    )
                );
                startAnimation = anime
                    .timeline({
                        // autoplay: false,
                    })
                    .add({
                        targets: startTransition,
                        duration: 4000,
                        easing: "easeOutSine",
                        time: Math.PI * 4,
                        changeComplete: () => {
                            if (pl.relativeTranslation.z < 0) {
                                pl.visible = false;
                            } else {
                                pl.visible = true;
                            }
                            startTransitionDone = true;
                        },
                        update: () => {
                            // pl.setRelativeTranslation(
                            // new Vec3(
                            // X
                            (pl.relativeTranslation.x =
                                Math.cos(
                                    angle +
                                        step +
                                        angleStep -
                                        customCorr -
                                        translation / 1300 +
                                        startTransition.time
                                ) * startTransition.radiusAnimation),
                                // Y
                                (pl.relativeTranslation.y =
                                    Math.cos(angle + startTransition.time) *
                                    startTransition.radiusAnimation *
                                    startTransition.yRoundDisable),
                                // Z

                                (pl.relativeTranslation.z =
                                    Math.sin(
                                        angle +
                                            step +
                                            angleStep -
                                            customCorr -
                                            translation / 1300 +
                                            startTransition.time
                                    ) *
                                    startTransition.radiusAnimation *
                                    startTransition.zRoundEnable);
                            // )
                            // );
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
                            opacity: 0,
                            radiusAnimation: radius,
                            scalePlane: 1,
                            yRoundDisable: 0,
                            time: 0,
                            zRoundEnable: 1,
                            update: () => {
                                pl.setScale(
                                    new Vec2(
                                        startTransition.scalePlane,
                                        startTransition.scalePlane
                                    )
                                );
                            },
                            easing: "easeInOutSine",
                        },
                        2000
                    )
                    .add(
                        {
                            duration: 500,
                            targets: startTransition,
                            opacityPlane: 0, // this.$planes.ctPlane.uniforms.uOpacity,
                            update: () => {
                                if (pl.relativeTranslation.z < 0) {
                                    pl.uniforms.uOpacity.value =
                                        startTransition.opacityPlane;
                                }
                            },
                            changeComplete: () => {},
                            easing: "linear",
                        },
                        3500
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
                // const angleStep = (Math.PI * 2) / $photoseries.length;
                // const step = Math.PI / 2 - angleStep;
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
                    if ($titlePlaneLoad) {
                        planesTitle[i].setRelativeTranslation(transVec);
                        if (planesTitle[i].relativeTranslation.z < 0) {
                            planesTitle[i].visible = false;
                        } else {
                            planesTitle[i].visible = true;
                        }
                    }
                    plane.setRelativeTranslation(transVec);
                    if (plane.relativeTranslation.z < 0) {
                        plane.visible = false;
                    } else {
                        plane.visible = true;
                    }
                    if (plane.uniforms.uOpacity.value < 1) {
                        plane.uniforms.uOpacity.value = 1;
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
        const planeElementsTitle = document.getElementsByClassName("titleH3");
        addPlane(planeElements);
        addTitlePlane(planeElementsTitle);
        const portrait = window.matchMedia("(orientation: portrait)");
        handlePortrait(portrait);
        portrait.addEventListener("change", handlePortrait);

        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        transVec = new Vec3();
        startAnimate();
        translateSlider();
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
        --title__height: calc(14px + 3.2vw);
        --translationSlide: 0;
        --plane__height: 52vh;
        --plane__width: calc(var(--plane__height) * 1.5);
        --plane__margin: 5vw;
        --plane__shift: calc(
            50vw - ((var(--plane__width) + var(--plane__margin) * 2) * 3.5)
        );
    }
    .title__plane {
        opacity: 0;
        height: clamp(18px, 3.5vw + 12px, 90px);
        width: var(--plane__width);
        position: absolute;
        padding-top: 10px;
        padding-bottom: 10px;
        left: 50vw;
        transform: translateX(-50%);
        pointer-events: none;
        overflow: hidden;
    }
    h3 {
        text-align: center;
        width: 100%;
        position: absolute;
        top: 0;
        font-family: Cormorant Infant, sans-serif;
        font-weight: 300;
        font-style: italic;
        color: rgb(255, 255, 255);
        /* font-size: clamp(14px, 3vw + 12px, 80px);
        line-height: clamp(18px, 3.5vw + 12px, 90px); */
        margin: 0;
    }
    @media (orientation: landscape) {
        h3 {
            font-size: clamp(14px, 3vw + 12px, 80px);
            line-height: clamp(18px, 3.5vw + 12px, 90px);
        }
        .title__plane {
            top: calc(
                (100vh - var(--plane__height)) / 2 + var(--plane__height)
            );
        }
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
        .svobodina {
            position: fixed;
            width: min(80vw, 1600px);
            left: 50vw;
            top: 50vh;
            transform: translate(-50%, -200%);
        }
        /* 1.3882 */
        .photo {
            position: fixed;
            width: min(44vw, 888px);
            left: 50vw;
            top: 50vh;
            transform: translate(-52.5%, -70%);
        }
        .logo {
            width: 10vw;
            height: auto;
            position: fixed;
            bottom: 50px;
            right: 50px;
        }
    }
    @media (orientation: portrait) {
        :root {
            --plane__height: 65vh;
            --plane__width: calc(var(--plane__height) * 0.66);
        }
        .title__plane {
            top: calc(
                (100vh - var(--plane__height)) / 2 + var(--plane__height)
            );
        }
        h3 {
            font-size: clamp(14px, 3vh + 12px, 80px);
            line-height: clamp(18px, 3.5vh + 12px, 90px);
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
        .svobodina {
            /* width: min(7vw, 100px); */
            height: 90vh;
            /* margin: auto; */
            top: 5vh;
            position: fixed;
            left: 50vw;
            transform: translateX(-250%);
        }
        .photo {
            position: fixed;
            top: 25vh;
            height: 50vh;
            left: 50vw;
            transform: translateX(-50%);
            /* right: calc(
      50vw + max(11vw, 100px) / 1.3882 / 2 + max(11vw, 100px) / 1.3882 / 10
    ); */
        }
        .logo {
            width: 20vw;
            height: auto;
            position: fixed;
            bottom: 5vh;
            right: 5vh;
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
<!-- {#if !$page.params.Route} -->
<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<picture>
    <source
        media="(orientation: portrait)"
        srcset="image/svobodinaPortrait.svg"
        type="image/svg+xml" />
    <source
        media="(orientation: landscape)"
        srcset="image/svobodina.svg"
        type="image/svg+xml" />
    <img src="image/svobodina.svg" class="svobodina" alt="svobodina" />
</picture>
<picture>
    <source
        media="(orientation: portrait)"
        srcset="image/photoPortrait.svg"
        type="image/svg+xml" />
    <source
        media="(orientation: landscape)"
        srcset="image/photo.svg"
        type="image/svg+xml" />
    <img class="photo" src="image/photo.svg" alt="ph" />
</picture>
<img src="image/logo.svg" class="logo" alt="logo" />
<!-- {/if} -->
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
<div class="title__plane">
    {#each $photoseries as seriya, index (index)}
        <div class="title">
            <h3 class="titleH3">{seriya.Title}</h3>
        </div>
    {/each}
</div>
<div bind:this={webgl} id="curtains" />
