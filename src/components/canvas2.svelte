<script>
    import {
        Curtains,
        Plane,
        Vec3,
        Vec2,
        TextureLoader,
    } from "curtainsjs/src/index.mjs";
    import anime from "animejs";
    import { tweened } from "svelte/motion";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    import vertexT from "assets/start.vert";
    import fragmentT from "assets/start.frag";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        homePageState,
        eventAnimation,
        photoseries,
        leaveIndex,
        leaveRoute,
        titlePlaneOnLoad,
    } from "store.js";
    import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
    import { goto, stores, start } from "@sapper/app";
    import { sineOut } from "svelte/easing";
    //INIT BEFORE MOUNT
    const { page } = stores();
    $: pageslug = $page.params.Route;
    const progress = tweened(0, {
        duration: 500,
        easing: sineOut,
    });

    // VARIABLE DATA

    let curtains,
        webgl,
        planesTitle = [],
        planes = [],
        activePlane,
        activePlaneTitle,
        toIndex,
        toRoute,
        toInvisible,
        animationFrame = null,
        changeOpacity,
        transVec = new Vec3(),
        radius = null,
        elWidth,
        aspect = 0,
        startAnimation = null,
        isTrackpad = true,
        calcCords = {},
        angleStep = (Math.PI * 2) / $photoseries.length,
        step = Math.PI / 2 - angleStep,
        load = 0,
        sliderState = {
            clickDown: "",
            clickUp: "",
            translation: 0,
            currentPosition: 0,
            planeCorrection: 0,
            isMouseDown: false,
            startPosition: 0,
            endPosition: 0,
            mousePosition: 0,
            moveSpeed: 3,
        },
        transitionState = {
            opacityPlane: 1,
            time: 0,
            radiusAnimation: 0,
            scalePlane: 0.015,
            yRoundDisable: 1,
            zRoundEnable: 0,
        };

    onMount(() => {
        initCurtains();
        addPlane();
        addTexture();
        addTitlePlane();
        initMatchMedia();

        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        translateSlider();
    });

    $: $leaveIndex && toRouteAnim(activePlane);
    $: $leaveRoute && toIndexAnim(activePlane);
    $: animationState = !!startAnimation || !!toRoute || !!toIndex;
    $: transitionPage = $leaveIndex || $leaveRoute;

    $: if (pageslug) {
        // SORT PHOTOSERIES
        const object = $photoseries.find((el) => el.Route === pageslug);
        photoseries.update((n) => [
            ...n.slice(object.Id),
            ...n.slice(0, object.Id),
        ]);
        eventAnimation.set(false);
        onMount(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
                console.log(activePlane);
                $titlePlaneOnLoad &&
                    (activePlaneTitle =
                        planesTitle[activePlane.index + photoseries.length]);
            }
            transitionState = {
                opacityHedline: 0,
                opacityPlane: 1,
                time: 0,
                radiusAnimation: radius,
                scalePlane: 1,
                yRoundDisable: 0,
                zRoundEnable: 1,
            };
            activePlane.setScale(
                new Vec2(transitionState.scalePlane, transitionState.scalePlane)
            );

            activePlane.visible = 1;
            activePlane.uniforms.uProgress.value = 1;
            curtains.needRender();
        });
    }
    // else {
    //     onMount(() => {
    //     curtains = new Curtains({
    //         container: webgl,
    //         pixelRatio: Math.min(1.5, window.devicePixelRatio),
    //         production: process.env.NODE_ENV !== "development",
    //         autoRender: false,
    //     });
    //     const planeElements = document.getElementsByClassName("plane");
    //     const planeElementsTitle = document.getElementsByClassName("titleH3");

    //     addPlane(planeElements);
    //     addTexture();
    //     addTitlePlane(planeElementsTitle);
    //     const portrait = window.matchMedia("(orientation: portrait)");
    //     handlePortrait(portrait);
    //     portrait.addEventListener("change", handlePortrait);
    //     radius =
    //         elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
    //     transVec = new Vec3();
    //     translateSlider();
    // });
    // }

    // INIT
    function initCurtains() {
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
        });
    }
    function addTitlePlane() {
        const planeElementTitle = document.getElementsByClassName("titleH3");
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
            titlePlaneOnLoad.set(true);
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
    function addPlane(trPlane = false) {
        const planeElement = document.getElementsByClassName("plane");
        const paramsPlane = {
            widthSegments: 16,
            heightSegments: 16,
            vertexShader: vertex,
            // fragmentShader: fragment,
            visible: 0,
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
                new Vec2(transitionState.scalePlane, transitionState.scalePlane)
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
    function addTexture() {
        const loader = new TextureLoader(curtains);
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
                        planes[i].visible = 1;
                        texture.addParent(planes[i]);
                        progress.update((n) => n + 1);
                        load++;
                        console.log($progress, "$progress");
                        if (load === 1) {
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
    function initMatchMedia() {
        const portrait = window.matchMedia("(orientation: portrait)");
        handlePortrait(portrait);
        portrait.addEventListener("change", handlePortrait);
    }
    function customCorrection(coef) {
        const angle = (Math.PI * 2) / $photoseries.length;
        sliderState.planeCorrection = angleStep * coef;
        sliderState.translation = 0;
        sliderState.currentPosition = 0;
        sliderState.endPosition = 0;
        // anime({
        //     targets: sliderState,
        //     duration: 500,
        //     planeCorrection: angleStep * coef,
        //     translation: 0,
        //     currentPosition: 0,
        //     endPosition: 0,
        //     easing: "linear",
        // });
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
                transitionState.radiusAnimation = Math.min(
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
                transitionState.radiusAnimation = Math.min(
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
    function startAnim() {
        if (pageslug) return;
        // homePageState.set(true);
        startAnimation = anime
            .timeline({
                autoplay: false,
            })
            .add({
                update: () => {
                    console.log("startAnim()");
                },
                targets: transitionState,
                duration: 4500,
                easing: "easeOutSine",
                time: Math.PI * 4,
            })
            .add(
                {
                    duration: 2000,
                    targets: [transitionState, ".svobodina", ".photo", ".logo"],
                    opacity: [1, 0],
                    radiusAnimation: radius,
                    scalePlane: 1,
                    yRoundDisable: 0,
                    zRoundEnable: 1,
                    easing: "easeInOutSine",
                },
                2000
            )
            .add(
                {
                    duration: 500,
                    targets: transitionState,
                    opacityPlane: 0,
                    change: () => {
                        // planes.forEach((plane, i) => {
                        //     if (plane.relativesliderState.Translation.z < 0) {
                        //         plane.uniforms.uOpacity.value =
                        //             transitionState.opacityPlane;
                        //     }
                        // });
                    },
                    easing: "linear",
                },
                4000
            );
        startAnimation &&
            startAnimation.finished.then(() => {
                homePageState.set(true);
                startAnimation = null;
            });
    }

    function toInvisibleAnim(target) {
        toInvisible = anime({
            targets: [activePlane.uniforms.uProgress, transitionState],
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
        toInvisible.finished.then(() => (toInvisible = null));
    }

    function toRouteAnim(activePlane) {
        // debugger;
        console.log("animation to route init");
        if (!activePlane) {
            activePlane = planes.find((p) => p.userData.route === pageslug);
        }
        if (!activePlane.isDrawn()) {
            customCorrection(activePlane.index);
        }
        // !activePlane.isDrawn() && ;
        // !activePlane &&
        //     (activePlane = planes.find((p) => p.userData.route === pageslug));
        activePlane.relativeTranslation.z = radius + 10;

        toRoute = anime({
            targets: [activePlane.uniforms.uProgress, transitionState],
            duration: 1400,
            autoplay: false,
            value: 1,
            opacityPlane: [1, 0],
            easing: "easeOutQuad",
            changeComplete: () => {},
            changeBegin: () => {
                getUnifors(activePlane);
                console.log("animation to route");
                // eventAnimation.set(false);
            },
        });
        toRoute.finished.then(() => {
            console.log("promise cancel leaveindex");
            toRoute = null;
            leaveIndex.set(false);
        });
    }
    function toIndexAnim(activePlane) {
        console.log(activePlane);
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
                targets: [activePlane.uniforms.uProgress, transitionState],
                duration: 1400,
                autoplay: false,
                value: 0,
                opacityPlane: [0, 1],
                easing: "easeInSine",
                changeComplete: () => {},
            });
        toIndex.finished.then(() => {
            toIndex = null;
            leaveRoute.set(false);
            eventAnimation.set(true);
            sliderState.currentPosition = sliderState.endPosition =
                sliderState.translation;
            !$homePageState && homePageState.set(true);
        });
    }

    // function changeOpacityAnim(targetPlane, direction) {
    //     changeOpacity = anime({
    //         targets: targetPlane,
    //         [uniforms]uOpacity.value: direction,
    //         change: () => {
    //             planes.forEach((plane, i) => {
    //                 if (plane.relativesliderState.Translation.z < 0) {
    //                     plane.uniforms.uOpacity.value =
    //                         transitionState.opacityPlane;
    //                 }
    //             });
    //         },
    //     });
    // }
    function translateSlider(t) {
        curtains.render();
        $eventAnimation &&
            (sliderState.translation +=
                (sliderState.currentPosition - sliderState.translation) * 0.05);
        planes.forEach((plane, i) => {
            const angle = angleStep * i;

            // if (
            //     plane.visible &&
            //     transitionPage &&
            //     plane.isDrawn() &&
            //     plane.index !== activePlane.index
            // ) {
            //     plane.uniforms.uOpacity.value = transitionState.opacityPlane;
            // }

            transVec.set(
                Math.cos(
                    angle +
                        step +
                        angleStep -
                        sliderState.planeCorrection -
                        sliderState.translation / 1300 +
                        transitionState.time
                ) * transitionState.radiusAnimation,
                // Y
                Math.cos(angle + transitionState.time) *
                    transitionState.radiusAnimation *
                    transitionState.yRoundDisable,
                // Z
                Math.sin(
                    angle +
                        step +
                        angleStep -
                        sliderState.planeCorrection -
                        sliderState.translation / 1300 +
                        transitionState.time
                ) *
                    transitionState.radiusAnimation *
                    transitionState.zRoundEnable
            );
            if ($eventAnimation) {
                plane.setScale(
                    new Vec2(
                        transitionState.scalePlane,
                        transitionState.scalePlane
                    )
                );
                plane.setRelativeTranslation(transVec);
            }
            $titlePlaneOnLoad &&
                planesTitle[i].setRelativeTranslation(transVec);

            if ($homePageState && $titlePlaneOnLoad && !animationState) {
                if (plane.relativeTranslation.z < 0) {
                    plane.visible = planesTitle[i].visible = false;
                } else {
                    plane.visible = planesTitle[i].visible = true;
                }
            }

            // if (transitionPage) {
            //     planesTitle[i].uniforms.uOpacityTitle.value =
            //         transitionState.opacityPlane;
            // }
            // }
        });
        // START ANIMATION

        startAnimation && startAnimation.tick(t);

        toRoute && toRoute.tick(t);

        toIndex && toIndex.tick(t);

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
            // anime({
            //     targets: [activePlane.uniforms.uProgress, transitionState],
            //     duration: 1400,
            //     value: 1,
            //     opacityPlane: [1, 0],
            //     easing: "easeOutQuad",
            //     changeComplete: () => {
            //         leaveIndex.set(false);
            //     },
            //     changeBegin: () => {
            //         getUnifors(activePlane);
            //         eventAnimation.set(false);
            //     },
            // });

            goto(`/${el.userData.route}`);
        });
    }
    function onMouseDown(e) {
        if ($eventAnimation) {
            sliderState.isMouseDown = true;
            sliderState.clickDown = getMousePosition(e);
            sliderState.startPosition = sliderState.clickDown[0];
        }
    }
    function onMouseMove(e) {
        if (!sliderState.isMouseDown) return;
        sliderState.mousePosition = getMousePosition(e);
        sliderState.currentPosition =
            sliderState.endPosition +
            (sliderState.mousePosition[0] - sliderState.startPosition) *
                sliderState.moveSpeed;
    }
    function onMouseUp(e) {
        if ($eventAnimation) {
            sliderState.isMouseDown = false;
            sliderState.endPosition = sliderState.currentPosition;
            sliderState.clickUp = getMousePosition(e);
            if (
                sliderState.clickUp[0] === sliderState.clickDown[0] &&
                eventAnimation &&
                sliderState.clickUp[1] === sliderState.clickDown[1]
            ) {
                onPlaneClick(sliderState.clickUp[0]);
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
                ? (sliderState.currentPosition += e.deltaY * -1)
                : (sliderState.currentPosition += delta * -1);
            sliderState.endPosition = sliderState.currentPosition;
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
        color: rgb(255, 255, 255);
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
            display: flex;
            position: absolute;
        }
        .plane {
            align-self: center;
            position: absolute;
            box-sizing: border-box;
            height: var(--plane__height);
            width: var(--plane__width);
        }
        .svobodina {
            position: fixed;
            width: min(60vw, 1600px);
            height: calc(min(60vw, 1600px) / 6.83);
            left: 50vw;
            top: 50vh;
            transform: translate(-50%, -200%);
        }
        .svobodina__holder {
            position: absolute;
            top: 0;
            width: inherit;
        }
        /* 1.3882 */
        .photo {
            position: fixed;
            width: min(33.3vw, 889px);
            left: 50vw;
            top: 50vh;
            transform: translate(-52.8%, -64%);
        }
        .logo {
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
        }
        .wrapper {
            justify-content: center;
            width: 100%;
            height: 100vh;
            display: flex;
            position: absolute;
        }
        .plane {
            align-self: center;
            position: absolute;
            box-sizing: border-box;
            height: var(--plane__height);
            width: var(--plane__width);
        }
        .svobodina {
            height: 90vh;
            top: 50vh;
            position: fixed;
            left: 50vw;
            transform: translate(-220%, -51.45%);
        }
        .photo {
            position: fixed;
            top: 50vh;
            height: 50vh;
            left: 50vw;
            transform: translate(-50%, -52.5%);
        }
        .logo {
            width: 15vw;
            height: auto;
            position: fixed;
            bottom: 4vh;
            right: 3vh;
        }
    }
    #curtains {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        height: 100vh;
    }
</style>

<!-- {#if !pageslug} -->
<div class="svobodina">
    <div
        style="clip-path: inset(0% {100 - $progress * (100 / $photoseries.length)}% 0px 0px);"
        class="svobodina__holder">
        <picture>
            <!-- <source
                media="(orientation: portrait)"
                srcset="image/photoPortrait.svg"
                type="image/svg+xml" /> -->
            <img src="image/svobodinaFill.svg" alt="ph" />
        </picture>
    </div>
    <picture class="svobodina__holder">
        <!-- <source
            media="(orientation: portrait)"
            srcset="image/photoPortrait.svg"
            type="image/svg+xml" /> -->
        <img src="image/svobodinaPath.svg" alt="ph" />
    </picture>
</div>
<picture>
    <!-- <source media="(orientation: portrait)" srcset="image/photoPortrait.svg" type="image/svg+xml" /> -->
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
