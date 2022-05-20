import * as THREE from "three";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const MODEL_NAME = "etz-7-5.glb";
const SECOND_SECTION_CLASS = ".section_second";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};
debugObject.envMapIntensity = 0.6;
const folderScreen = gui.addFolder("Screen");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

const cubeTextureLoader = new THREE.CubeTextureLoader();

let animationDuration = 0;
let mixer = null;
let mixer2 = null;
let mixer3 = null;
let mixer4 = null;
let mixer5 = null;
let mixer6 = null;
let mixer7 = null;
let mixer8 = null;
let mixer9 = null;
let shadowLayer = null;

let video = document.getElementById("video");
let videoTexture = new THREE.VideoTexture(video);
videoTexture.rotation = Math.PI;
videoTexture.center.x = 0.5;
videoTexture.center.y = 0.5;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.wrapS = THREE.RepeatWrapping;
videoTexture.repeat.x = -1;

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

// scene.background = environmentMap;
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

gltfLoader.load(MODEL_NAME, (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.position.set(2, 0, 0);
  // gltf.scene.rotation.y = - Math.PI * 0.5
  scene.add(gltf.scene);
  console.log(gltf);

  const phoneMesh = gltf.scene.children[0].children[0];

  const movieMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  // phoneMesh.material = movieMaterial;
  phoneMesh.material.map = videoTexture;

  // phoneMesh.position.z = -0.0002;

  // console.log(gltf.scene.children[0].children[0].material);

  // phoneMaterial.material.map = videoTexture;
  // phoneMaterial.material.side = THREE.FrontSide

  phoneMesh.material.metalness = 1.2;
  phoneMesh.material.roughness = 1;

  phoneMesh.receiveShadow = true;

  folderScreen.add(phoneMesh.material, "metalness").min(0).max(2).step(0.01);
  folderScreen.add(phoneMesh.material, "roughness").min(0).max(2).step(0.001);

  // gui.add(phoneMaterial.material, 'map', {
  //     img: phoneMaterial.material.map,
  //     video: videoTexture,
  // }).onFinishChange(() => {
  //     if (phoneMaterial.material.map === videoTexture) {
  //         phoneMaterial.material.metalness = 1.3
  //         phoneMaterial.material.roughness = 2
  //     } else {
  //         phoneMaterial.material.metalness = 0
  //         phoneMaterial.material.roughness = 1
  //     }
  // })

  video.play();

  console.log(gltf);

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
  const animDropAssets = gltf.animations.find((a) => a.name === "dropAssets");
  shadowLayer = gltf.scene.children[0].children.find(
    (a) => a.name === "shadow"
  );

  console.log(shadowLayer);

  // gui.add(shadowLayer.position, 'x').min(0).max(5).step(0.0001)
  // gui.add(shadowLayer.position, 'y').min(0).max(5).step(0.0001)
  // gui.add(shadowLayer.position, 'z').min(0).max(5).step(0.0001)

  // shadowLayer.visible = false

  // const animLevitateBuy = gltf.animations.find(a => a.name === 'levitateBuy');
  // const animLevitateSell = gltf.animations.find(a => a.name === 'levitateSell');
  // const animLevitateTransactions = gltf.animations.find(a => a.name === 'levitateTransactions');
  // const animLevitateAssets = gltf.animations.find(a => a.name === 'levitateAssets');

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

  // mixer6 = new THREE.AnimationMixer(gltf.scene);
  // const action6 = mixer6.clipAction(animLevitateBuy).play();
  //
  // mixer7 = new THREE.AnimationMixer(gltf.scene);
  // const action7 = mixer7.clipAction(animLevitateSell).play();
  //
  // mixer8 = new THREE.AnimationMixer(gltf.scene);
  // const action8 = mixer8.clipAction(animLevitateTransactions).play();
  //
  // mixer9 = new THREE.AnimationMixer(gltf.scene);
  // const action9 = mixer9.clipAction(animLevitateAssets).play();

  updateAllMaterials();
});

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 1.558);
directionalLight.position.set(-3.11, 1.56, 5);
// directionalLight.shadow.camera.far = 15;
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.shadow.radius = 10;

