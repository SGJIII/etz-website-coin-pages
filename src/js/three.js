import * as THREE from "three";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { detectDevice } from "./utils/detectDevice";
import { AddEventOrientationChange } from "./utils/addEventOrientationchange";
import BodyWatcher from "./utils/bodyWatcher";
import { AddEventOrientationChange } from "./utils/addEventOrientationchange";
let __idTrick = 0;

class MobileModel extends BodyWatcher {
  startPositionY = 0;
  gltfLoader = null;
  MODEL_NAME = "etz_8_1.glb";
  phoneMesh = null;
  videoTexture = null;
  videoTexture2 = null;
  buyBtnMesh = null;
  sellBtnMesh = null;
  transactionsBtnMesh = null;
  assetsMesh = null;
  shadowMesh = null;
  mixer = null;
  mixer2 = null;
  mixer3 = null;
  mixer4 = null;
  mixer5 = null;
  shadowLayer = null;
  animationDuration = 0;
  scene = null;
  environmentMap = null;
  debugObject = {};

  constructor(props) {
    super(props);
    this.gltfLoader = new GLTFLoader();
    this.scene = new THREE.Scene();
  }

  init() {
    this.startHandleMobileAnimation();
    window.addEventListener("resize", () => {
      this.calculateStartPositionY();
    });
    AddEventOrientationChange(() => {
      this.calculateStartPositionY();
    });
    this.calculateStartPositionY();
  }

  calculateStartPositionY() {
    const description = document
      .querySelector("[ name-header-section-description]")
      ?.getBoundingClientRect();

    this.startPositionY = Math.abs(this.pageOffset.top) - description.top;
  }

  /**
   * Update all materials
   */
  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = this.debugObject.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }

  togglePhoneAssets(v) {
    this.buyBtnMesh.visible = v;
    this.sellBtnMesh.visible = v;
    this.transactionsBtnMesh.visible = v;
    this.assetsMesh.visible = v;
    this.shadowMesh.visible = v;
  }
  startHandleMobileAnimation() {
    try {
      window.cancelAnimationFrame(__idTrick);
      const FIRST_SECTION_CLASS = ".HeaderSection";
      const SECOND_SECTION_CLASS = ".BenefitsSection";

      let gui = {};

      // Debug
      this.debugObject.envMapIntensity = 0.6;

      /**
       * Base
       */

      // Canvas
      const canvas = document.querySelector("canvas.webgl");

      /**
       * Models
       */

      const cubeTextureLoader = new THREE.CubeTextureLoader();

      let shadowLayer = null;
      // let phoneMesh2 = null;

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
      this.environmentMap = cubeTextureLoader.load([
        "/textures/px.jpg",
        "/textures/nx.jpg",
        "/textures/py.jpg",
        "/textures/ny.jpg",
        "/textures/pz.jpg",
        "/textures/nz.jpg",
      ]);

      this.environmentMap.rotation = Math.PI * 0.25;
      this.environmentMap.outputEncoding = THREE.sRGBEncoding;

      this.scene.environment = this.environmentMap;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");

      this.gltfLoader.setDRACOLoader(dracoLoader);

      const phoneBlock = document.querySelector("canvas");
      const secondSection = document.querySelector(SECOND_SECTION_CLASS);

      const endPositionY = -50;
      this.gltfLoader.load(this.MODEL_NAME, (gltf) => {
        const setupInitialValue = () => {
          if (window.innerWidth <= 1200 || detectDevice()) {
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
        this.phoneMesh = gltf.scene.children[0].children[0];
        this.phoneMesh.material.map = videoTexture;

        // All meshes
        this.scene.add(gltf.scene);

        this.buyBtnMesh = gltf.scene.children[0].children.find(
          (c) => c.name === "buy"
        );
        this.sellBtnMesh = gltf.scene.children[0].children.find(
          (c) => c.name === "sell"
        );
        this.transactionsBtnMesh = gltf.scene.children[0].children.find(
          (c) => c.name === "transactions"
        );
        this.assetsMesh = gltf.scene.children[0].children.find(
          (c) => c.name === "assets"
        );
        this.shadowMesh = gltf.scene.children[0].children.find(
          (c) => c.name === "shadow"
        );

        this.phoneMesh.material.metalness = 1.2;
        this.phoneMesh.material.roughness = 1;

        this.phoneMesh.receiveShadow = true;

        video.play();
        video2.play();

        // Animation
        this.mixer = new THREE.AnimationMixer(gltf.scene);

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

        this.animationDuration = animIphoneRotation.duration * 0.999;
        this.mixer.clipAction(animIphoneRotation).play();

        this.mixer2 = new THREE.AnimationMixer(gltf.scene);
        this.mixer2.clipAction(animDropBuy).play();

        this.mixer3 = new THREE.AnimationMixer(gltf.scene);
        this.mixer3.clipAction(animDropSell).play();

        this.mixer4 = new THREE.AnimationMixer(gltf.scene);
        this.mixer4.clipAction(animDropTransactions).play();

        this.mixer5 = new THREE.AnimationMixer(gltf.scene);
        this.mixer5.clipAction(animDropAssets).play();

        this.updateAllMaterials();

        const loader = document.querySelector("[name-loader]");
        document.body.style.overflow = "";
        loader.classList.add("Loader__disapoint");
        setTimeout(() => {
          loader.style.display = "none";
        }, 400);
      });

      /**
       * Lights
       */

      const directionalLight = new THREE.DirectionalLight("#ffffff", 1.558);
      directionalLight.position.set(-3.11, 1.56, 5);

      this.scene.add(directionalLight);
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

      this.scene.add(camera);

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
              -this.startPositionY +
              (this.startPositionY / mouseWheelDistance) * scrollTopFrame +
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
          (detectDevice() || window.innerWidth <= 1200 || screen.width < 900) &&
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
            this.phoneMesh.material.map = videoTexture2;
            video2.play();
            video.currentTime = 0;
            video.pause();
            this.togglePhoneAssets(false);
          } else {
            this.phoneMesh.material.map = videoTexture;
            video.play();
            video2.currentTime = 0;
            video2.pause();
            this.togglePhoneAssets(true);
          }

          shadowLayer.material.opacity = opacityValue;
        }

        // // Model animation
        if (
          this.mixer &&
          this.mixer2 &&
          this.mixer3 &&
          this.mixer4 &&
          this.mixer5
        ) {
          this.mixer.setTime(mouseWheelRatio * this.animationDuration);
          this.mixer2.setTime(mouseWheelRatio * this.animationDuration);
          this.mixer3.setTime(mouseWheelRatio * this.animationDuration);
          this.mixer4.setTime(mouseWheelRatio * this.animationDuration);
          this.mixer5.setTime(mouseWheelRatio * this.animationDuration);
        }

        videoTexture.needsUpdate = true;

        // Render
        renderer.render(this.scene, camera);

        // Call tick again on the next frame
        __idTrick = window.requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      setTimeout(() => {
        this.startHandleMobileAnimation();
      }, 100);
    }
  }
}
const mobileModel = new MobileModel("[name-mobile-model]");

mobileModel.init();
