import * as THREE from "three";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { detectDevice } from "./utils/detectDevice";
import { AddEventOrientationChange } from "./utils/addEventOrientationchange";
let __idTrick = 0;

const startHandleMobileAnimation = () => {
  try {
    window.cancelAnimationFrame(__idTrick);
    const MODEL_NAME = "etz_8_1.glb";
    const FIRST_SECTION_CLASS = ".HeaderSection";
    const SECOND_SECTION_CLASS = ".BenefitsSection";

    const active = window.location.hash === "#debug";

    let gui = {};

    // Debug
    const debugObject = {};
    debugObject.envMapIntensity = 0.6;

    let folderScreen = null;

    if (active) {
      gui = new dat.GUI();

      folderScreen = gui.addFolder("Screen");
    }

    /**
     * Base
     */

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Models
     */

    const cubeTextureLoader = new THREE.CubeTextureLoader();

    let animationDuration = 0;
    let mixer,
      mixer2,
      mixer3,
      mixer4,
      mixer5 = null;

    let shadowLayer = null;
    // let phoneMesh2 = null;

    let phoneMesh,
      buyBtnMesh,
      sellBtnMesh,
      transactionsBtnMesh,
      assetsMesh,
      shadowMesh = null;

    let video = document.getElementById("video");
    window.video = video;
    let videoTexture = new THREE.VideoTexture(video);
    videoTexture.rotation = Math.PI;
    videoTexture.center.x = 0.5;
    videoTexture.center.y = 0.5;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.repeat.x = -1;

    let video2 = document.getElementById("video2");
    window.video2 = video2;
    let videoTexture2 = new THREE.VideoTexture(video2);
    videoTexture2.rotation = Math.PI;
    videoTexture2.center.x = 0.5;
    videoTexture2.center.y = 0.5;
    videoTexture2.minFilter = THREE.LinearFilter;
    videoTexture2.magFilter = THREE.LinearFilter;
    videoTexture2.wrapS = THREE.RepeatWrapping;
    videoTexture2.repeat.x = -1;
    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
      "/textures/px.jpg",
      "/textures/nx.jpg",
      "/textures/py.jpg",
      "/textures/ny.jpg",
      "/textures/pz.jpg",
      "/textures/nz.jpg",
    ]);

    environmentMap.rotation = Math.PI * 0.25;
    environmentMap.outputEncoding = THREE.sRGBEncoding;

    scene.environment = environmentMap;

    /**
     * Update all materials
     */
    function updateAllMaterials() {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.envMap = environmentMap;
          child.material.envMapIntensity = debugObject.envMapIntensity;
          child.material.needsUpdate = true;
        }
      });
    }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const phoneBlock = document.querySelector("canvas");
    const secondSection = document.querySelector(SECOND_SECTION_CLASS);

    const endPositionY = -50;
    let startPositionY = -phoneBlock.getAttribute("data-start-position");
    gltfLoader.load(MODEL_NAME, (gltf) => {
      const setupInitialValue = () => {
        startPositionY = -phoneBlock.getAttribute("data-start-position");

        if (window.innerWidth < 1200 || detectDevice()) {
          if (window.matchMedia("(orientation: landscape)").matches) {
            gltf.scene.scale.set(1.7, 1.7, 1.7);
            gltf.scene.position.set(3.2, 0, 0);
          } else {
            const scaleSize = Number(
              window.innerHeight * 0.001421800947867
            ).toFixed(3);
            gltf.scene.scale.set(scaleSize, scaleSize, scaleSize);
            gltf.scene.position.set(0, 0, 0);
          }
        } else {
          if (
            window.innerWidth < 1000 &&
            window.matchMedia("(orientation: landscape)").matches
          ) {
            gltf.scene.scale.set(1.7, 1.7, 1.7);
            gltf.scene.position.set(3.2, 0, 0);
          } else {
            gltf.scene.scale.set(1.7, 1.7, 1.7);
            gltf.scene.position.set(2.2, -0.3, 0);
          }
        }
      };
      setupInitialValue();
      AddEventOrientationChange(setupInitialValue);

      window.addEventListener("resize", () => {
        if (!detectDevice()) {
          setupInitialValue();
        }
      });
      window.scene = gltf.scene;

      phoneMesh = gltf.scene.children[0].children[0];
      phoneMesh.material.map = videoTexture;

      // All meshes
      console.log("All meshes", gltf.scene.children[0].children);

      scene.add(gltf.scene);

      buyBtnMesh = gltf.scene.children[0].children.find(
        (c) => c.name === "buy"
      );
      sellBtnMesh = gltf.scene.children[0].children.find(
        (c) => c.name === "sell"
      );
      transactionsBtnMesh = gltf.scene.children[0].children.find(
        (c) => c.name === "transactions"
      );
      assetsMesh = gltf.scene.children[0].children.find(
        (c) => c.name === "assets"
      );
      shadowMesh = gltf.scene.children[0].children.find(
        (c) => c.name === "shadow"
      );

      const movieMaterial = new THREE.MeshStandardMaterial({
        map: videoTexture,
        side: THREE.FrontSide,
        toneMapped: false,
      });

      phoneMesh.material.metalness = 1.2;
      phoneMesh.material.roughness = 1;

      phoneMesh.receiveShadow = true;

      if (active) {
        folderScreen
          .add(phoneMesh.material, "metalness")
          .min(0)
          .max(2)
          .step(0.01);
        folderScreen
          .add(phoneMesh.material, "roughness")
          .min(0)
          .max(2)
          .step(0.001);
      }

      video.play();
      video2.play();

      // Animation
      mixer = new THREE.AnimationMixer(gltf.scene);

      const animIphoneRotation = gltf.animations.find(
        (a) => a.name === "rotatePhone"
      );
      const animDropBuy = gltf.animations.find((a) => a.name === "dropBuy");
      const animDropSell = gltf.animations.find((a) => a.name === "dropSell");
      const animDropTransactions = gltf.animations.find(
        (a) => a.name === "dropTransactions"
      );
      const animDropAssets = gltf.animations.find(
        (a) => a.name === "dropAssets"
      );
      shadowLayer = gltf.scene.children[0].children.find(
        (a) => a.name === "shadow"
      );

      animationDuration = animIphoneRotation.duration * 0.999;
      const action = mixer.clipAction(animIphoneRotation).play();

      mixer2 = new THREE.AnimationMixer(gltf.scene);
      const action2 = mixer2.clipAction(animDropBuy).play();

      mixer3 = new THREE.AnimationMixer(gltf.scene);
      const action3 = mixer3.clipAction(animDropSell).play();

      mixer4 = new THREE.AnimationMixer(gltf.scene);
      const action4 = mixer4.clipAction(animDropTransactions).play();

      mixer5 = new THREE.AnimationMixer(gltf.scene);
      const action5 = mixer5.clipAction(animDropAssets).play();

      updateAllMaterials();
    });

    /**
     * Lights
     */

    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.558);
    directionalLight.position.set(-3.11, 1.56, 5);
    // directionalLight.shadow.camera.far = 15;
    // directionalLight.castShadow = true;
    // directionalLight.shadow.mapSize.set(1024, 1024);
    // directionalLight.shadow.normalBias = 0.05;
    // directionalLight.shadow.radius = 10;

    scene.add(directionalLight);
    const mainSection = document.querySelector(FIRST_SECTION_CLASS);
    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: mainSection.getBoundingClientRect().height,
    };
    const setSizesScene = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = mainSection.getBoundingClientRect().height;
      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", () => {
      if (detectDevice()) return;
      setSizesScene();
    });

    AddEventOrientationChange(setSizesScene);

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      12,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 25);

    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enabled = false;
    controls.enableDamping = false;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let previousTime = 0;

    function getElementOffsetTop(element) {
      let offsetTop = 0;

      while (element && typeof element.offsetTop === "number") {
        offsetTop += element.offsetTop;
        element = element.parentNode;
      }

      return offsetTop;
    }

    let mouseWheelDeltaDistance = 0;
    let mouseWheelRatio = 0;

    /**
     * GUI
     */

    let folderMapping = null;
    let folderLight1 = null;
    let folderShadow = null;
    let folderCamera = null;

    if (active) {
      folderMapping = gui.addFolder("env map");
      folderLight1 = gui.addFolder("light 1");
      folderShadow = gui.addFolder("shadow");
      folderCamera = gui.addFolder("camera");

      folderMapping
        .add(debugObject, "envMapIntensity")
        .min(0)
        .max(40)
        .step(0.001)
        .onChange(updateAllMaterials);
      folderMapping
        .add(scene, "background", {
          disable: null,
          enable: environmentMap,
        })
        .name("bg envMap");
      folderMapping
        .add(renderer, "toneMappingExposure")
        .min(0)
        .max(10)
        .step(0.01)
        .name("toneMappingExposure");

      folderMapping
        .add(renderer, "toneMapping", {
          NoToneMapping: THREE.NoToneMapping,
          Linear: THREE.LinearToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Cineon: THREE.CineonToneMapping,
          ACES: THREE.ACESFilmicToneMapping,
        })
        .onFinishChange(() => {
          renderer.toneMapping = Number(renderer.toneMapping);
          updateAllMaterials();
        });

      folderLight1.addColor(directionalLight, "color");
      folderLight1
        .add(directionalLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("lightX");
      folderLight1
        .add(directionalLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("lightY");
      folderLight1
        .add(directionalLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.01)
        .name("lightZ");
      folderLight1
        .add(directionalLight.rotation, "x")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("rotationX");
      folderLight1
        .add(directionalLight.rotation, "y")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("rotationY");
      folderLight1
        .add(directionalLight.rotation, "z")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("rotationZ");
      folderLight1
        .add(directionalLight, "intensity")
        .min(0)
        .max(5)
        .step(0.001)
        .name("intensity");

      folderShadow
        .add(directionalLight.shadow, "radius")
        .min(0)
        .max(100)
        .step(0.001)
        .name("shadowRadius");
      folderShadow
        .add(directionalLight.shadow.camera, "far")
        .min(0)
        .max(100)
        .step(0.001)
        .name("shadowCameraFar");
      folderShadow
        .add(directionalLight.shadow, "normalBias")
        .min(0)
        .max(10)
        .step(0.001)
        .name("shadowNormalBias");

      gui.add(renderer, "physicallyCorrectLights");

      gui.add(controls, "enabled").name("Orbit Controls");

      folderCamera
        .add(camera, "far")
        .min(0)
        .max(100)
        .step(1)
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });

      folderCamera
        .add(camera, "fov")
        .min(0)
        .max(100)
        .step(1)
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });

      folderCamera
        .add(camera, "near")
        .min(0)
        .max(1)
        .step(0.01)
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });

      folderCamera
        .add(camera.position, "x", -10, 10, 0.01)
        .name("PositionX")
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });
      folderCamera
        .add(camera.position, "y", -10, 10, 0.01)
        .name("PositionY")
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });
      folderCamera
        .add(camera.position, "z", -20, 40, 0.01)
        .name("PositionZ")
        .onFinishChange(() => {
          camera.updateProjectionMatrix();
        });
    }

    function togglePhoneAssets(v) {
      buyBtnMesh.visible = v;
      sellBtnMesh.visible = v;
      transactionsBtnMesh.visible = v;
      assetsMesh.visible = v;
      shadowMesh.visible = v;
    }

    const slider = document.querySelector("[name-benefits-section]");
    const launchAnimation = () => {
      mouseWheelRatio = 1;
      slider?.setAttribute("data-play", "1");
    };
    const tick = () => {
      controls.update();

      let scrollTopFrame =
        document.body.scrollTop || document.documentElement.scrollTop;

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      const mouseWheelDistance = getElementOffsetTop(secondSection);

      if (scrollTopFrame >= 0 && scrollTopFrame <= mouseWheelDistance) {
        mouseWheelDeltaDistance = scrollTopFrame;

        if (mouseWheelDeltaDistance > mouseWheelDistance) {
          mouseWheelDeltaDistance = mouseWheelDistance;
        } else if (mouseWheelDeltaDistance < 0) {
          mouseWheelDeltaDistance = 0;
        }

        mouseWheelRatio = mouseWheelDeltaDistance / mouseWheelDistance;
      }
      const handleMotionForMobile = () => {
        const statusProcess = phoneBlock.getAttribute("data-status");
        if (statusProcess === "stop") {
          launchAnimation();
          phoneBlock.style.transform = `translate3d(0,${endPositionY}px,0)`;
          phoneBlock.style.position = "fixed";
        } else {
          const deltaY =
            -startPositionY +
            (startPositionY / mouseWheelDistance) * scrollTopFrame +
            (endPositionY / mouseWheelDistance) * scrollTopFrame;
          phoneBlock.style.transform = `translate3d(0,${deltaY}px,0)`;
          phoneBlock.style.position = "fixed";
        }
        if (scrollTopFrame > mouseWheelDistance) {
          launchAnimation();
          phoneBlock.style.transform = `translate3d(0,${
            mouseWheelDistance + endPositionY
          }px,0)`;
          phoneBlock.style.position = "absolute";
        }
      };
      const statusProcess = phoneBlock.getAttribute("data-status");

      const handleMotionForDesktop = () => {
        if (
          scrollTopFrame >= mouseWheelDistance ||
          (statusProcess === "stop" && scrollTopFrame === 0)
        ) {
          launchAnimation();
          phoneBlock.style.transform = `translate3d(0,${mouseWheelDistance}px,0)`;
          phoneBlock.style.position = "absolute";
        } else {
          phoneBlock.style.transform = ``;
          phoneBlock.style.position = "fixed";
        }
      };

      if (
        (detectDevice() || window.innerWidth < 1200 || screen.width < 900) &&
        !window.matchMedia("(orientation: landscape)").matches
      ) {
        if (window.innerWidth > 768) {
          if (statusProcess === "stop") {
            launchAnimation();
          }
          phoneBlock.style.transform = ``;
          phoneBlock.style.position = "fixed";

          if (
            statusProcess === "start" &&
            scrollTopFrame > mouseWheelDistance
          ) {
            launchAnimation();
            phoneBlock.style.transform = `translate3d(0,${mouseWheelDistance}px,0)`;
            phoneBlock.style.position = "absolute";
          }
        } else {
          handleMotionForMobile();
        }
      } else {
        handleMotionForDesktop();
      }

      const START_OPACITY = 0.2;

      let opacityValue = START_OPACITY;

      if (shadowLayer) {
        if (mouseWheelRatio <= 0.8) {
          opacityValue = 0.2 + mouseWheelRatio;
        }

        if (mouseWheelRatio > 0.8) {
          opacityValue = 1 - (mouseWheelRatio - 0.8) * 5;
        }

        if (mouseWheelRatio >= 1) {
          opacityValue = 0;
        }

        if (mouseWheelRatio >= 1) {
          phoneMesh.material.map = videoTexture2;
          video2.play();
          video.currentTime = 0;
          video.pause();
          togglePhoneAssets(false);
        } else {
          phoneMesh.material.map = videoTexture;
          video.play();
          video2.currentTime = 0;
          video2.pause();
          togglePhoneAssets(true);
        }

        shadowLayer.material.opacity = opacityValue;
      }

      // // Model animation
      if (mixer && mixer2 && mixer3 && mixer4 && mixer5) {
        mixer.setTime(mouseWheelRatio * animationDuration);
        mixer2.setTime(mouseWheelRatio * animationDuration);
        mixer3.setTime(mouseWheelRatio * animationDuration);
        mixer4.setTime(mouseWheelRatio * animationDuration);
        mixer5.setTime(mouseWheelRatio * animationDuration);
      }

      videoTexture.needsUpdate = true;

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      __idTrick = window.requestAnimationFrame(tick);
    };
    tick();
  } catch (error) {
    setTimeout(() => {
      startHandleMobileAnimation();
    }, 100);
  }
};
startHandleMobileAnimation();
