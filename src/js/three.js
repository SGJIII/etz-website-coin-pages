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

const FIRST_SECTION_CLASS = ".HeaderSection";
const SECOND_SECTION_CLASS = ".BenefitsSection";
const MODEL_NAME = "etz_8_1.glb";

class MobileModel extends BodyWatcher {
  gltfLoader = null;
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
  secondSection = null;

  startPositionY = 0;
  startPositionX = 0;
  endPositionY = 0;
  endPositionX = 0;

  isLoadedModel = false;
  isLoadedVideoGraph = false;
  isLoadedVideoFlow = false;

  constructor(props) {
    super(props);
    this.gltfLoader = new GLTFLoader();
    this.scene = new THREE.Scene();
    this.secondSection = document.querySelector(SECOND_SECTION_CLASS);
  }

  init() {
    this.loadMobileModel();
    this.startHandleMobileAnimation();

    window.addEventListener("resize", () => {
      this.calculateStartPosition();
      this.calculateEndPositionY();
    });
    AddEventOrientationChange(() => {
      this.calculateStartPosition();
      this.calculateEndPositionY();
    });
    this.calculateStartPosition();
    this.calculateEndPositionY();
  }

  checkLoader() {
    if (
      this.isLoadedModel &&
      this.isLoadedVideoFlow &&
      this.isLoadedVideoGraph
    ) {
      const loader = document.querySelector("[name-loader]");
      document.body.style.overflow = "";
      loader.classList.add("Loader__disapoint");
      setTimeout(() => {
        loader.style.display = "none";
      }, 400);
    }
  }

  setupInitialValue(gltf) {
    if (window.innerWidth > 1200) {
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
    } else if (window.innerWidth < 768) {
      const scaleSize = Number(window.innerHeight * 0.001421800947867).toFixed(
        3
      );
      gltf.scene.scale.set(scaleSize, scaleSize, scaleSize);
      gltf.scene.position.set(0, 0, 0);
    } else {
      gltf.scene.scale.set(2, 2, 2);
      gltf.scene.position.set(0, 0, 0);
    }
  }

  /**
   * Load mobile model
   */
  loadMobileModel() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();

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

    this.gltfLoader.load(MODEL_NAME, (gltf) => {
      this.setupInitialValue(gltf);
      AddEventOrientationChange(() => {
        this.setupInitialValue(gltf);
      });
      window.addEventListener("resize", () => {
        if (!detectDevice()) {
          this.setupInitialValue(gltf);
        }
      });
      this.phoneMesh = gltf.scene.children[0].children[0];
      this.phoneMesh.material.map = this.videoTexture;

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
      this.shadowLayer = gltf.scene.children[0].children.find(
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

      this.isLoadedModel = true;
      this.checkLoader();
    });
  }

  calculateStartPosition() {
    const description = document
      .querySelector("[ name-header-section-description]")
      ?.getBoundingClientRect();
    if (window.innerWidth > window.innerHeight) {
      this.startPositionY =
        this.pageOffset.top - description.top - description.height;
    } else {
      if (window.innerWidth <= 768) {
        this.startPositionY =
          this.pageOffset.top - description.top + window.innerHeight * 0.09;
      } else {
        this.startPositionY =
          this.pageOffset.top - description.top - description.height;
      }
    }

    this.startPositionX = window.innerWidth / 2 - 300;
  }

