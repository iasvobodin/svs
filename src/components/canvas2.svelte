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
    import { tweened } from "svelte/motion";
    // import photoseries from "db/Photoseries.json";
    import fragment from "assets/photoseries.frag";
    import vertex from "assets/photoseries.vert";
    import vertexT from "assets/start.vert";
    import fragmentT from "assets/start.frag";
    import shaderPassFs from "assets/shaderPassFs.frag";
    import rgbFs from "assets/rgbPass.frag";
    // import fragment from "assets/start.frag";
    // import vertex from "assets/start.vert";
    import {
        paddingCoef,
        globalPlanes,
        showPrelader,
        homePageState,
        progress,
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

    // VARIABLE DATA

    let curtains,
        webgl,
        shaderPass,
        disp = 0,
        distortionTarget,
        rgbPass,
        rgbTarget,
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
    $: $leaveIndex && !toRoute && toRouteAnim();
    $: $leaveRoute && toIndexAnim();
    $: animationState = !!startAnimation || !!toRoute || !!toIndex;
    // $: transitionPage = $leaveIndex || $leaveRoute;
    $: toInvisibleState =
        $homePageState && $titlePlaneOnLoad && !animationState;

    onMount(() => {
        initCurtains();

        addPlane();
        addTexture();
        addTitlePlane();
        initMatchMedia();
        addShaderPass();

        radius =
            elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;
        translateSlider();
    });
    console.log(pageslug, "pageslug");

    pageslug && showPrelader.set(false);
    $: if (pageslug) {
        // SORT PHOTOSERIES
        const object = $photoseries.find(
            (el) => el.Route.toLowerCase() === pageslug.toLowerCase()
        );
        photoseries.update((n) => [
            ...n.slice(object.Id),
            ...n.slice(0, object.Id),
        ]);
        showPrelader.set(false);
        eventAnimation.set(false);
        onMount(() => {
            if (!activePlane) {
                activePlane = planes.find((p) => p.userData.route === pageslug);

                let texture = $photoseries.find((t) => t.Route === pageslug);
                // transitionState = {
                transitionState.opacityHedline = 0;
                transitionState.opacityPlane = 1;
                transitionState.time = 0;
                transitionState.radiusAnimation = radius;
                transitionState.scalePlane = 1;
                transitionState.yRoundDisable = 0;
                transitionState.zRoundEnable = 1;
                // };

                activePlane.loadImage(
                    `https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/jpg/720/${texture.FileName}.jpg`,
                    {
                        sampler: "planeTexture",
                    },
                    (texture) => {
                        texture.onSourceLoaded(() => {
                            activePlane.visible = 1;
                            activePlane.uniforms.uProgress.value = 1;
                            curtains.needRender();
                        });
                    }
                    // (image, error) => {
                    //     // there has been an error while loading the image
                    // }
                );
                // console.log(activePlane);
                $titlePlaneOnLoad &&
                    (activePlaneTitle =
                        planesTitle[activePlane.index + photoseries.length]);
            }

            // activePlane.visible = 1;
            // activePlane.uniforms.uProgress.value = 1;
            // curtains.needRender();
        });
    }

    // INIT
    function initCurtains() {
        curtains = new Curtains({
            container: webgl,
            pixelRatio: Math.min(1.5, window.devicePixelRatio),
            production: process.env.NODE_ENV !== "development",
            autoRender: false,
        });
        distortionTarget = new RenderTarget(curtains);
        rgbTarget = new RenderTarget(curtains);
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
                planeTitle.setRenderTarget(rgbTarget);
                planesTitle.push(planeTitle);
            }

            rgbPass = new ShaderPass(curtains, {
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
            });

            // rgbPass.onRender(() => {
            //     // update the uniform
            //     rgbPass.uniforms.scrollEffect.value = scrollEffect;
            // });
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
        // console.time("create Plane");
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
            // plane.setScale(
            //     new Vec2(transitionState.scalePlane, transitionState.scalePlane)
            // );
            plane.setRenderTarget(distortionTarget);
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
    function addTexture() {
        const loader = new TextureLoader(curtains);
        // console.time("create texture");
        $photoseries.forEach((el, i) => {
            // images.push(`https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//jpg/720/${el.FileName}.jpg`);
            loader.loadImage(
                `https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//jpg/720/${el.FileName}.jpg`,
                {
                    sampler: "planeTexture",
                },
                (texture) => {
                    texture.setMinFilter(curtains.gl.LINEAR_MIPMAP_NEAREST);
                    texture.onSourceLoaded(() => {
                        !pageslug && (planes[i].visible = 1);
                        texture.addParent(planes[i]);
                        progress.update((n) => n + 100 / $photoseries.length);
                        load++;
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
        // console.timeEnd("create texture");
    }
    function addShaderPass() {
        const shaderPassParams = {
            fragmentShader: shaderPassFs,
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
        console.log(shaderPass.textures);
        // we will need to load a new image
        const image = new Image();
        image.src =
            "https://raw.githubusercontent.com/iasvobodin/svs/gitImage/static/image/displacement4.jpg";
        // set its data-sampler attribute to use in fragment shader
        image.setAttribute("data-sampler", "displacementTexture");
        if (shaderPass) {
            shaderPass.loader.loadImage(image);
            shaderPass
                .onLoading((texture) => {
                    texture.setScale(new Vec2(2, 0.5));
                    console.log(
                        "shader pass image has been loaded and texture has been created:",
                        texture
                    );
                })
                .onReady(() => {
                    console.log("shader pass is ready");
                })
                .onRender(() => {
                    // update the uniforms
                    // shaderPass.uniforms.displacement.value =
                    //     planesDeformations / 60;
                })
                .onError(() => {
                    console.log("shader pass error");
                });
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
    function initMatchMedia() {
        const portrait = window.matchMedia("(orientation: portrait)");
        handlePortrait(portrait);
        portrait.addEventListener("change", handlePortrait);
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
            paddingCoef.set(0.03);
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
                //   `https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//${$fileEx}/720/${$store.state.photoseries[i].Portrait}.${$fileEx}`
                // )
                // p.textures[0].needUpdate()
                // console.log(p)
            });
        } else {
            // LANDSCAPE
            paddingCoef.set(0.12);
            if (!pageslug) {
                transitionState.radiusAnimation = Math.min(
                    (window.innerWidth * 0.0755) / 1.3882 / 2,
                    100
                );
            }
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
                // autoplay: false,
            })
            .add({
                // update: () => {
                //     console.log("startAnim()");
                // },
                targets: transitionState,
                duration: 4500,
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
            );
        // .add(
        //     {
        //         duration: 500,
        //         targets: transitionState,
        //         opacityPlane: 0,
        //         change: () => {
        //             // planes.forEach((plane, i) => {
        //             //     if (plane.relativesliderState.Translation.z < 0) {
        //             //         plane.uniforms.uOpacity.value =
        //             //             transitionState.opacityPlane;
        //             //     }
        //             // });
        //         },
        //         easing: "linear",
        //     },
        //     4000
        // );
        startAnimation &&
            startAnimation.finished.then(() => {
                homePageState.set(true);
                startAnimation = null;
            });
    }

    function toInvisibleAnim(direction) {
        toInvisible = anime({
            targets: transitionState,
            duration: 400,
            // autoplay: false,
            opacityPlane: direction,
            easing: "easeOutQuad",
            change: () => {
                planes.forEach((e, i) => {
                    if (!e.isDrawn()) {
                        return;
                    }
                    if (e.index === activePlane.index) {
                        return;
                    }
                    console.log(e.index);
                    e.uniforms.uOpacity.value = planesTitle[
                        i
                    ].uniforms.uOpacityTitle.value =
                        transitionState.opacityPlane;
                });
            },
            changeComplete: () => {
                planes.forEach((e, i) => {
                    if (e.index === activePlane.index) {
                        return;
                    }
                    e.relativeTranslation.z > 0 &&
                        (e.visible = planesTitle[i].visible = direction[1]);
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
        eventAnimation.set(false);
        if (!activePlane) {
            activePlane = planes.find((p) => p.userData.route === pageslug);
        }
        if (!activePlane.isDrawn()) {
            activePlane.visible = 1;
            toRoute.add({
                targets: sliderState,
                duration: 1000,
                planeCorrection: angleStep * activePlane.index,
                translation: 0,
                currentPosition: 0,
                endPosition: 0,
                easing: "easeOutQuad",
            });
        }
        getUnifors(activePlane);
        toRoute.add(
            {
                targets: [activePlane.uniforms.uProgress, transitionState],
                duration: 1400,
                value: 1,
                easing: "easeOutQuad",
                changeComplete: () => {},
                changeBegin: () => {
                    homePageState.set(false);
                    toInvisibleAnim([1, 0]);
                    getUnifors(activePlane);
                    activePlane.relativeTranslation.z = radius + 10;
                },
            },
            "+=50"
        );

        toRoute &&
            toRoute.finished.then(() => {
                toRoute = null;
                leaveIndex.set(false);
            });
    }
    function toIndexAnim() {
        toIndex = anime.timeline().add({
            targets: [activePlane.uniforms.uProgress, transitionState],
            duration: 1400,
            autoplay: false,
            value: 0,
            opacityPlane: [0, 1],
            easing: "easeInSine",
            changeComplete: () => {
                toInvisibleAnim([0, 1]);
            },
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
    function translateSlider(t) {
        curtains.render();
        // $eventAnimation &&
        //     (
        if ($eventAnimation) {
            sliderState.translation +=
                (sliderState.currentPosition - sliderState.translation) * 0.05;
            disp = sliderState.currentPosition - sliderState.translation;
            shaderPass.uniforms.displacement.value = disp / 1500;
            // console.log(disp);
        }
        // );
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
                if ($titlePlaneOnLoad) {
                    rgbPass.uniforms.scrollEffect.value = disp / 20;
                    planesTitle[i].setRelativeTranslation(transVec);
                }
            }
            plane.setRelativeTranslation(transVec);
            if ($homePageState) {
                if (plane.relativeTranslation.z < 0) {
                    plane.visible = planesTitle[i].visible = false;
                } else {
                    plane.visible = planesTitle[i].visible = true;
                }
            }
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
            activePlaneTitle = planesTitle[i];
            eventAnimation.set(false);
            toRouteAnim();

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

<div
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
        <a style="display: none;" href="/{seriya.Route.toLowerCase()}">r</a>
        <div
            data-id={index}
            data-route={seriya.Route}
            data-color={[seriya.ColorVector]}
            class="plane"
        >
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

<div
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
        <div
            data-id={index}
            data-route={seriya.Route}
            data-color={[seriya.ColorVector]}
            class="plane"
        >
            <!-- <picture class="standart__picture">
                <source
                    media="(orientation: portrait)"
                    srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//webp/720/{seriya.Portrait}.webp"
                    type="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp" />
                <source
                    media="(orientation: landscape)"
                    srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//webp/720/{seriya.FileName}.webp"
                    type="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp" />

                <img
                    data-sampler="planeTexture"
                    class="slider__img"
                    alt="SvobodinaPhoto"
                    crossorigin="anonimous"
                    decoding="async"
                    draggable="false"
                    src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image//jpg/720/{seriya.FileName}.jpg" />
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
        /* display: none; */
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
            top: calc(var(--vh, 1vh) * 50);
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
        .title__plane {
            height: 4vh;
            height: calc(var(--vh, 1vh) * 4);

            bottom: calc((100vh - var(--plane__height)) / 4);
        }
        h3 {
            font-size: 4vh;
            font-size: calc(var(--vh, 1vh) * 4);
        }
        .wrapper {
            justify-content: center;
            width: 100%;
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
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
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
</style>
