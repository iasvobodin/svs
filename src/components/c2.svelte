<script>
    import {
        Curtains,
        Plane,
        Vec3,
        Vec2,
        TextureLoader,
        ShaderPass,
        RenderTarget,
    } from "curtainsjs/src/index.mjs";
    import anime from "animejs";
    import { debounce } from "lodash-es/lodash";
    import { tweened } from "svelte/motion";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    import vertexT from "assets/start.vert";
    import fragmentT from "assets/start.frag";
    import trvert from "assets/tr.vert";
    import trfrag from "assets/tr.frag";
    import shaderPassFs from "assets/shaderPassFs.frag";
    import shaderPassVs from "assets/shaderPassFs.vert";
    import rgbFs from "assets/rgbPass.frag";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        titleIndex,
        showPrelader,
        homePageState,
        progress,
        eventAnimation,
        photoseries,
        leaveIndex,
        leaveRoute,
    } from "store.js";
    // import {
    //     getUnifors
    // } from "func.js";
    import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
    import { goto, stores, start } from "@sapper/app";
    // import { sineOut } from "svelte/easing";
    //INIT BEFORE MOUNT

    // VARIABLE DATA

    let curtains,
        webgl,
        shaderPass,
        disp = 0,
        distortionTarget,
        rgbPass,
        rgbTarget,
        loader,
        planesTitle = [],
        planes = [],
        activePlane,
        activePlaneTitle,
        toIndex,
        toRoute,
        tarnsitionPlane,
        toInvisible,
        slider,
        animationFrame = null,
        changeOpacity,
        transVec = new Vec3(),
        widthUn = 0.7,
        heightUn = 0.8,
        startAnimation = null,
        isTrackpad = true,
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
        images = {},
        transitionState = {
            opacityPlane: 1,
            time: 0,
            radiusAnimation: 0,
            scalePlane: 0.015,
            yRoundDisable: 1,
            zRoundEnable: 0,
        };
    let src, textureTag;
    const { page } = stores();
    $: pageslug = $page.params.Route;
    let titlePlaneOnLoad = false;
    $: aspect = 0;
    let radius = 0;
    $: radiusCoef = 0;
    $: elWidth = 0;
    $: $leaveIndex && !toRoute && toRouteAnim();
    $: $leaveRoute && toIndexAnim();
    $: load === $photoseries.length && $showPrelader && startAnim();
    $: testId = 0;
    onMount(() => {
        // console.log(slider);
        slider.addEventListener("mousemove", debounce(onChangeTitle, 30));
        slider.addEventListener("touchmove", debounce(onChangeTitle, 30));
        initCurtains();

        initMatchMedia();

        addPlane();

        !pageslug &&
            planes.forEach((e, i) => {
                e.onReady(() => {
                    //   console.log("do it?");
                    // setTexture(e);
                    // const angle = angleStep * i;
                    // console.log(angle, i, "plane");
                });
            });

        addTitlePlane();
        document.fonts
            .load("1em Cormorant Infant")
            .then(() => addTransitionPlane());

        addShaderPass();

        translateSlider();
    });
    pageslug && showPrelader.set(false);

    $: if (pageslug) {
        onMount(() => {
            anime.set(".main__head", {
                opacity: 1,
            });
            transitionState.opacityHedline = 0;
            transitionState.opacityPlane = 1;
            transitionState.time = 0;
            transitionState.radiusAnimation = radius;
            transitionState.scalePlane = 1;
            transitionState.yRoundDisable = 0;
            transitionState.zRoundEnable = 1;
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);
            }
            titleIndex.set(activePlane.index);

            activePlane.onReady(() => {
                getUnifors(activePlane);
                setTexture(activePlane);
            });
            document.fonts.load("1em Cormorant Infant").then(() => {
                tarnsitionPlane.relativeTranslation.x = 0;
                tarnsitionPlane.uniforms.uColor.value =
                    activePlane.userData.color;
            });
            planes.forEach((e) => {
                e.isDrawn() && (e.visible = 0);
            });
            activePlane.visible = 1;
            activePlane.uniforms.uProgress.value = 1;

            titlePlaneOnLoad &&
                (activePlaneTitle =
                    planesTitle[activePlane.index + photoseries.length]);
        });
    }
    // INIT
    function initCurtains() {
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
            antialias: false,
            // preserveDrawingBuffer: true,
            // depth: false,
            // autoResize: false,
            watchScroll: false,
        });
        // curtains.canvas.height = window.innerHeight;
        // curtains.canvas.width = window.innerWidth;
        distortionTarget = new RenderTarget(curtains);
        rgbTarget = new RenderTarget(curtains);
        loader = new TextureLoader(curtains);
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
        const rgbPassParams = {
            fragmentShader: rgbFs,
            renderTarget: rgbTarget,
            depthTest: false, // we need to disable the depth test to display that shader pass on top of the first one
            uniforms: {
                scrollEffect: {
                    name: "uScrollEffect",
                    type: "1f",
                    value: 0,
                },
            },
            texturesOptions: {
                anisotropy: 10,
            },
        };
        document.fonts.load("1em Cormorant Infant").then(() => {
            titlePlaneOnLoad = true;
            for (const element of planeElementTitle) {
                const planeTitle = new Plane(curtains, element, paramsTitle);
                const canvas = document.createElement("canvas");
                planeTitle.loadCanvas(canvas);
                planeTitle.onLoading((texture) => {
                    texture.shouldUpdate = false;
                    writeText(planeTitle, texture.source);
                });
                planeTitle.setRenderTarget(rgbTarget);
                // planeChangeView(planeTitle);
                planesTitle.push(planeTitle);
            }

            rgbPass = new ShaderPass(curtains, rgbPassParams);

            const image = new Image();
            image.src = "image/displacement4.jpg";
            // set its data-sampler attribute to use in fragment shader
            image.setAttribute("data-sampler", "displacementTexture");
            shaderPass.loader.loadImage(image);
        });
    }
    function addPlane(trPlanpmne = false) {
        const planeElement = document.getElementsByClassName("plane");
        const paramsPlane = {
            widthSegments: 16,
            heightSegments: 16,
            vertexShader: vertex,
            // fragmentShader: fragment,
            visible: 1,
            autoloadSources: false,
            // depthTest: false,
            fov: 1,
            renderOrder: 2,
            alwaysDraw: false,
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
        // console.time("create Plane");
        [...planeElement].forEach((element, i) => {
            const plane = new Plane(curtains, element, {
                ...paramsPlane,
                fragmentShader: fragment,
            });
            plane.userData = {
                route: $photoseries[plane.index].Route,
                color: $photoseries[plane.index].ColorVector,
                id: $photoseries[plane.index].Id,
            };
            getUnifors(plane, {
                pCorr: false,
                sCorr: true,
                fCorr: true,
            });
            plane.setRenderTarget(distortionTarget);
            // plane.onReady(() => {
            //     setTexture(plane);
            // });
            plane.onAfterResize(() => {
                getUnifors(plane);
            });
            setTexture(plane);

            // console.log(plane);
            // CREATE TEXTURE
            // plane.createTexture({
            //   sampler: "planeTexture",
            // }),
            planes.push(plane);
        });
        // console.timeEnd("create Plane");

        if (trPlane) {
            planes.trPlane = new Plane(curtains, trPlane, {
                ...params,
                fragmentShader: fragmentM,
            });

            planes.trPlane.visible = 1;
        }
    }
    function addTransitionPlane() {
        const params = {
            vertexShader: trvert,
            fragmentShader: trfrag,
            // fov: 1,
            // depthTest: false,
            // transparent: true,
            // renderOrder:1,
            renderOrder: 1,
            uniforms: {
                uTRprogress: {
                    name: "uTRprogress",
                    type: "1f",
                    value: 0,
                },
                uColor: {
                    name: "uColor",
                    type: "3f",
                    value: [0, 0, 0],
                },
            },
        };
        const trPlane = document.getElementsByClassName("transition__plane");
        tarnsitionPlane = new Plane(curtains, trPlane[0], params);
        tarnsitionPlane.relativeTranslation.x = -window.innerWidth;
        tarnsitionPlane.setRenderTarget(distortionTarget);
        console.log(tarnsitionPlane);
        // tarnsitionPlane.onReady(()=>{
        //     tarnsitionPlane.setRenderOrder(-1);
        // })
    }
    async function setTexture(pl) {
        const planeImages = document.getElementsByClassName("slider__img");
        await tick();
        planeImages[pl.index] &&
            pl.images.length === 0 &&
            pl.loadImage(planeImages[pl.index]);
        pl.textures[0] &&
            pl.textures[0].onSourceUploaded(() => {
                load++;
                progress.update((n) => n + 100 / $photoseries.length);
            });
        if (pl.images[0]) {
            pl.images[0].onload = () => {
                pl.textures[0].needUpdate();
                getUnifors(pl);
            };
        }
    }
    function addShaderPass() {
        const shaderPassParams = {
            fragmentShader: shaderPassFs,
            renderOrder: 3,
            // vertexShader: shaderPassVs,
            renderTarget: distortionTarget, // we'll be using the lib default vertex shader
            uniforms: {
                displacement: {
                    name: "uDisplacement",
                    type: "1f",
                    value: 0,
                },
            },

            texturesOptions: {
                anisotropy: 10,
            },
        };
        shaderPass = new ShaderPass(curtains, shaderPassParams);
        const image = new Image();
        image.src = "image/displacement4.jpg";
        // set its data-sampler attribute to use in fragment shader
        image.setAttribute("data-sampler", "displacementTexture");
        shaderPass.loader.loadImage(image);
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

        context.textBaseline = "middle";
        context.fillText(
            $photoseries[plane.index - $photoseries.length].Title,
            // htmlPlane.textContent,
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
    function handlePortrait(e) {
        if (e.matches) {
            // PORTAIT
            aspect = 1.5;
            widthUn = 1;
            heightUn = 0.72;
            radiusCoef = 0.0725;

            setElementSize(0.62, 0.12);
            // curtains.resize();
            // paddingCoef.set(0.03);

            if (!$homePageState) {
                transitionState.radiusAnimation = Math.min(
                    (window.innerHeight * radiusCoef) / 1.3882 / 2,
                    100
                );
            }
            if (pageslug) {
                transitionState.radiusAnimation = radius;
            }
        } else {
            // LANDSCAPE
            aspect = 0.668;
            widthUn = 0.7;
            heightUn = 0.8;
            radiusCoef = 0.0755;

            setElementSize(0.69);

            if (!$homePageState) {
                transitionState.radiusAnimation = Math.min(
                    (window.innerWidth * radiusCoef) / 1.3882 / 2,
                    100
                );
            }
            if (pageslug) {
                transitionState.radiusAnimation = radius;
            }
            // curtains.resize();
        }
    }
    function customCorrection(coef) {
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
        opt = { pCorr: true, sCorr: true, fCorr: true }
    ) {
        // GET BOUND
        const { width, height, left, top } = plane.getWebGLBoundingRect();
        const {
            width: curtainsWidth,
            height: curtainsHeight,
        } = curtains.getBoundingRect();
        // const curtainsWidth =
        //     curtains.getBoundingRect().width / curtains.pixelRatio;
        // const curtainsHeight =
        //     curtains.getBoundingRect().height / curtains.pixelRatio;
        // const top = (curtainsHeight - height) / 2;
        const calcCords = {};
        // SET CORRECTION FRAGMENT SHADER NEED TO START AND RESIZE
        if (opt.fCorr) {
            const scaleWidth = window.innerWidth * widthUn;
            const scaleHeight = window.innerHeight * heightUn;
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
                (curtainsWidth * widthUn) / width - 1, // * 0.5,
                (curtainsHeight * heightUn) / height - 1, //* 0.7
            ];
        }
        // PLANE SIZE
        calcCords.w = curtainsWidth / width;
        calcCords.h = curtainsHeight / height;
        // console.log(top, height);

        // PLANE POSITION VECTOR
        calcCords.x = (left / width - calcCords.w / 2 + 0.5) * 2;
        calcCords.y = (-(top / height - calcCords.h / 2) - 0.5) * 2;
        if (opt.pCorr) {
            plane.uniforms.uPlanePosition.value = [calcCords.x, calcCords.y];
        } else {
            plane.uniforms.uPlanePosition.value = [0, 0];
        }
    }

    function setElementSize(height, margin = 0.06) {
        const { width } = curtains.getBoundingRect();
        textureTag = `${width > 720 ? "large" : "small"}${
            aspect === 1.5 ? "Portrait" : "Landscape"
        }`;
        elWidth =
            (window.innerHeight * height) / aspect +
            window.innerWidth * margin * 2;

        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;

        document.documentElement.style.setProperty(
            "--plane__width",
            `${(window.innerHeight * height) / aspect}px`
        );
        document.documentElement.style.setProperty(
            "--plane__height",
            `${window.innerHeight * height}px`
        );
        // document.documentElement.style.setProperty(
        //     "--vh",
        //     window.innerHeight / 100 + "px"
        // );
    }
    function getCurtainsSize() {
        curtainsWidth = curtains.getBoundingRect().width;
        curtainsHeight = curtains.getBoundingRect().height;
    }
    function resize() {
        // radius =
        //     elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        // // if ($homePageState) {
        //     transitionState.radiusAnimation =
        //         elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        // } else {
        //     transitionState.radiusAnimation = Math.min(
        //         (Math.max(window.innerHeight, window.innerWidth) * radiusCoef) /
        //             1.3882 /
        //             2,
        //         100
        //     );
        // }
        // activePlane && getUnifors(activePlane);
        // document.documentElement.style.setProperty(
        //     "--vh",
        //     window.innerHeight / 100 + "px"
        // );
        // curtains.onAfterResize(() => {
        // });
    }
    function planeChangeView(plane) {
        if (plane.relativeTranslation.z < 0) {
            // console.log(" if (plane.relativeTranslation.z < 0) {");
            plane.visible = 0;
            plane.uniforms.uOpacity.value = 1;
        }
        plane.onLeaveView(() => (plane.visible = 0));
        plane.onReEnterView(() => {
            plane.isDrawn() &&
                plane.relativeTranslation.z < 0 &&
                (plane.visible = 0);
            plane.visible = plane.relativeTranslation.z > 0 ? true : false;
        });
    }
    //AANIMATE
    function startAnim() {
        if (pageslug) return;
        // homePageState.set(true);
        startAnimation = anime
            .timeline({
                // autoplay: false,
            })
            .add({
                // update: () => {
                //     console.log("startAnim()");
                // },
                targets: transitionState,
                duration: 5000,
                easing: "easeOutSine",
                time: Math.PI * 4,
            })
            .add(
                {
                    duration: 2000,
                    targets: [transitionState],
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
                    targets: [".preloader", ".logo"],
                    opacity: 0,
                    easing: "linear",
                },
                1800
            )
            .add(
                {
                    duration: 300,
                    targets: [transitionState, ".main__head"],
                    opacityPlane: 0,
                    opacity: 1,
                    change: () => {
                        planes.forEach((plane, i) => {
                            if (plane.relativeTranslation.z < 0) {
                                //         (plane.visible = 0);
                                plane.uniforms.uOpacity.value =
                                    transitionState.opacityPlane;
                            }
                        });
                    },
                    changeComplete: () => {
                        planes.forEach((plane, i) => {
                            // console.log(plane.relativeTranslation.z);
                            planeChangeView(plane);
                        });
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

    function toInvisibleAnim(direction) {
        let invisPlanes = [];
        planes.forEach((e, i) => {
            if (!e.isDrawn()) {
                return;
            }
            if (e.index === activePlane.index) {
                return;
            }
            invisPlanes.push(e);
        });
        // console.log(invisPlanes);
        toInvisible = anime({
            targets: transitionState,
            duration: 400,
            // autoplay: false,
            opacityPlane: direction,
            easing: "easeOutQuad",
            change: () => {
                invisPlanes.forEach((e, i) => {
                    e.uniforms.uOpacity.value = planesTitle[
                        i
                    ].uniforms.uOpacityTitle.value =
                        transitionState.opacityPlane;
                });
            },
            changeComplete: () => {
                console.log(invisPlanes);
                invisPlanes.forEach((e, i) => {
                    e.visible = direction[0];
                    e.uniforms.uOpacity.value = direction[1];
                    // if (e.index === activePlane.index) {
                    //     return;
                    // }
                    // e.relativeTranslation.z > 0 &&
                    //     (e.visible = planesTitle[i].visible = direction[1]);
                });
            },
            changeBegin: () => {},
        });
        toInvisible.finished.then(() => (toInvisible = null));
    }

    function toRouteAnim() {
        toRoute = anime.timeline({
            autoplay: false,
        });
        // set mouse touch and other event disable
        eventAnimation.set(false);
        if (!activePlane) {
            activePlane = planes.find((p) => p.userData.route === pageslug);
        }
        activePlane.setRenderOrder(planes.length + 2);
        tarnsitionPlane.setRenderOrder(planes.length + 1);
        tarnsitionPlane.uniforms.uColor.value = activePlane.userData.color;
        // console.log(tarnsitionPlane.uniforms);
        if (!activePlane.isDrawn()) {
            activePlane.visible = 1;
            toRoute.add({
                targets: [sliderState],
                duration: 1000,
                changeBegin: () => {},
                changeComplete: () => {
                    sliderState.endPosition = sliderState.translation;
                },
                translation: angleStep * activePlane.index * 1300,
                currentPosition: angleStep * activePlane.index * 1300,
                easing: "easeOutQuad",
            });
        }
        // getUnifors(activePlane);
        toRoute.add(
            {
                targets: [
                    activePlane.uniforms.uProgress,
                    tarnsitionPlane.relativeTranslation,
                    transitionState,
                ],
                duration: 1400,
                value: 1,
                x: [-window.innerWidth, 0],
                easing: "easeOutQuad",
                changeComplete: () => {},
                changeBegin: () => {
                    homePageState.set(false);
                    titleIndex.set(activePlane.index);

                    // toInvisibleAnim([1, 0]);
                    getUnifors(activePlane);
                    // activePlane.relativeTranslation.z = radius + 10;
                },
            },
            "+=50"
        );

        toRoute &&
            toRoute.finished.then(() => {
                toRoute = null;
                // titleIndex.set(activePlane.index);
                leaveIndex.set(false);
            });
    }
    function toIndexAnim() {
        toIndex = anime
            .timeline({
                autoplay: false,
            })
            .add({
                targets: [
                    activePlane.uniforms.uProgress,
                    transitionState,
                    tarnsitionPlane.relativeTranslation,
                ],
                duration: 1400,
                autoplay: false,
                value: 0,
                x: [0, -window.innerWidth],
                opacityPlane: [0, 1],
                easing: "easeInSine",
                changeBegin: () => {
                    //     getUnifors(activePlane);
                },
                changeComplete: () => {
                    activePlane.setRenderOrder(planes.length - 1);
                    // planes.forEach((plane, i) => {
                    //     // plane.visible = 1;
                    //     planeChangeView(plane);
                    // });
                    // toInvisibleAnim([0, 1]);
                },
            });
        toIndex.finished.then(() => {
            planes.forEach((e) => {
                setTexture(e);
                // console.log(e.relativeTranslation.z, "Translation.z");
                console.log(e.index, "index", e.visible, "visible");
                // if (e.relativeTranslation.z < 0) {
                //   // debugger;
                //   e.visible = 0;
                // }
                planeChangeView(e);
            });
            toIndex = null;
            leaveRoute.set(false);
            eventAnimation.set(true);
            sliderState.currentPosition = sliderState.endPosition =
                sliderState.translation;
            !$homePageState && homePageState.set(true);
        });
    }
    function translateSlider(t) {
        curtains.render();

        if ($eventAnimation) {
            sliderState.translation +=
                (sliderState.currentPosition - sliderState.translation) * 0.05;
        }
        disp +=
            (sliderState.currentPosition - sliderState.translation - disp) *
            0.3;
        shaderPass && (shaderPass.uniforms.displacement.value = disp / 2500);

        planes.forEach((plane, i) => {
            const angle = angleStep * i;
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
                if (titlePlaneOnLoad) {
                    rgbPass.uniforms.scrollEffect.value = disp;
                    planesTitle[i].setRelativeTranslation(transVec);
                }
            }
            plane.setRelativeTranslation(transVec);
            // if ($homePageState) {
            //     if (plane.relativeTranslation.z < 0) {
            //         plane.visible = planesTitle[i].visible = false;
            //     } else {
            //         plane.visible = planesTitle[i].visible = true;
            //     }
            // }
        });
        // START ANIMATION

        toIndex && toIndex.tick(t);
        toRoute && toRoute.tick(t);
        // startAnimation && startAnimation.tick(t);

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
            //   testId = el.index;
            //   activePlaneTitle = planesTitle[i];
            eventAnimation.set(false);
            // getUnifors(activePlane);
            toRouteAnim();
            goto(`/${el.userData.route}/`);
        });
    }
    function onMouseDown(e) {
        sliderState.isMouseDown = true;
        sliderState.clickDown = getMousePosition(e);
        sliderState.startPosition = sliderState.clickDown[0];
    }
    function onChangeTitle() {
        let index =
            -Math.round(sliderState.currentPosition / (angleStep * 1300)) %
            $photoseries.length;
        // testId = index >= 1 ? $photoseries.length - index : Math.abs(index);
        titleIndex.set(
            index >= 1 ? $photoseries.length - index : Math.abs(index)
        );
    }
    function onMouseMove(e) {
        if (!sliderState.isMouseDown) return;
        sliderState.mousePosition = getMousePosition(e);
        sliderState.currentPosition =
            sliderState.endPosition +
            (sliderState.mousePosition[0] - sliderState.startPosition) *
                sliderState.moveSpeed;
        // onChangeTitle(sliderState.currentPosition, e);
    }
    function onMouseUp(e) {
        sliderState.isMouseDown = false;
        sliderState.endPosition = sliderState.currentPosition;
        sliderState.clickUp = getMousePosition(e);
        if (
            sliderState.clickUp[0] === sliderState.clickDown[0] &&
            $eventAnimation &&
            sliderState.clickUp[1] === sliderState.clickDown[1]
        ) {
            onPlaneClick(sliderState.clickUp[0]);
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
            onChangeTitle(sliderState.currentPosition, e);
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

<h3 class="main__head">{$photoseries[$titleIndex].Title}</h3>
<!-- <h1>{testId}</h1> -->
<svelte:window on:resize={resize} />
<div
    bind:this={slider}
    class:event={!$eventAnimation}
    on:mousemove={onMouseMove}
    on:touchmove|passive={onMouseMove}
    on:mouseleave={onMouseUp}
    on:mouseup={onMouseUp}
    on:mousedown|preventDefault={onMouseDown}
    on:touchstart|preventDefault={onMouseDown}
    on:touchend={onMouseUp}
    on:wheel={onWheel}
    class="wrapper"
>
    {#each $photoseries as seriya, index (index)}
        <a style="display: none;" href="/{seriya.Route}">r</a>
        <!-- data-id={index}
          data-route={seriya.Route}
          data-color={[seriya.ColorVector]} -->
        <div class="plane">
            <!-- <picture class="standart__picture">
                  <source
                      media="(orientation: portrait)"
                      srcset="/image/webp/720/{seriya.Portrait}.webp"
                      type="image/webp"
                  />
                  <source
                      media="(orientation: landscape)"
                      srcset="/image/webp/720/{seriya.LandscapeFileName}.webp"
                      type="image/webp"
                  />
  
                  <img
                      data-sampler="planeTexture"
                      class="slider__img"
                      alt="SvobodinaPhoto"
                      crossorigin="anonimous"
                      decoding="async"
                      draggable="false"
                      src="/image/jpg/720/{seriya.LandscapeFileName}.jpg"
                  />
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
<div class="transition__plane" />

<!-- <div class="box" /> -->
<style>
    /* h1 {
      color: white;
      position: fixed;
      top: 0;
      left: 0;
    } */
    .transition__plane {
        width: 100%;
        height: calc(var(--vh) * 100);
        /* background-color: green; */
    }
    .event {
        pointer-events: none;
    }
    /* :root {
          --margin__wrapper: calc((100vh - var(--plane__height)) / 2);
          --title__height: calc(14px + 3.2vw);
          --translationSlide: 0;
          --plane__height: 52vh;
          --plane__width: calc(var(--plane__height) * 1.5);
          --plane__margin: 5vw;
          --plane__shift: calc(
              50vw - ((var(--plane__width) + var(--plane__margin) * 2) * 3.5)
          );
      } */
    .title__plane {
        opacity: 0;
        width: calc(var(--plane__width) + 1vw);
        position: absolute;
        left: 50vw;
        transform: translate(-50%, 50%);
        pointer-events: none;
        overflow: hidden;
    }
    .main__head {
        /* display: none; */
        /* text-align: center; */
        opacity: 0;
        z-index: 3;
        white-space: pre;
        /* width: 100%; */
        transform: translate(0, -50%);
        position: absolute;
        top: calc((100vh - var(--plane__height)) / 4);
        left: 1vw;
        font-family: Cormorant Infant, sans-serif;
        font-weight: 300;
        color: rgb(255, 255, 255);
        margin: 0;
        font-size: clamp(14px, 6vw + 12px, 80px);
        line-height: clamp(18px, 6.5vw + 12px, 80px);
    }
    @media (orientation: landscape) {
        /* h3 {
        font-size: clamp(14px, 6vw + 12px, 80px);
        line-height: clamp(18px, 6.5vw + 12px, 80px);
      } */
        /* .title__plane {
        height: clamp(18px, 6.5vw + 12px, 80px);
      } */
        .wrapper {
            justify-content: center;
            width: 100%;
            height: var(--plane__height);
            top: 50vh;
            top: calc(var(--vh) * 50);
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
    }
    @media (orientation: portrait) {
        :root {
            --plane__height: 65vh;
            --plane__width: calc(var(--plane__height) * 0.66);
        }
        /* .title__plane {
        height: 4vh;
        height: calc(var(--vh) * 4);
        bottom: calc((100vh - var(--plane__height)) / 4);
      } */
        /* h3 {
        font-size: 4vh;
        font-size: calc(var(--vh) * 4);
      } */
        .wrapper {
            justify-content: center;
            width: 100%;
            height: 100%;
            height: calc(var(--vh) * 100);
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
    }
    #curtains {
        pointer-events: none;
        position: absolute;
        /* bottom: 0; */
        top: 0;
        left: 0;
        /* right: 0; */
        overflow: hidden;
        width: 100%;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
</style>