// const directionalLight2 = new THREE.DirectionalLight('#ffffff', 3);
// directionalLight2.position.set(2.25, 3, 2.25);
// directionalLight2.shadow.camera.far = 15;
// directionalLight2.castShadow = true;
// directionalLight2.shadow.mapSize.set(1024, 1024);
// directionalLight2.shadow.normalBias = 0.05;
// directionalLight2.intensity = 0;

scene.add(directionalLight);
const helper = new THREE.DirectionalLightHelper(directionalLight, 3);
// const helper2 = new THREE.DirectionalLightHelper(directionalLight2, 3);
// scene.add(helper, helper2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

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

const folderMapping = gui.addFolder("env map");
const folderLight1 = gui.addFolder("light 1");
const folderShadow = gui.addFolder("shadow");
// const folderLight2 = gui.addFolder('light 2');
// const folderAmbLight = gui.addFolder('ambient light')
const folderCamera = gui.addFolder("camera");

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

// folderAmbLight.add(ambientLight, 'intensity').min(0).max(5).step(0.0001).name('ambientLight');

folderLight1.add(helper, "visible").name("show helper");
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

// folderLight2.add(helper2, 'visible').name('show helper');
// folderLight1.addColor(directionalLight2, 'color');
// folderLight2.add(directionalLight2.position, 'x').min(-5).max(5).step(0.001).name('position X');
// folderLight2.add(directionalLight2.position, 'y').min(-5).max(5).step(0.001).name('position Y');
// folderLight2.add(directionalLight2.position, 'z').min(-5).max(5).step(0.001).name('position Z');
// folderLight2.add(directionalLight2.rotation, 'x').min(-5).max(5).step(0.001).name('rotationX');
// folderLight2.add(directionalLight2.rotation, 'y').min(-5).max(5).step(0.001).name('rotationY');
// folderLight2.add(directionalLight2.rotation, 'z').min(-5).max(5).step(0.001).name('rotationZ');
// folderLight2.add(directionalLight2, 'intensity').min(0).max(5).step(0.001)

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

const tick = () => {
  controls.update();

  let scrollTopFrame =
    document.body.scrollTop || document.documentElement.scrollTop;

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  const phoneBlock = document.querySelector("canvas");

  const mouseWheelDistance = getElementOffsetTop(
    document.querySelector(SECOND_SECTION_CLASS)
  );

  if (scrollTopFrame >= 0 && scrollTopFrame <= mouseWheelDistance) {
    mouseWheelDeltaDistance = scrollTopFrame;

    if (mouseWheelDeltaDistance > mouseWheelDistance) {
      mouseWheelDeltaDistance = mouseWheelDistance;
    } else if (mouseWheelDeltaDistance < 0) {
      mouseWheelDeltaDistance = 0;
    }

    mouseWheelRatio = mouseWheelDeltaDistance / mouseWheelDistance;
  }

  if (scrollTopFrame > mouseWheelDistance) {
    mouseWheelRatio = 1;
    phoneBlock.style.transform = `translate3d(0,${mouseWheelDistance}px,0)`;
    phoneBlock.style.position = "absolute";
  } else {
    phoneBlock.style.transform = ``;
    phoneBlock.style.position = "fixed";
  }

  const START_OPACITY = 0.2;
  const OPACITY_END = 0.97;

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

    shadowLayer.material.opacity = opacityValue;
  }

  // console.log('mouseWheelRatio:', +mouseWheelRatio.toFixed(3), '   opacity: ', +opacityValue.toFixed(3))

  // // Model animation
  if (mixer && mixer2 && mixer3 && mixer4 && mixer5) {
    mixer.setTime(mouseWheelRatio * animationDuration);
    mixer2.setTime(mouseWheelRatio * animationDuration);
    mixer3.setTime(mouseWheelRatio * animationDuration);
    mixer4.setTime(mouseWheelRatio * animationDuration);
    mixer5.setTime(mouseWheelRatio * animationDuration);
    // mixer.update(deltaTime)
  }

  // if (mixer6 && mixer7 && mixer8 && mixer9 && scrollTopFrame === 0) {
  //     mixer6.update(deltaTime);
  //     mixer7.update(deltaTime);
  //     mixer8.update(deltaTime);
  //     mixer9.update(deltaTime);
  // }

  videoTexture.needsUpdate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
