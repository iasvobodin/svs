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
  import fragment from "assets/photoseries.frag";
  import vertex from "assets/photoseries.vert";
  import vertexT from "assets/start.vert";
  import fragmentT from "assets/start.frag";
  import trvert from "assets/tr.vert";
  import trfrag from "assets/tr.frag";
  import shaderPassFs from "assets/shaderPassFs.frag";
  import shaderPassVs from "assets/shaderPassFs.vert";
  import rgbFs from "assets/rgbPass.frag";
  import PlanePicture from "../components/planePicture.svelte";
  // import fragment from "assets/start.frag";
  // import vertex from "assets/start.vert";
  import {
    titleIndex,
    typePhotoseries,
    photoseriesSort,
    showPrelader,
    homePageState,
    activePhotoseries,
    eventAnimation,
    photoseries,
    leaveIndex, // true then animation to route
    leaveRoute, // true then animation to index
  } from "store.js";
  // import {
  //     getUnifors
  // } from "func.js";
  import { afterUpdate, getContext, onMount, setContext, tick } from "svelte";
  import { goto, stores, start } from "@sapper/app";
  // import { sineOut } from "svelte/easing";
  //INIT BEFORE MOUNT

  // VARIABLE DATA
  console.log("canvas2init");
  let curtains,
    // showPicture = false,
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
    currentPlane,
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
  // $: pageslug = $page.params.Route;
  let titlePlaneOnLoad = false;
  let aspect = 0;
  let radius = 0;
  $: radiusCoef = 0;
  $: elWidth = 0;
  $: $leaveIndex && !toRoute && toRouteAnim();
  $: $leaveRoute && toIndexAnim();
  $: load === $photoseries.length && $showPrelader && startAnim();
  $: showPicture = false;
  $: titlePh = 0;
  //   pageslug && showPrelader.set(false);
  // activePhotoseries.set($photoseries.find((el) => el.Route === "irinaivan"));

  onMount(() => {
    console.log(Date.now(), "CANVASONMOUNT");
    showPicture = true;
    slider.addEventListener("mousemove", debounce(onChangeTitle, 30));
    slider.addEventListener("touchmove", debounce(onChangeTitle, 30));

    initCurtains();

    initMatchMedia();

    // addTransitionPlane();

    // const activeElement = document.getElementsByClassName("activeplane");
    // addPlane(activeElement);

    const planeElement = document.getElementsByClassName("plane");
    planeElement && addPlane(planeElement);

    addShaderPass();

    translateSlider();

    if ($page.params.Route) {
      anime.set(".main__head", {
        opacity: 1,
      });

      if (!activePlane) {
        activePlane = planes[0];
      }
      // console.log(activePlane, "activePlane");
      // activePlane.images[0].onload = () => {
      //   activePlane.textures[0].needUpdate();
      //   getUnifors(activePlane);
      // };
      // activePlane.onReady(() => {});
      //   getUnifors(pl);
      activePlane.uniforms.uProgress.value = 1;
      tarnsitionPlane.relativeTranslation.x = 0;
      // console.log(tarnsitionPlane, activePlane.userData, "tarnsitionPlane");
      tarnsitionPlane.uniforms.uColor.value = activePlane.userData.color;

      planes.forEach((e) => {
        e.isDrawn() && (activePlane.visible = 1) && (e.visible = 0);
      });

      activePlane.visible = 1;
      // curtains.needRender();
    } else {
    }
  });
  if ($page.params.Route) {
    showPrelader.set(false);
    eventAnimation.set(false);
    transitionState.opacityHedline = 0;
    transitionState.opacityPlane = 1;
    transitionState.time = 0;
    transitionState.radiusAnimation = radius;
    transitionState.scalePlane = 1;
    transitionState.yRoundDisable = 0;
    transitionState.zRoundEnable = 1;
    //SET ACTIVE PLANE NODE
    const activeNode = $photoseries.find(
      (el) => el.Route === $page.params.Route
    );
    activePhotoseries.set(activeNode);
    photoseriesSort.update((n) => [
      ...n.slice(activeNode.Id),
      ...n.slice(0, activeNode.Id),
    ]);
    // console.log($typePhotoseries, "$typePhotoseries");
    // typePhotoseries.set(
    //   $photoseries.filter(
    //     (el) => el.Type === $page.params.type && el.Route !== $page.params.Route
    //   )
    // );
    // console.log(
    //   $photoseries.filter(
    //     (el) => el.Type === $page.params.type && el.Route !== $page.params.Route
    //   )
    // );
    // $photoseries.Type;
    // photoseries.update((n) => [
    //   ...n.slice(activeNode.Id),
    //   ...n.slice(0, activeNode.Id),
    // ]);

    titleIndex.set(0);
  } else {
    activePhotoseries.set($photoseries[0]);
    typePhotoseries.set($photoseries.filter((el) => el.Id !== 0));
  }
  $: if ($page.params.Route) {
    onMount(() => {
      titleIndex.set(0);
    });
  }
  $: $typePhotoseries
    ? (titlePh = [$activePhotoseries, ...$typePhotoseries])
    : (titlePh = $activePhotoseries);
  console.log(titlePh);

  // INIT
  function initCurtains() {
    curtains = new Curtains({
      container: webgl,
      pixelRatio: 1, // Math.min(1.5, window.devicePixelRatio),
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
  function addPlaneByLoad(event) {
    console.log(Date.now(), "image");
    // debugger;
    // if (planes) {
    // console.log(
    currentPlane = planes.find((pl) => {
      pl.userData.route === event.detail.route;
    });
    console.log(currentPlane);
    //   // event.detail.route
    //   // );
    //   // }
    //   // e.detail.route;
    //   (async () => {
    //     await tick();
    //     // debugger;
    //     planes.forEach((e) => {
    //       // console.log(e.userData.route, event.detail.route);
    //     });

    //     // console.log(event.detail.planeImage);
    //   })();

    //.userData.route, event.detail.route);
    // const planeImages = document.getElementsByClassName("slider__img");
    // await tick();
    // planeImages[pl.index - 1] &&
    //   pl.images.length === 0 &&

    //   pl.loadImage(planeImages[pl.index - 1]);
    // pl.textures[0] &&
    //   pl.textures[0].onSourceUploaded((eee) => {
    //     pl.textures[0].needUpdate();
    //     // console.log(eee, "inside texture loaded");
    //     load++;
    //     console.log(load);
    //     if (pl.relativeTranslation.z < 0) {
    //       pl.visible = 0;
    //     } else {
    //       pl.visible = 1;
    //     }
    //     document.documentElement.style.setProperty(
    //       "--rpeloader__inset",
    //       `${100 - load * (100 / $photoseries.length)}%`
    //     );
    //   });
    // if (pl.images[0]) {
    //   pl.images[0].onload = () => {
    //     pl.textures[0].needUpdate();
    //     getUnifors(pl);
    //   };
    // }
  }
  function addPlane(planeNode) {
    const paramsPlane = {
      widthSegments: 16,
      heightSegments: 16,
      vertexShader: vertex,
      fragmentShader: fragment,
      visible: 0,
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
    const setPlane = (plane) => {
      plane.setRenderTarget(distortionTarget);
      plane.userData = {
        route: plane.htmlElement.dataset.route,
        type: plane.htmlElement.dataset.type,
        color: plane.htmlElement.dataset.color.split(","),
        id: plane.htmlElement.dataset.id,
      };
      // getUnifors(plane, {
      //   pCorr: false,
      //   sCorr: true,
      //   fCorr: true,
      // });
      console.log(Date.now(), "plane");
      plane.onReady(() => {
        planes.push(plane);

        // console.log(plane.htmlElement.dataset.color);
        // setTexture(plane);
      });
      // plane.onAfterResize(() => {
      //   plane.textures[0].needUpdate();
      //   getUnifors(plane);
      // });
      // plane.onLoading(() => {});
      // console.log(plane);
    };
    // [...planeNode].length !== 1
    //   ?
    [...planeNode].forEach((element, i) => {
      const plane = new Plane(curtains, element, paramsPlane);
      setPlane(plane);
    });
    //   : setPlane(new Plane(curtains, planeNode[0], paramsPlane));
    // console.log(planeNode, "planeNode[0]");
  }
  function addTransitionPlane() {
    const params = {
      vertexShader: trvert,
      fragmentShader: trfrag,
      // fov: 1,
      // depthTest: false,
      // transparent: true,
      // renderOrder:1,
      // renderOrder: 1,
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
    planeImages[pl.index - 1] &&
      pl.images.length === 0 &&
      pl.loadImage(planeImages[pl.index - 1]);
    pl.textures[0] &&
      pl.textures[0].onSourceUploaded((eee) => {
        pl.textures[0].needUpdate();
        // console.log(eee, "inside texture loaded");
        load++;
        console.log(load);
        if (pl.relativeTranslation.z < 0) {
          pl.visible = 0;
        } else {
          pl.visible = 1;
        }
        document.documentElement.style.setProperty(
          "--rpeloader__inset",
          `${100 - load * (100 / $photoseries.length)}%`
        );
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
    // const image = new Image();
    // image.src = "image/displacement4.jpg";
    // // set its data-sampler attribute to use in fragment shader
    // image.setAttribute("data-sampler", "displacementTexture");
    // shaderPass.loader.loadImage(image);
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
    context.font = htmlPlaneStyle.fontSize + " " + htmlPlaneStyle.fontFamily;
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
      heightUn = 1;
      radiusCoef = 0.0725;
      setElementSize(0.62, 0.12);
    } else {
      // LANDSCAPE
      aspect = 0.668;
      widthUn = 0.7;
      heightUn = 0.8;
      // widthUn = 1;
      // heightUn = 1;
      radiusCoef = 0.0755;
      setElementSize(0.5);
    }
    if ($page.params.Route && !$eventAnimation) {
      tarnsitionPlane && (tarnsitionPlane.relativeTranslation.x = 0);
    }
    if (!$page.params.Route) {
      transitionState.radiusAnimation = Math.min(
        (window.innerWidth * radiusCoef) / 1.3882 / 2,
        100
      );
      tarnsitionPlane &&
        (tarnsitionPlane.relativeTranslation.x = -window.innerWidth);
    } else {
      transitionState.radiusAnimation = radius;
    }
    if (!$page.params.Route && $homePageState) {
      console.log("ei");
      transitionState.radiusAnimation = radius;
    }
    // if ($page.params.Route && !$homePageState) {
    //   transitionState.radiusAnimation = radius;
    // }
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
  function getUnifors(plane, opt = { pCorr: true, sCorr: true, fCorr: true }) {
    // GET BOUND
    const { width, height, left } = plane.getWebGLBoundingRect();
    const {
      width: curtainsWidth,
      height: curtainsHeight,
    } = curtains.getBoundingRect();
    // const curtainsWidth =
    //     curtains.getBoundingRect().width / curtains.pixelRatio;
    // const curtainsHeight =
    //     curtains.getBoundingRect().height / curtains.pixelRatio;
    const top = (curtainsHeight - height) / 2;
    // debugger;
    console.log(width, height, left, top);
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
      (window.innerHeight * height) / aspect + window.innerWidth * margin * 2;

    radius = elWidth / Math.sin((Math.PI * 2) / $photoseries.length / 2) / 2;

    document.documentElement.style.setProperty(
      "--plane__width",
      `${(window.innerHeight * height) / aspect}px`
    );
    document.documentElement.style.setProperty(
      "--plane__height",
      `${window.innerHeight * height}px`
    );
  }
  function getCurtainsSize() {
    curtainsWidth = curtains.getBoundingRect().width;
    curtainsHeight = curtains.getBoundingRect().height;
  }
  function resize() {
    // planes.forEach((pl) => {
    //   getUnifors(pl);
    // });
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
      plane.isDrawn() && plane.relativeTranslation.z < 0 && (plane.visible = 0);
      plane.visible = plane.relativeTranslation.z > 0 ? true : false;
    });
  }
  //AANIMATE
  function startAnim() {
    if ($page.params.Route) return;
    // homePageState.set(true);
    startAnimation = anime
      .timeline({
        // autoplay: false,
      })
      .add({
        update: () => {},
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
              if (plane.isDrawn && plane.relativeTranslation.z < 0) {
                plane.uniforms.uOpacity.value = transitionState.opacityPlane;
              }
            });
          },
          changeComplete: () => {
            planes.forEach((plane, i) => {
              if (plane.isDrawn && plane.relativeTranslation.z < 0) {
                plane.visible = 0;
                plane.uniforms.uOpacity.value = 1;
              }

              // console.log(plane.relativeTranslation.z);
              // planeChangeView(plane);
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
          ].uniforms.uOpacityTitle.value = transitionState.opacityPlane;
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
      activePlane = planes.find((p) => p.userData.route === $page.params.Route);
    }
    activePlane.setRenderOrder(planes.length + 2);
    tarnsitionPlane.setRenderOrder(planes.length + 1);
    tarnsitionPlane.uniforms.uColor.value = activePlane.userData.color;
    if (!activePlane.isDrawn()) {
      activePlane.visible = 1;
      toRoute.add({
        targets: [sliderState],
        duration: 1000,
        changeBegin: () => {},
        changeComplete: () => {
          sliderState.endPosition = sliderState.translation;
        },
        translation: angleStep * (activePlane.index - 1) * 1000,
        currentPosition: angleStep * (activePlane.index - 1) * 1000,
        easing: "easeOutQuad",
      });
    }
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
          //   homePageState.set(false);
          titleIndex.set(activePlane.index - 1);
          getUnifors(activePlane);
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
    !$typePhotoseries &&
      typePhotoseries.set(
        $photoseriesSort.filter(
          (el) =>
            // el.Type === $page.params.type &&
            el.Route !== activePlane.userData.route //$page.params.Route
        )
      );

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
        },
      });
    toIndex.finished.then(() => {
      eventAnimation.set(true);
      planes.forEach((e, i) => {
        // planeChangeView(e);
      });
      toIndex = null;
      leaveRoute.set(false);
      sliderState.currentPosition = sliderState.endPosition =
        sliderState.translation;
      if (planes.length !== $photoseries.length) {
        (async () => {
          await tick();
          !$homePageState && homePageState.set(true);

          const planeElement = document.getElementsByClassName("plane");
          addPlane(planeElement);
        })();
      }
    });
  }
  function translateSlider(t) {
    curtains.render();

    if ($eventAnimation) {
      sliderState.translation +=
        (sliderState.currentPosition - sliderState.translation) * 0.05;
    }
    disp +=
      (sliderState.currentPosition - sliderState.translation - disp) * 0.3;
    shaderPass && (shaderPass.uniforms.displacement.value = disp / 2500);

    planes.length > 1 &&
      planes.forEach((plane, i) => {
        const angle = angleStep * i;
        transVec.set(
          // X
          Math.cos(
            angle +
              step +
              angleStep -
              sliderState.planeCorrection -
              sliderState.translation / 1000 +
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
              sliderState.translation / 1000 +
              transitionState.time
          ) *
            transitionState.radiusAnimation *
            transitionState.zRoundEnable
        );
        if ($eventAnimation) {
          plane.setScale(
            new Vec2(transitionState.scalePlane, transitionState.scalePlane)
          );
          // if ($homePageState && plane.relativeTranslation.z < 0) {
          //   plane.visible = 0;
          // } else {
          //   plane.visible = 1;
          //   plane.uniforms.uOpacity.value = 1;
          // }
          // if (titlePlaneOnLoad) {
          //   rgbPass.uniforms.scrollEffect.value = disp;
          //   planesTitle[i].setRelativeTranslation(transVec);
          // }
        }
        plane.setRelativeTranslation(transVec);
        if ($homePageState) {
          if (plane.relativeTranslation.z < 0) {
            plane.visible =
              //planesTitle[i].visible =
              false;
          } else {
            plane.visible =
              // planesTitle[i].visible =
              true;
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
      //   testId = el.index;
      //   activePlaneTitle = planesTitle[i];
      eventAnimation.set(false);
      // getUnifors(activePlane);
      toRouteAnim();
      goto(`/photoseries/${el.userData.type}/${el.userData.route}/`);
    });
  }
  function onMouseDown(e) {
    sliderState.isMouseDown = true;
    sliderState.clickDown = getMousePosition(e);
    sliderState.startPosition = sliderState.clickDown[0];
  }
  function onChangeTitle() {
    let index =
      -Math.round(sliderState.currentPosition / (angleStep * 1000)) %
      $photoseries.length;
    // testId = index >= 1 ? $photoseries.length - index : Math.abs(index);
    titleIndex.set(index >= 1 ? $photoseries.length - index : Math.abs(index));
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

<h3 class="main__head">{$photoseriesSort[$titleIndex].Title}</h3>
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
  <div
    data-id={$activePhotoseries.Id}
    data-route={$activePhotoseries.Route}
    data-color={$activePhotoseries.ColorVector}
    data-type={$activePhotoseries.Type}
    class="activeplane plane"
  >
    <a
      style="display: none;"
      href="/photoseries/{$activePhotoseries.Type}/{$activePhotoseries.Route}"
      >r</a
    >
    <PlanePicture on:imageLoaded={addPlaneByLoad} seriya={$activePhotoseries} />
    <!-- <picture class="standart__picture">
      <source
        media="(orientation: portrait)"
        srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/720/{$activePhotoseries.PortraitFileName}.webp"
        type="image/webp"
      />
      <source
        media="(orientation: portrait)"
        srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/jpg/720/{$activePhotoseries.PortraitFileName}.jpg"
        type="image/jpg"
      />
      <source
        media="(orientation: landscape)"
        srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/720/{$activePhotoseries.LandscapeFileName}.webp"
        type="image/webp"
      />
      <img
        style="opacity:0"
        data-sampler="planeTexture"
        data-id={$activePhotoseries.Id}
        class="slider__img"
        alt="SvobodinaPhoto"
        crossorigin="anonimous"
        decoding="async"
        draggable="false"
        src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/jpg/720/{$activePhotoseries.LandscapeFileName}.jpg"
      />
    </picture> -->
  </div>
  {#if $typePhotoseries}
    {#each $typePhotoseries as seriya, index (index)}
      <a style="display: none;" href="/photoseries/{seriya.Type}/{seriya.Route}"
        >r</a
      >
      <!--  -->
      <div
        data-id={seriya.Id}
        data-route={seriya.Route}
        data-color={seriya.ColorVector}
        data-type={seriya.Type}
        class="plane"
      >
        {#if showPicture}
          <PlanePicture on:imageLoaded={addPlaneByLoad} {seriya} />
          <!-- <picture class="standart__picture">
            <source
              media="(orientation: portrait)"
              srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/720/{seriya
                .largePortrait.src}.webp"
              type="image/webp"
            />
            <source
              media="(orientation: portrait)"
              srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/jpg/720/{seriya
                .largePortrait.src}.jpg"
              type="image/jpg"
            />
            <source
              media="(orientation: landscape)"
              srcset="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/webp/720/{seriya
                .largeLandscape.src}.webp"
              type="image/webp"
            />

            <img
              style="opacity:0"
              data-sampler="planeTexture"
              data-id={seriya.Id}
              class="slider__img"
              alt="SvobodinaPhoto"
              crossorigin="anonimous"
              decoding="async"
              draggable="false"
              src="https://raw.githubusercontent.com/iasvobodin/svs/images/static/image/jpg/720/{seriya
                .largeLandscape.src}.jpg"
            />
          </picture> -->
        {/if}
      </div>
    {/each}
  {/if}
</div>
<!-- <div class="title__plane">
  {#each $photoseries as seriya, index (index)}
    <div class="title">
      <h3 class="titleH3">{seriya.Title}</h3>
    </div>
  {/each}
</div> -->

<div bind:this={webgl} id="curtains" />
<div class="transition__plane" />

<!-- <h1>{testId}</h1> -->
<style>
  .standart__picture {
    width: 100%;
    height: 100%;
  }
  .slider__img {
    opacity: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  .transition__plane {
    width: 100%;
    height: calc(var(--vh) * 100);
  }
  .event {
    pointer-events: none;
  }
  .title__plane {
    opacity: 0;
    position: absolute;
    pointer-events: none;
    overflow: hidden;
  }
  .main__head {
    /* -webkit-text-stroke: 1px rgb(0, 0, 0); */
    /* color: transparent; */
    opacity: 0;
    z-index: 3;
    white-space: pre;
    transform: translate(-50%, -50%);
    position: absolute;
    top: calc((100vh - var(--plane__height)) / 4);
    left: 50vw;
    font-family: Cormorant Infant, sans-serif;
    font-weight: 300;
    color: rgb(255, 255, 255);
    margin: 0;
    font-size: clamp(18px, 6vw + 20px, 120px);
    line-height: clamp(20px, 6.5vw + 22px, 130px);
  }
  @media (orientation: landscape) {
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
    .plane,
    .activeplane {
      align-self: center;
      position: absolute;
      box-sizing: border-box;
      height: var(--plane__height);
      width: var(--plane__width);
    }
  }
  @media (orientation: portrait) {
    /* :root {
      --plane__height: 65vh;
      --plane__width: calc(var(--plane__height) * 0.66);
    } */
    .wrapper {
      justify-content: center;
      width: 100%;
      height: 100%;
      height: calc(var(--vh) * 100);
      display: flex;
      position: absolute;
    }
    .plane,
    .activeplane {
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