  calculateEndPositionY() {
    if (window.innerWidth > window.innerHeight) {
      this.endPositionY = 0;
      this.endPositionX = window.innerWidth - 450;
    } else {
      if (window.innerWidth > 1200) {
      } else if (window.innerWidth <= 768) {
        this.endPositionY = -50;
      } else {
        this.endPositionY =
          this.secondSection.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          window.innerHeight / 2 +
          300;
        this.endPositionX = window.innerWidth - 450;
      }
    }
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
    window.cancelAnimationFrame(__idTrick);

    // Debug
    this.debugObject.envMapIntensity = 0.6;

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    /**
     * Models
     */

    let video = document.getElementById("video");
    video.addEventListener(
      "loadeddata",
      () => {
        this.isLoadedVideoGraph = true;
        this.checkLoader();
      },
      false
    );

    window.video = video;
    this.videoTexture = new THREE.VideoTexture(video);
    this.videoTexture.rotation = Math.PI;
    this.videoTexture.center.x = 0.5;
    this.videoTexture.center.y = 0.5;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.wrapS = THREE.RepeatWrapping;
    this.videoTexture.repeat.x = -1;

    let video2 = document.getElementById("video2");
    video.addEventListener(
      "loadeddata",
      () => {
        this.isLoadedVideoFlow = true;
        this.checkLoader();
      },
      false
    );

    window.video2 = video2;
    this.videoTexture2 = new THREE.VideoTexture(video2);
    this.videoTexture2.rotation = Math.PI;
    this.videoTexture2.center.x = 0.5;
    this.videoTexture2.center.y = 0.5;
    this.videoTexture2.minFilter = THREE.LinearFilter;
    this.videoTexture2.magFilter = THREE.LinearFilter;
    this.videoTexture2.wrapS = THREE.RepeatWrapping;
    this.videoTexture2.repeat.x = -1;

    const phoneBlock = document.querySelector("canvas");
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

    if (window.innerWidth > 768 && window.innerWidth <= 1200) {
      // Update sizes
      sizes.width = 600;
      sizes.height =
        window.innerWidth < window.innerHeight ? 600 : window.innerHeight;
    } else {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = mainSection.getBoundingClientRect().height;
    }

    const setSizesScene = () => {
      if (window.innerWidth > 768 && window.innerWidth <= 1200) {
        // Update sizes
        sizes.width = 600;
        sizes.height =
          window.innerWidth < window.innerHeight ? 600 : window.innerHeight;
      } else {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = mainSection.getBoundingClientRect().height;
      }

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

      const mouseWheelDistance = getElementOffsetTop(this.secondSection);

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
        if (scrollTopFrame > mouseWheelDistance) {
          launchAnimation();
          phoneBlock.style.transform = `translate3d(0,${
            mouseWheelDistance + this.endPositionY
          }px,0)`;
          phoneBlock.style.position = "absolute";
        } else {
          if (statusProcess === "start") {
            const deltaY =
              -this.startPositionY +
              ((this.endPositionY + this.startPositionY) / mouseWheelDistance) *
                scrollTopFrame;

            phoneBlock.style.transform = `translate3d(0,${deltaY}px,0)`;
            phoneBlock.style.position = "fixed";
          } else if (statusProcess === "stop") {
            launchAnimation();
            phoneBlock.style.transform = `translate3d(0,${this.endPositionY}px,0)`;
            phoneBlock.style.position = "fixed";
          }
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

      const handleMotionForTablet = () => {
        const statusProcess = phoneBlock.getAttribute("data-status");
        if (scrollTopFrame > mouseWheelDistance) {
          launchAnimation();
          phoneBlock.style.transform = `translate3d(${this.endPositionX}px,${
            mouseWheelDistance + this.endPositionY
          }px,0)`;
          phoneBlock.style.position = "absolute";
        } else {
          if (statusProcess === "start") {
            const deltaY =
              -this.startPositionY +
              ((this.endPositionY + this.startPositionY) / mouseWheelDistance) *
                scrollTopFrame;

            const deltaX =
              this.startPositionX +
              ((this.endPositionX - this.startPositionX) / mouseWheelDistance) *
                scrollTopFrame;
            phoneBlock.style.transform = `translate3d(${deltaX}px,${deltaY}px,0)`;
            phoneBlock.style.position = "fixed";
          } else if (statusProcess === "stop") {
            launchAnimation();
            phoneBlock.style.transform = `translate3d(${this.endPositionX}px,${this.endPositionY}px,0)`;
            phoneBlock.style.position = "fixed";
          }
        }
      };

      if (window.innerWidth > 1200) {
        handleMotionForDesktop();
      } else if (window.innerWidth <= 768) {
        handleMotionForMobile();
      } else {
        handleMotionForTablet();
      }

      const START_OPACITY = 0.2;

      let opacityValue = START_OPACITY;

      if (this.shadowLayer) {
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
          this.phoneMesh.material.map = this.videoTexture2;
          video2.play();
          video.currentTime = 0;
          video.pause();
          this.togglePhoneAssets(false);
        } else {
          this.phoneMesh.material.map = this.videoTexture;
          video.play();
          video2.currentTime = 0;
          video2.pause();
          this.togglePhoneAssets(true);
        }

        this.shadowLayer.material.opacity = opacityValue;
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

      this.videoTexture.needsUpdate = true;

      // Render
      renderer.render(this.scene, camera);

      // Call tick again on the next frame
      __idTrick = window.requestAnimationFrame(() => {
        tick();
      });
    };
    tick();
  }
}
const mobileModel = new MobileModel("[name-mobile-model]");

try {
  mobileModel.init();
} catch (error) {
  setTimeout(() => {
    mobileModel.init();
  }, 100);
}
