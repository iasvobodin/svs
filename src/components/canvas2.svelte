<script>
    import {
        Curtains,
        Plane,
        Vec3,
        Vec2,
        TextureLoader,
    } from "curtainsjs/src/index.mjs";
    import anime from "animejs";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    import vertexT from "assets/start.vert";
    import fragmentT from "assets/start.frag";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        startAnimationPage,
        eventAnimation,
        photoseries,
        leaveIndex,
        leaveRoute,
        titlePlaneLoad,
    } from "store.js";
    import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
    import { goto, stores, start } from "@sapper/app";
    const { page } = stores();
    console.log($page.params.Route);
    $: pageslug = $page.params.Route;
    // SORT PHOTOSERIES
    onMount(() => {
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
        });
        const planeElements = document.getElementsByClassName("plane");
        const planeElementsTitle = document.getElementsByClassName("titleH3");
        startAnimation1();
        addPlane(planeElements);
        addTitlePlane(planeElementsTitle);
        const portrait = window.matchMedia("(orientation: portrait)");
        handlePortrait(portrait);
        portrait.addEventListener("change", handlePortrait);
        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        transVec = new Vec3();
        // startAnimate();
        translateSlider();
        const loader = new TextureLoader(curtains);
        // const images = [];
        console.time("create texture");
        $photoseries.forEach((el, i) => {
            // images.push(`/image/jpg/720/${el.FileName}.jpg`);
            loader.loadImage(
                `/image/jpg/480/${el.FileName}.jpg`,
                {
                    // texture options (we're only setting its sampler name here)
                    sampler: "planeTexture",
                },
                (texture) => {
                    // texture has been successfully created, you can safely use it
                    // console.log(texture);
                    texture.onSourceLoaded(() => {
                        texture.addParent(planes[i]);
                        load++;
                        console.log(load);
                        if (load === 1) {
                            // startAnimation1();
                        }
                        if (load === $photoseries.length) {
                            startAnim();
                        }
                    });
                },
                (image, error) => {
                    // there has been an error while loading the image
                }
            );
        });
        console.timeEnd("create texture");
    });
    onMount(() => {
        start({
            target: document.querySelector("#sapper"),
        }).then(() => {
            console.log("клиентское приложение запустилось");
        });
    });
    $: if (pageslug) {
        const object = $photoseries.find((el) => el.Route === pageslug);
        photoseries.update((n) => [
            ...n.slice(object.Id),
            ...n.slice(0, object.Id),
        ]);
    }
    // VARIABLE DATA
    let clickDown = "",
        toIndex,
        toRoute,
        clickUp = "",
        curtains,
        webgl,
        planesTitle = [],
        planes = [],
        activePlane,
        activePlaneTitle,
        translation = 0,
        currentPosition = 0,
        animationFrame = null,
        startAnimationOpacity = false,
        startPosition = 0,
        endPosition = 0,
        changeOpacity,
        mousePosition = 0,
        moveSpeed = 3,
        transVec,
        radius = null,
        elWidth,
        aspect = 0,
        startTransitionDone = false,
        startAnimation = null,
        startAnimationStage1,
        isTrackpad = true,
        isMouseDown = false,
        isTranslating = false,
        previousTranslation = { x: 0 },
        calcCords = {},
        customCorr = 0,
        angleStep = (Math.PI * 2) / $photoseries.length,
        step = Math.PI / 2 - angleStep,
        load = 0,
        startTransition = {
            opacityPlane: 1,
            time: 0,
            radiusAnimation: 0,
            scalePlane: 0.015,
            yRoundDisable: 1,
            zRoundEnable: 0,
        };

    $: if ($leaveIndex) {
        toRouteAnim(activePlane);
    }
    $: if ($leaveRoute) {
        toIndexAnim(activePlane);
    }
    $: transitionPage = $leaveIndex || $leaveRoute;

    $: if (pageslug) {
        afterUpdate(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
                $titlePlaneLoad &&
                    (activePlaneTitle =
                        planesTitle[activePlane.index + photoseries.length]);
            }
        });
        onMount(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
                $titlePlaneLoad &&
                    (activePlaneTitle =
                        planesTitle[activePlane.index + photoseries.length]);
            }
            startTransition = {
                opacityHedline: 0,
                opacityPlane: 1,
                time: 0,
                radiusAnimation: radius,
                scalePlane: 1,
                yRoundDisable: 0,
                zRoundEnable: 1,
            };
            activePlane.setScale(
                new Vec2(startTransition.scalePlane, startTransition.scalePlane)
            );
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
            uniforms: {
                uOpacityTitle: { name: "uOpacityTitle", type: "1f", value: 1 },
            },
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
        const paramsPlane = {
            widthSegments: 16,
            heightSegments: 16,
            vertexShader: vertex,
            // fragmentShader: fragment,
            // visible: 0,
            autoloadSources: false,
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
        console.time("create Plane");
        [...planeElement].forEach((element, i) => {
            const plane = new Plane(curtains, element, {
                ...paramsPlane,
                fragmentShader: fragment,
            });
            plane.userData = {
                route: element.dataset.route,
                color: element.dataset.color,
                id: element.dataset.id,
            };
            plane.setScale(
                new Vec2(startTransition.scalePlane, startTransition.scalePlane)
            );
            planes.push(plane);
        });
        console.timeEnd("create Plane");

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
        if (e.matches) {
            // PORTAIT
            if (!pageslug) {
                startTransition.radiusAnimation = Math.min(
                    (window.innerHeight * 0.0725) / 1.3882 / 2,
                    100
                );
            }
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
            if (!pageslug) {
                startTransition.radiusAnimation = Math.min(
                    (window.innerWidth * 0.0755) / 1.3882 / 2,
                    100
                );
            }
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

    function toRouteAnim(activePlane) {
        !activePlane &&
            (activePlane = planes.find((p) => p.userData.route === pageslug));
        !activePlane.isDrawn() && customCorrection(activePlane.index);

        toRoute = anime({
            targets: [activePlane.uniforms.uProgress, startTransition],
            duration: 1400,
            autoplay: false,
            value: 1,
            opacityPlane: [1, 0],
            easing: "easeOutQuad",
            changeComplete: () => {
                leaveIndex.set(false);
            },
            changeBegin: () => {
                activePlane.relativeTranslation.z = radius + 10;
                getUnifors(activePlane);
                eventAnimation.set(false);
            },
        });
        toRoute.finished.then(() => (toRoute = null));
    }
    function toIndexAnim(activePlane) {
        // const currentScroll = { value: window.pageYOffset };
        getUnifors(activePlane, {
            pCorr: true,
            sCorr: false,
            fCorr: false,
        });
        toIndex = anime
            .timeline()
            // .add({
            //     targets: currentScroll,
            //     value: 0,
            //     easing: "easeInSine",
            //     duration: 350,
            //     update: () => {
            //         window.scrollTo(0, currentScroll.value);
            //     },
            // })
            .add({
                targets: [activePlane.uniforms.uProgress, startTransition],
                duration: 1400,
                autoplay: false,
                value: 0,
                opacityPlane: [0, 1],
                easing: "easeInSine",
                changeComplete: () => {
                    leaveRoute.set(false);
                    eventAnimation.set(true);
                    startTransitionDone = true;
                    currentPosition = endPosition = translation;
                },
            });
        toIndex.finished.then(() => (toIndex = null));
    }
    function startAnimation0() {
        anime({
            targets: startTransition,
            duration: 4000,
            easing: "linear",
            time: `+=${Math.PI * 4}`,
            changeComplete: () => {
                if (load < $photoseries.length) {
                    startAnimation1();
                }
            },
        });
    }
    function startAnimation1() {
        startAnimationStage1 = anime({
            targets: startTransition,
            autoplay: false,
            // loop: 2,
            duration: 4000,
            easing: "linear",
            time: `+=${Math.PI * 4}`,
            changeBegin: () => {
                console.log("animStart");
            },
        });
        if (startAnimationStage1) {
            startAnimationStage1.play();
            startAnimationStage1.finished.then(() => {
                console.log(
                    $photoseries.length,
                    "ANIMATION NEEED PROMISE",
                    load
                );
                if (load < $photoseries.length) {
                    startAnimation1();
                }
            });
        }
    }
    function startAnimate() {
        if (!pageslug) {
            startAnimationPage.set(true);
            startAnimation = anime
                .timeline({
                    autoplay: false,
                })
                // .add({
                //     targets: startTransition,
                //     duration: 4500,
                //     easing: "easeOutSine",
                //     time: Math.PI * 4,
                //     changeComplete: () => {
                //         // startAnimationPage.set(false);
                //         // startTransitionDone = true;
                //         // planes.forEach((plane) => {
                //         //     if (plane.relativeTranslation.z < 0) {
                //         //         plane.visible = 0;
                //         //     }
                //         //     if (plane.uniforms.uOpacity.value < 1) {
                //         //         plane.uniforms.uOpacity.value = 1;
                //         //     }
                //         // });
                //     },
                // })
                .add(
                    {
                        changeBegin: () => {
                            if (startAnimationStage1) {
                                startAnimationStage1.pause();
                            }
                        },
                        targets: startTransition,
                        duration: 2500,
                        time: `+=${
                            Math.PI * 2 - (startTransition.time % (Math.PI * 2))
                        }`,
                        easing: "easeOutSine",
                    },
                    4000
                )
                .add(
                    {
                        duration: 2000,
                        targets: [
                            startTransition,
                            ".svobodina",
                            ".photo",
                            ".logo",
                        ],
                        opacity: [1, 0],
                        radiusAnimation: radius,
                        scalePlane: 1,
                        yRoundDisable: 0,
                        zRoundEnable: 1,
                        easing: "easeInOutSine",
                    },
                    0
                )
                .add(
                    {
                        duration: 500,
                        targets: startTransition,
                        opacityPlane: 0,
                        change: () => {
                            planes.forEach((plane, i) => {
                                if (plane.relativeTranslation.z < 0) {
                                    plane.uniforms.uOpacity.value =
                                        startTransition.opacityPlane;
                                }
                            });
                        },
                        easing: "linear",
                    },
                    2000
                );
        }
        startAnimation &&
            startAnimation.finished.then(() => {
                console.log("promis in start anim");
                startAnimationPage.set(false);
                startAnimation = null;
                startTransitionDone = true;
                planes.forEach((plane) => {
                    if (plane.relativeTranslation.z < 0) {
                        plane.visible = 0;
                    }
                    if (plane.uniforms.uOpacity.value < 1) {
                        plane.uniforms.uOpacity.value = 1;
                    }
                });
            });
    }
    function changeOpacityAnim(targetPlane, direction) {
        changeOpacity = anime({
            targets: targetPlane,
            [uniforms]uOpacity.value: direction,
            change: () => {
                planes.forEach((plane, i) => {
                    if (plane.relativeTranslation.z < 0) {
                        plane.uniforms.uOpacity.value =
                            startTransition.opacityPlane;
                    }
                });
            },
        });
    }
    function translateSlider(t) {
        curtains.render();
        $eventAnimation &&
            (translation += (currentPosition - translation) * 0.05);
        planes.forEach((plane, i) => {
            const angle = angleStep * i;

            if (
                plane.visible &&
                transitionPage &&
                plane.isDrawn() &&
                plane.index !== activePlane.index
            ) {
                plane.uniforms.uOpacity.value = startTransition.opacityPlane;
            }

            transVec.set(
                Math.cos(
                    angle +
                        step +
                        angleStep -
                        customCorr -
                        translation / 1300 +
                        startTransition.time
                ) * startTransition.radiusAnimation,
                // Y
                Math.cos(angle + startTransition.time) *
                    startTransition.radiusAnimation *
                    startTransition.yRoundDisable,
                // Z
                Math.sin(
                    angle +
                        step +
                        angleStep -
                        customCorr -
                        translation / 1300 +
                        startTransition.time
                ) *
                    startTransition.radiusAnimation *
                    startTransition.zRoundEnable
            );
            if ($eventAnimation) {
                plane.setScale(
                    new Vec2(
                        startTransition.scalePlane,
                        startTransition.scalePlane
                    )
                );
                plane.setRelativeTranslation(transVec);
            }
            if (!$startAnimationPage) {
                if ($titlePlaneLoad) {
                    planesTitle[i].setRelativeTranslation(transVec);
                    if (plane.relativeTranslation.z < 0) {
                        plane.visible = planesTitle[i].visible = false;
                    } else {
                        plane.visible = planesTitle[i].visible = true;
                    }
                    if (transitionPage) {
                        planesTitle[i].uniforms.uOpacityTitle.value =
                            startTransition.opacityPlane;
                    }
                }
            }
        });
        // START ANIMATION
        // if ($startAnimationPage) {
        startAnimation && startAnimation.tick(t);
        // }
        // ENTER PAGE ANIMATION
        // if ($leaveIndex) {
        toRoute && toRoute.tick(t);
        // }
        // LEAVE PAGE ANIMATION
        // if ($leaveRoute) {
        toIndex && toIndex.tick(t);
        // }

        animationFrame = requestAnimationFrame(translateSlider);
    }

    // EVENT CONTROLS
    function onPlaneClick(mouse) {
        planes.forEach((el, i) => {
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
            activePlane = el;
            activePlaneTitle = planesTitle[i];
            anime({
                targets: [activePlane.uniforms.uProgress, startTransition],
                duration: 1400,
                value: 1,
                opacityPlane: [1, 0],
                easing: "easeOutQuad",
                changeComplete: () => {
                    leaveIndex.set(false);
                },
                changeBegin: () => {
                    getUnifors(activePlane);
                    eventAnimation.set(false);
                },
            });

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
</script>

<!-- <div class="box" /> -->
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
        width: var(--plane__width);
        position: absolute;
        left: 50vw;
        transform: translate(-50%, 50%);
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
        /* font-style: italic; */
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
            height: clamp(18px, 3.5vw + 12px, 90px);
            bottom: calc((100vh - var(--plane__height)) / 4);
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
            /* opacity: 0; */
            position: fixed;
            width: min(60vw, 1600px);
            left: 50vw;
            top: 50vh;
            transform: translate(-50%, -200%);
        }
        /* 1.3882 */
        .photo {
            /* opacity: 0; */
            position: fixed;
            width: min(33.3vw, 889px);
            left: 50vw;
            top: 50vh;
            transform: translate(-52.8%, -64%);
        }
        .logo {
            /* opacity: 0; */
            width: 6vw;
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
            height: 4vh;
            bottom: calc((100vh - var(--plane__height)) / 4);
        }
        h3 {
            font-size: 4vh;
            /* line-height: clamp(18px, 3.5vh + 12px, 90px); */
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
            /* opacity: 0; */
            /* width: min(7vw, 100px); */
            height: 90vh;
            /* margin: auto; */
            top: 50vh;
            position: fixed;
            left: 50vw;
            transform: translate(-220%, -51.45%);
        }
        .photo {
            /* opacity: 0; */
            position: fixed;
            top: 50vh;
            height: 50vh;
            left: 50vw;
            transform: translate(-50%, -52.5%);
            /* right: calc(
      50vw + max(11vw, 100px) / 1.3882 / 2 + max(11vw, 100px) / 1.3882 / 10
    ); */
        }
        .logo {
            /* opacity: 0; */
            width: 15vw;
            height: auto;
            position: fixed;
            bottom: 4vh;
            right: 3vh;
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
    /* .box {
        background: orange;
        clip-path: circle(30.01%);
        transition: clip-path 1s;
        width: 100%;
        height: 100vh;
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
    .test__box {
        clip-path: inset(50% 0% 0px 0px);
        background: repeating-linear-gradient(red, orange 50px);
        height: auto;
        position: fixed;
        width: min(60vw, 1600px);
        left: 50vw;
        top: 50vh;
        transform: translate(-50%, -200%);
    }
</style>

<!-- <h1 style="color: white">I'm LAYOUT Canvas2</h1> -->
<!-- {#if !pageslug} -->
<div class="test__box">
    <!-- Generator: Adobe Illustrator 25.0.1, SVG Export Plug-In  -->
    <svg
        class="svobodina"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="1101.81px"
        height="161.2px"
        viewBox="0 0 1101.81 161.2"
        style="overflow:visible;enable-background:new 0 0 1101.81 161.2;"
        xml:space="preserve"><style type="text/css">
            .st0 {
                fill: none;
                stroke: #ffffff;
                stroke-miterlimit: 10;
            }
        </style>
        <defs />
        <g>
            <path
                class="st0"
                d="M58.73,69.9c-9.33-1.33-16.77-3.37-22.3-6.1c-5.53-2.73-9.5-6-11.9-9.8c-2.4-3.8-3.6-7.97-3.6-12.5
   c0-8.53,3.2-15.03,9.6-19.5c6.4-4.47,14.87-6.7,25.4-6.7c6,0.13,11.13,1,15.4,2.6c4.27,1.6,7.9,3.77,10.9,6.5
   c3,2.73,5.5,5.63,7.5,8.7c1.07,1.87,2.63,3.13,4.7,3.8c2.07,0.67,4.1,0.53,6.1-0.4c1.87-1.07,3.03-2.6,3.5-4.6
   c0.47-2,0.03-4.07-1.3-6.2c-2.8-4.53-6.43-8.7-10.9-12.5c-4.47-3.8-9.7-6.87-15.7-9.2c-6-2.33-12.67-3.5-20-3.5
   c-9.87,0-18.6,1.63-26.2,4.9c-7.6,3.27-13.57,7.9-17.9,13.9c-4.33,6-6.5,13.07-6.5,21.2c0,11.33,4.4,20.9,13.2,28.7
   c8.8,7.8,21,12.63,36.6,14.5c12.8,1.6,22.2,5.33,28.2,11.2c6,5.87,9,12.87,9,21c0,6.4-1.57,11.83-4.7,16.3
   c-3.13,4.47-7.43,7.87-12.9,10.2c-5.47,2.33-11.73,3.5-18.8,3.5c-6.4,0-12.27-0.83-17.6-2.5c-5.33-1.67-9.93-4.03-13.8-7.1
   c-3.87-3.07-6.8-6.53-8.8-10.4c-0.93-1.87-2.3-3.27-4.1-4.2c-1.8-0.93-3.63-1.13-5.5-0.6c-2.4,0.67-4.1,1.9-5.1,3.7
   s-0.97,3.77,0.1,5.9c2.8,6,6.87,11.27,12.2,15.8c5.33,4.53,11.63,8.03,18.9,10.5c7.27,2.47,15.17,3.7,23.7,3.7
   c7.2,0,13.97-1,20.3-3c6.33-2,11.87-4.9,16.6-8.7c4.73-3.8,8.4-8.5,11-14.1c2.6-5.6,3.9-12,3.9-19.2c0-12.53-4.03-22.7-12.1-30.5
   C87.76,77.4,75.39,72.3,58.73,69.9z" />
            <path
                class="st0"
                d="M223.72,49.9c-1.87-0.8-3.77-0.9-5.7-0.3c-1.93,0.6-3.3,1.83-4.1,3.7l-37.93,83.26L137.52,53.3
   c-0.93-1.73-2.27-2.93-4-3.6c-1.73-0.67-3.53-0.53-5.4,0.4c-2,0.93-3.33,2.27-4,4c-0.67,1.73-0.6,3.47,0.2,5.2l44.4,94.2
   c1.6,3.47,4,5.2,7.2,5.2c3.47,0,6-1.73,7.6-5.2l43.8-94.4c0.8-1.6,0.87-3.3,0.2-5.1C226.85,52.2,225.59,50.83,223.72,49.9z" />
            <path
                class="st0"
                d="M327.42,55.5c-8.33-4.8-17.83-7.2-28.5-7.2c-10.67,0-20.2,2.4-28.6,7.2c-8.4,4.8-15,11.4-19.8,19.8
   c-4.8,8.4-7.2,18-7.2,28.8c0,10.67,2.4,20.2,7.2,28.6c4.8,8.4,11.4,15,19.8,19.8c8.4,4.8,17.93,7.2,28.6,7.2
   c10.67,0,20.17-2.4,28.5-7.2c8.33-4.8,14.93-11.4,19.8-19.8c4.87-8.4,7.3-17.93,7.3-28.6c-0.13-10.8-2.6-20.4-7.4-28.8
   S335.75,60.3,327.42,55.5z M334.12,125.5c-3.47,6.27-8.27,11.2-14.4,14.8c-6.13,3.6-13.07,5.4-20.8,5.4c-7.73,0-14.67-1.8-20.8-5.4
   c-6.13-3.6-10.97-8.53-14.5-14.8c-3.53-6.27-5.3-13.4-5.3-21.4c0-8,1.77-15.17,5.3-21.5c3.53-6.33,8.37-11.3,14.5-14.9
   c6.13-3.6,13.07-5.4,20.8-5.4c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.93,8.57,14.4,14.9c3.47,6.33,5.2,13.5,5.2,21.5
   C339.32,112.1,337.59,119.23,334.12,125.5z" />
            <path
                class="st0"
                d="M469.32,55.6c-8.13-4.87-17.33-7.3-27.6-7.3c-8.93,0-17.03,1.9-24.3,5.7c-7.27,3.8-13.1,8.83-17.5,15.1V10.3
   c0-2.4-0.7-4.3-2.1-5.7c-1.4-1.4-3.23-2.1-5.5-2.1c-2.4,0-4.3,0.7-5.7,2.1s-2.1,3.3-2.1,5.7v94.4c0.13,10.4,2.63,19.77,7.5,28.1
   c4.87,8.33,11.47,14.9,19.8,19.7c8.33,4.8,17.7,7.2,28.1,7.2c10.67,0,20.2-2.43,28.6-7.3c8.4-4.87,15.03-11.5,19.9-19.9
   c4.87-8.4,7.3-17.93,7.3-28.6c0-10.53-2.37-20-7.1-28.4C483.89,67.1,477.45,60.47,469.32,55.6z M475.22,125.3
   c-3.53,6.27-8.37,11.23-14.5,14.9c-6.13,3.67-13.07,5.5-20.8,5.5c-7.6,0-14.47-1.83-20.6-5.5c-6.13-3.67-10.93-8.63-14.4-14.9
   c-3.47-6.27-5.2-13.4-5.2-21.4c0-7.87,1.73-14.97,5.2-21.3c3.47-6.33,8.27-11.3,14.4-14.9c6.13-3.6,13-5.4,20.6-5.4
   c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.97,8.57,14.5,14.9c3.53,6.33,5.3,13.43,5.3,21.3C480.52,111.9,478.75,119.03,475.22,125.3z
   " />
            <path
                class="st0"
                d="M604.22,55.5c-8.33-4.8-17.83-7.2-28.5-7.2c-10.67,0-20.2,2.4-28.6,7.2c-8.4,4.8-15,11.4-19.8,19.8
   c-4.8,8.4-7.2,18-7.2,28.8c0,10.67,2.4,20.2,7.2,28.6c4.8,8.4,11.4,15,19.8,19.8c8.4,4.8,17.93,7.2,28.6,7.2
   c10.67,0,20.17-2.4,28.5-7.2c8.33-4.8,14.93-11.4,19.8-19.8c4.87-8.4,7.3-17.93,7.3-28.6c-0.13-10.8-2.6-20.4-7.4-28.8
   S612.55,60.3,604.22,55.5z M610.92,125.5c-3.47,6.27-8.27,11.2-14.4,14.8c-6.13,3.6-13.07,5.4-20.8,5.4c-7.73,0-14.67-1.8-20.8-5.4
   c-6.13-3.6-10.97-8.53-14.5-14.8c-3.53-6.27-5.3-13.4-5.3-21.4c0-8,1.77-15.17,5.3-21.5c3.53-6.33,8.37-11.3,14.5-14.9
   c6.13-3.6,13.07-5.4,20.8-5.4c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.93,8.57,14.4,14.9c3.47,6.33,5.2,13.5,5.2,21.5
   C616.12,112.1,614.38,119.23,610.92,125.5z" />
            <path
                class="st0"
                d="M758.91,2.5c-2.27,0-4.13,0.7-5.6,2.1c-1.47,1.4-2.2,3.3-2.2,5.7v58.8c-4.4-6.27-10.2-11.3-17.4-15.1
   c-7.2-3.8-15.27-5.7-24.2-5.7c-10.27,0-19.47,2.43-27.6,7.3c-8.13,4.87-14.57,11.5-19.3,19.9c-4.73,8.4-7.1,17.87-7.1,28.4
   c0,10.67,2.43,20.2,7.3,28.6c4.87,8.4,11.5,15.03,19.9,19.9c8.4,4.87,17.87,7.3,28.4,7.3c10.4,0,19.77-2.4,28.1-7.2
   c8.33-4.8,14.93-11.37,19.8-19.7c4.87-8.33,7.43-17.7,7.7-28.1V10.3c0-2.4-0.73-4.3-2.2-5.7C763.05,3.2,761.18,2.5,758.91,2.5z
    M746.21,125.3c-3.53,6.27-8.33,11.23-14.4,14.9c-6.07,3.67-12.97,5.5-20.7,5.5c-7.6,0-14.47-1.83-20.6-5.5
   c-6.13-3.67-11-8.63-14.6-14.9c-3.6-6.27-5.4-13.4-5.4-21.4c0-7.87,1.8-14.97,5.4-21.3c3.6-6.33,8.47-11.3,14.6-14.9
   c6.13-3.6,13-5.4,20.6-5.4c7.73,0,14.63,1.8,20.7,5.4c6.07,3.6,10.87,8.57,14.4,14.9c3.53,6.33,5.3,13.43,5.3,21.3
   C751.51,111.9,749.75,119.03,746.21,125.3z" />
            <path
                class="st0"
                d="M821.21,9.6c-2.2-1.93-4.7-2.9-7.5-2.9c-2.93,0-5.5,0.97-7.7,2.9c-2.2,1.93-3.3,4.57-3.3,7.9
   c0,3.07,1.07,5.67,3.2,7.8c2.13,2.13,4.67,3.2,7.6,3.2c3.07,0,5.67-1.07,7.8-3.2c2.13-2.13,3.2-4.73,3.2-7.8
   C824.51,14.17,823.41,11.53,821.21,9.6z" />
            <path
                class="st0"
                d="M813.71,49.3c-2.4,0-4.3,0.7-5.7,2.1c-1.4,1.4-2.1,3.3-2.1,5.7v93.8c0,2.4,0.7,4.3,2.1,5.7
   c1.4,1.4,3.3,2.1,5.7,2.1c2.27,0,4.1-0.7,5.5-2.1c1.4-1.4,2.1-3.3,2.1-5.7V57.1c0-2.4-0.7-4.3-2.1-5.7
   C817.81,50,815.98,49.3,813.71,49.3z" />
            <path
                class="st0"
                d="M937.71,54c-7.47-3.93-15.93-5.9-25.4-5.9c-8.67,0-16.53,1.9-23.6,5.7c-4.96,2.67-9.22,6.04-12.8,10.09V57.1
   c0-2.4-0.7-4.3-2.1-5.7c-1.4-1.4-3.23-2.1-5.5-2.1c-2.4,0-4.3,0.7-5.7,2.1c-1.4,1.4-2.1,3.3-2.1,5.7v94c0,2.27,0.7,4.1,2.1,5.5
   c1.4,1.4,3.3,2.1,5.7,2.1c2.27,0,4.1-0.7,5.5-2.1c1.4-1.4,2.1-3.23,2.1-5.5V91.9c0-5.6,1.53-10.6,4.6-15
   c3.07-4.4,7.23-7.87,12.5-10.4c5.27-2.53,11.17-3.8,17.7-3.8c6.8,0,12.9,1.33,18.3,4c5.4,2.67,9.67,6.67,12.8,12
   c3.13,5.33,4.7,12.13,4.7,20.4v52c0,2.13,0.73,3.93,2.2,5.4c1.47,1.47,3.33,2.2,5.6,2.2c2.13,0,3.93-0.73,5.4-2.2
   c1.47-1.47,2.2-3.27,2.2-5.4v-52c0-10.93-2.17-20.2-6.5-27.8C951.07,63.7,945.17,57.93,937.71,54z" />
            <path
                class="st0"
                d="M1093.81,75.5c-4.87-8.4-11.47-15.03-19.8-19.9c-8.33-4.87-17.77-7.3-28.3-7.3c-10.53,0-20,2.43-28.4,7.3
   c-8.4,4.87-15.04,11.5-19.9,19.9c-4.87,8.4-7.3,17.93-7.3,28.6c0,10.54,2.37,20,7.1,28.4c4.73,8.4,11.17,15.03,19.3,19.9
   c8.13,4.87,17.33,7.3,27.6,7.3c9.73,0,18.43-2.23,26.1-6.7c6.23-3.63,11.38-8.33,15.5-14.08v12.17c0,2.27,0.73,4.1,2.2,5.5
   c1.47,1.4,3.33,2.1,5.6,2.1c2.27,0,4.13-0.7,5.6-2.1c1.47-1.4,2.2-3.23,2.2-5.5v-47C1101.17,93.43,1098.67,83.9,1093.81,75.5z
    M1066.41,140.3c-6.07,3.6-12.97,5.4-20.7,5.4c-7.6,0-14.47-1.8-20.6-5.4c-6.13-3.6-11-8.57-14.6-14.9
   c-3.6-6.33-5.4-13.43-5.4-21.3c0-8,1.8-15.13,5.4-21.4c3.6-6.27,8.47-11.23,14.6-14.9c6.13-3.67,13-5.5,20.6-5.5
   c7.73,0,14.63,1.83,20.7,5.5c6.07,3.67,10.87,8.63,14.4,14.9c3.53,6.27,5.3,13.4,5.3,21.4c0,7.87-1.77,14.97-5.3,21.3
   C1077.27,131.73,1072.47,136.7,1066.41,140.3z" />
        </g>
    </svg>
</div>
<!-- Generator: Adobe Illustrator 25.0.1, SVG Export Plug-In  -->
<svg
    class="test__box"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="1101.81px"
    height="161.2px"
    viewBox="0 0 1101.81 161.2"
    style="overflow:visible;enable-background:new 0 0 1101.81 161.2;"
    xml:space="preserve"><style type="text/css">
        .st0 {
            fill: none;
            stroke: #ffffff;
            stroke-miterlimit: 10;
        }
    </style>
    <defs />
    <g>
        <path
            class="st0"
            d="M58.73,69.9c-9.33-1.33-16.77-3.37-22.3-6.1c-5.53-2.73-9.5-6-11.9-9.8c-2.4-3.8-3.6-7.97-3.6-12.5
		c0-8.53,3.2-15.03,9.6-19.5c6.4-4.47,14.87-6.7,25.4-6.7c6,0.13,11.13,1,15.4,2.6c4.27,1.6,7.9,3.77,10.9,6.5
		c3,2.73,5.5,5.63,7.5,8.7c1.07,1.87,2.63,3.13,4.7,3.8c2.07,0.67,4.1,0.53,6.1-0.4c1.87-1.07,3.03-2.6,3.5-4.6
		c0.47-2,0.03-4.07-1.3-6.2c-2.8-4.53-6.43-8.7-10.9-12.5c-4.47-3.8-9.7-6.87-15.7-9.2c-6-2.33-12.67-3.5-20-3.5
		c-9.87,0-18.6,1.63-26.2,4.9c-7.6,3.27-13.57,7.9-17.9,13.9c-4.33,6-6.5,13.07-6.5,21.2c0,11.33,4.4,20.9,13.2,28.7
		c8.8,7.8,21,12.63,36.6,14.5c12.8,1.6,22.2,5.33,28.2,11.2c6,5.87,9,12.87,9,21c0,6.4-1.57,11.83-4.7,16.3
		c-3.13,4.47-7.43,7.87-12.9,10.2c-5.47,2.33-11.73,3.5-18.8,3.5c-6.4,0-12.27-0.83-17.6-2.5c-5.33-1.67-9.93-4.03-13.8-7.1
		c-3.87-3.07-6.8-6.53-8.8-10.4c-0.93-1.87-2.3-3.27-4.1-4.2c-1.8-0.93-3.63-1.13-5.5-0.6c-2.4,0.67-4.1,1.9-5.1,3.7
		s-0.97,3.77,0.1,5.9c2.8,6,6.87,11.27,12.2,15.8c5.33,4.53,11.63,8.03,18.9,10.5c7.27,2.47,15.17,3.7,23.7,3.7
		c7.2,0,13.97-1,20.3-3c6.33-2,11.87-4.9,16.6-8.7c4.73-3.8,8.4-8.5,11-14.1c2.6-5.6,3.9-12,3.9-19.2c0-12.53-4.03-22.7-12.1-30.5
		C87.76,77.4,75.39,72.3,58.73,69.9z" />
        <path
            class="st0"
            d="M223.72,49.9c-1.87-0.8-3.77-0.9-5.7-0.3c-1.93,0.6-3.3,1.83-4.1,3.7l-37.93,83.26L137.52,53.3
		c-0.93-1.73-2.27-2.93-4-3.6c-1.73-0.67-3.53-0.53-5.4,0.4c-2,0.93-3.33,2.27-4,4c-0.67,1.73-0.6,3.47,0.2,5.2l44.4,94.2
		c1.6,3.47,4,5.2,7.2,5.2c3.47,0,6-1.73,7.6-5.2l43.8-94.4c0.8-1.6,0.87-3.3,0.2-5.1C226.85,52.2,225.59,50.83,223.72,49.9z" />
        <path
            class="st0"
            d="M327.42,55.5c-8.33-4.8-17.83-7.2-28.5-7.2c-10.67,0-20.2,2.4-28.6,7.2c-8.4,4.8-15,11.4-19.8,19.8
		c-4.8,8.4-7.2,18-7.2,28.8c0,10.67,2.4,20.2,7.2,28.6c4.8,8.4,11.4,15,19.8,19.8c8.4,4.8,17.93,7.2,28.6,7.2
		c10.67,0,20.17-2.4,28.5-7.2c8.33-4.8,14.93-11.4,19.8-19.8c4.87-8.4,7.3-17.93,7.3-28.6c-0.13-10.8-2.6-20.4-7.4-28.8
		S335.75,60.3,327.42,55.5z M334.12,125.5c-3.47,6.27-8.27,11.2-14.4,14.8c-6.13,3.6-13.07,5.4-20.8,5.4c-7.73,0-14.67-1.8-20.8-5.4
		c-6.13-3.6-10.97-8.53-14.5-14.8c-3.53-6.27-5.3-13.4-5.3-21.4c0-8,1.77-15.17,5.3-21.5c3.53-6.33,8.37-11.3,14.5-14.9
		c6.13-3.6,13.07-5.4,20.8-5.4c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.93,8.57,14.4,14.9c3.47,6.33,5.2,13.5,5.2,21.5
		C339.32,112.1,337.59,119.23,334.12,125.5z" />
        <path
            class="st0"
            d="M469.32,55.6c-8.13-4.87-17.33-7.3-27.6-7.3c-8.93,0-17.03,1.9-24.3,5.7c-7.27,3.8-13.1,8.83-17.5,15.1V10.3
		c0-2.4-0.7-4.3-2.1-5.7c-1.4-1.4-3.23-2.1-5.5-2.1c-2.4,0-4.3,0.7-5.7,2.1s-2.1,3.3-2.1,5.7v94.4c0.13,10.4,2.63,19.77,7.5,28.1
		c4.87,8.33,11.47,14.9,19.8,19.7c8.33,4.8,17.7,7.2,28.1,7.2c10.67,0,20.2-2.43,28.6-7.3c8.4-4.87,15.03-11.5,19.9-19.9
		c4.87-8.4,7.3-17.93,7.3-28.6c0-10.53-2.37-20-7.1-28.4C483.89,67.1,477.45,60.47,469.32,55.6z M475.22,125.3
		c-3.53,6.27-8.37,11.23-14.5,14.9c-6.13,3.67-13.07,5.5-20.8,5.5c-7.6,0-14.47-1.83-20.6-5.5c-6.13-3.67-10.93-8.63-14.4-14.9
		c-3.47-6.27-5.2-13.4-5.2-21.4c0-7.87,1.73-14.97,5.2-21.3c3.47-6.33,8.27-11.3,14.4-14.9c6.13-3.6,13-5.4,20.6-5.4
		c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.97,8.57,14.5,14.9c3.53,6.33,5.3,13.43,5.3,21.3C480.52,111.9,478.75,119.03,475.22,125.3z
		" />
        <path
            class="st0"
            d="M604.22,55.5c-8.33-4.8-17.83-7.2-28.5-7.2c-10.67,0-20.2,2.4-28.6,7.2c-8.4,4.8-15,11.4-19.8,19.8
		c-4.8,8.4-7.2,18-7.2,28.8c0,10.67,2.4,20.2,7.2,28.6c4.8,8.4,11.4,15,19.8,19.8c8.4,4.8,17.93,7.2,28.6,7.2
		c10.67,0,20.17-2.4,28.5-7.2c8.33-4.8,14.93-11.4,19.8-19.8c4.87-8.4,7.3-17.93,7.3-28.6c-0.13-10.8-2.6-20.4-7.4-28.8
		S612.55,60.3,604.22,55.5z M610.92,125.5c-3.47,6.27-8.27,11.2-14.4,14.8c-6.13,3.6-13.07,5.4-20.8,5.4c-7.73,0-14.67-1.8-20.8-5.4
		c-6.13-3.6-10.97-8.53-14.5-14.8c-3.53-6.27-5.3-13.4-5.3-21.4c0-8,1.77-15.17,5.3-21.5c3.53-6.33,8.37-11.3,14.5-14.9
		c6.13-3.6,13.07-5.4,20.8-5.4c7.73,0,14.67,1.8,20.8,5.4c6.13,3.6,10.93,8.57,14.4,14.9c3.47,6.33,5.2,13.5,5.2,21.5
		C616.12,112.1,614.38,119.23,610.92,125.5z" />
        <path
            class="st0"
            d="M758.91,2.5c-2.27,0-4.13,0.7-5.6,2.1c-1.47,1.4-2.2,3.3-2.2,5.7v58.8c-4.4-6.27-10.2-11.3-17.4-15.1
		c-7.2-3.8-15.27-5.7-24.2-5.7c-10.27,0-19.47,2.43-27.6,7.3c-8.13,4.87-14.57,11.5-19.3,19.9c-4.73,8.4-7.1,17.87-7.1,28.4
		c0,10.67,2.43,20.2,7.3,28.6c4.87,8.4,11.5,15.03,19.9,19.9c8.4,4.87,17.87,7.3,28.4,7.3c10.4,0,19.77-2.4,28.1-7.2
		c8.33-4.8,14.93-11.37,19.8-19.7c4.87-8.33,7.43-17.7,7.7-28.1V10.3c0-2.4-0.73-4.3-2.2-5.7C763.05,3.2,761.18,2.5,758.91,2.5z
		 M746.21,125.3c-3.53,6.27-8.33,11.23-14.4,14.9c-6.07,3.67-12.97,5.5-20.7,5.5c-7.6,0-14.47-1.83-20.6-5.5
		c-6.13-3.67-11-8.63-14.6-14.9c-3.6-6.27-5.4-13.4-5.4-21.4c0-7.87,1.8-14.97,5.4-21.3c3.6-6.33,8.47-11.3,14.6-14.9
		c6.13-3.6,13-5.4,20.6-5.4c7.73,0,14.63,1.8,20.7,5.4c6.07,3.6,10.87,8.57,14.4,14.9c3.53,6.33,5.3,13.43,5.3,21.3
		C751.51,111.9,749.75,119.03,746.21,125.3z" />
        <path
            class="st0"
            d="M821.21,9.6c-2.2-1.93-4.7-2.9-7.5-2.9c-2.93,0-5.5,0.97-7.7,2.9c-2.2,1.93-3.3,4.57-3.3,7.9
		c0,3.07,1.07,5.67,3.2,7.8c2.13,2.13,4.67,3.2,7.6,3.2c3.07,0,5.67-1.07,7.8-3.2c2.13-2.13,3.2-4.73,3.2-7.8
		C824.51,14.17,823.41,11.53,821.21,9.6z" />
        <path
            class="st0"
            d="M813.71,49.3c-2.4,0-4.3,0.7-5.7,2.1c-1.4,1.4-2.1,3.3-2.1,5.7v93.8c0,2.4,0.7,4.3,2.1,5.7
		c1.4,1.4,3.3,2.1,5.7,2.1c2.27,0,4.1-0.7,5.5-2.1c1.4-1.4,2.1-3.3,2.1-5.7V57.1c0-2.4-0.7-4.3-2.1-5.7
		C817.81,50,815.98,49.3,813.71,49.3z" />
        <path
            class="st0"
            d="M937.71,54c-7.47-3.93-15.93-5.9-25.4-5.9c-8.67,0-16.53,1.9-23.6,5.7c-4.96,2.67-9.22,6.04-12.8,10.09V57.1
		c0-2.4-0.7-4.3-2.1-5.7c-1.4-1.4-3.23-2.1-5.5-2.1c-2.4,0-4.3,0.7-5.7,2.1c-1.4,1.4-2.1,3.3-2.1,5.7v94c0,2.27,0.7,4.1,2.1,5.5
		c1.4,1.4,3.3,2.1,5.7,2.1c2.27,0,4.1-0.7,5.5-2.1c1.4-1.4,2.1-3.23,2.1-5.5V91.9c0-5.6,1.53-10.6,4.6-15
		c3.07-4.4,7.23-7.87,12.5-10.4c5.27-2.53,11.17-3.8,17.7-3.8c6.8,0,12.9,1.33,18.3,4c5.4,2.67,9.67,6.67,12.8,12
		c3.13,5.33,4.7,12.13,4.7,20.4v52c0,2.13,0.73,3.93,2.2,5.4c1.47,1.47,3.33,2.2,5.6,2.2c2.13,0,3.93-0.73,5.4-2.2
		c1.47-1.47,2.2-3.27,2.2-5.4v-52c0-10.93-2.17-20.2-6.5-27.8C951.07,63.7,945.17,57.93,937.71,54z" />
        <path
            class="st0"
            d="M1093.81,75.5c-4.87-8.4-11.47-15.03-19.8-19.9c-8.33-4.87-17.77-7.3-28.3-7.3c-10.53,0-20,2.43-28.4,7.3
		c-8.4,4.87-15.04,11.5-19.9,19.9c-4.87,8.4-7.3,17.93-7.3,28.6c0,10.54,2.37,20,7.1,28.4c4.73,8.4,11.17,15.03,19.3,19.9
		c8.13,4.87,17.33,7.3,27.6,7.3c9.73,0,18.43-2.23,26.1-6.7c6.23-3.63,11.38-8.33,15.5-14.08v12.17c0,2.27,0.73,4.1,2.2,5.5
		c1.47,1.4,3.33,2.1,5.6,2.1c2.27,0,4.13-0.7,5.6-2.1c1.47-1.4,2.2-3.23,2.2-5.5v-47C1101.17,93.43,1098.67,83.9,1093.81,75.5z
		 M1066.41,140.3c-6.07,3.6-12.97,5.4-20.7,5.4c-7.6,0-14.47-1.8-20.6-5.4c-6.13-3.6-11-8.57-14.6-14.9
		c-3.6-6.33-5.4-13.43-5.4-21.3c0-8,1.8-15.13,5.4-21.4c3.6-6.27,8.47-11.23,14.6-14.9c6.13-3.67,13-5.5,20.6-5.5
		c7.73,0,14.63,1.83,20.7,5.5c6.07,3.67,10.87,8.63,14.4,14.9c3.53,6.27,5.3,13.4,5.3,21.4c0,7.87-1.77,14.97-5.3,21.3
		C1077.27,131.73,1072.47,136.7,1066.41,140.3z" />
    </g>
</svg>

<picture>
    <!-- <source
        media="(orientation: portrait)"
        srcset="image/photoPortrait.svg"
        type="image/svg+xml" />
    <source
        media="(orientation: landscape)"
        srcset="image/photo.svg"
        type="image/svg+xml" /> -->
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
        <a style="display: none;" href="blog/{seriya.Route}">ф</a>
        <div
            data-id={index}
            data-route={seriya.Route}
            data-color={[seriya.ColorVector]}
            class="plane">
            <!-- <picture class="standart__picture">
                <source
                    media="(orientation: portrait)"
                    srcset="/image/webp/720/{seriya.Portrait}.webp"
                    type="image/webp" />
                <source
                    media="(orientation: landscape)"
                    srcset="/image/webp/720/{seriya.FileName}.webp"
                    type="image/webp" />

                <img
                    data-sampler="planeTexture"
                    class="slider__img"
                    alt="SvobodinaPhoto"
                    crossorigin="anonimous"
                    decoding="async"
                    draggable="false"
                    src="/image/jpg/720/{seriya.FileName}.jpg" />
            </picture> -->
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
