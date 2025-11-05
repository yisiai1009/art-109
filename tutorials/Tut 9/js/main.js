import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
dirLight.position.set(2, 3, 4);
scene.add(dirLight);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.7));
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x56a0ff, metalness: 0.2, roughness: 0.7 })
);
box.position.x = 1.6;
scene.add(box);

const tex = new THREE.TextureLoader().load('textures/cat1.jpg', () => console.log('cat texture loaded'));
if (tex) tex.colorSpace = THREE.SRGBColorSpace;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 16),
  new THREE.MeshStandardMaterial({ map: tex, metalness: 0.0, roughness: 0.6 })
);
sphere.position.x = -1.6;
scene.add(sphere);

let model = null;
const draco = new DRACOLoader();
draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.174.0/examples/jsm/libs/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);
gltfLoader.load(
  'models/fish-bones.gltf',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    const box3 = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box3.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 1.5 / maxDim;
    model.scale.setScalar(s);
    const box4 = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box4.getCenter(center);
    model.position.sub(center);
    model.position.y -= box4.min.y * s;
    console.log('fish bones loaded');
  },
  undefined,
  (e) => console.warn('fish bones load error', e)
);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function tick() {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  sphere.rotation.y += 0.01;
  if (model) model.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
