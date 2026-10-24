import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXERCISES_3D, MUSCLE_GROUPS } from './exercises-3d.mjs';
import { renderBodymap } from './bodymap.js';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NEUTRAL_MODEL_COLOR = new THREE.Color('#b9c5bf');

const viewport = document.querySelector('#viewport');
const loading = document.querySelector('#loading');
const loadingTitle = document.querySelector('#loading-title');
const loadingNote = document.querySelector('#loading-note');
const status = document.querySelector('#render-status');
const stageTitle = document.querySelector('#stage-title');
const phaseTitle = document.querySelector('#phase-title');
const phaseCue = document.querySelector('#phase-cue');
const playButton = document.querySelector('#play');
const scrub = document.querySelector('#scrub');
const timeReadout = document.querySelector('#time-readout');
const speedSelect = document.querySelector('#speed');
const exerciseGrid = document.querySelector('#exercise-grid');

let renderer;
let scene;
let camera;
let controls;
let loader;
let modelRoot = null;
let mixer = null;
let currentExercise = null;
let duration = 1;
let elapsed = 0;
let speed = Number(speedSelect.value);
let playing = !REDUCED_MOTION;
let motionReady = false;
let phaseIndex = -1;
let lastFrame = 0;
let selectionToken = 0;
let resizeObserver;
let currentView = 'front';

const selectedDefault = EXERCISES_3D[0];

function setStatus(label, state = '') {
  status.textContent = label;
  status.classList.toggle('ready', state === 'ready');
  status.classList.toggle('error', state === 'error');
}

function showLoading(title, note = 'Loading the original OpenGym3D motion clip.') {
  loadingTitle.textContent = title;
  if (loadingNote) loadingNote.textContent = note;
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function labelForMuscle(group) {
  return MUSCLE_GROUPS[group.toLowerCase()]?.label ?? group;
}

function updatePlayButton() {
  playButton.textContent = playing ? 'Ⅱ' : '▶';
  playButton.disabled = !motionReady;
  scrub.disabled = !motionReady;
  playButton.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
  playButton.setAttribute('aria-pressed', String(playing));
}

function updateReadout() {
  const safeDuration = Math.max(duration, 0.1);
  timeReadout.value = `${elapsed.toFixed(1)} / ${safeDuration.toFixed(1)} s`;
  timeReadout.textContent = timeReadout.value;
  scrub.value = String(Math.round((elapsed / safeDuration) * 1000));
}

function getPhaseIndex(normalizedTime) {
  const phases = currentExercise?.phases ?? [];
  let selected = 0;
  for (let index = 0; index < phases.length; index += 1) {
    if (normalizedTime >= phases[index].at) selected = index;
    else break;
  }
  return selected;
}

function updatePhase(force = false) {
  const phases = currentExercise?.phases ?? [];
  if (!phases.length) return;
  const normalizedTime = (elapsed / Math.max(duration, 0.1)) % 1;
  const index = getPhaseIndex(normalizedTime);
  if (!force && index === phaseIndex) return;
  phaseIndex = index;
  phaseTitle.textContent = phases[index].title;
  phaseCue.textContent = phases[index].cue;
}

function makeScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#141c18');
  scene.fog = new THREE.Fog('#141c18', 10, 22);

  scene.add(new THREE.HemisphereLight(0xe8f0ec, 0x313a35, 2.0));
  const keyLight = new THREE.DirectionalLight(0xfff4e7, 3.0);
  keyLight.position.set(-3.5, 5.5, 4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.025;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xb5e3d1, 1.25);
  fillLight.position.set(4, 3, -3);
  scene.add(fillLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ color: 0x18221c, roughness: 0.96, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.014;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(8, 32, 0x3b4d40, 0x2a382f);
  grid.position.y = -0.008;
  grid.material.transparent = true;
  grid.material.opacity = 0.32;
  scene.add(grid);

  const stage = new THREE.Mesh(
    new THREE.RingGeometry(0.61, 0.625, 72),
    new THREE.MeshBasicMaterial({ color: 0x68806b, transparent: true, opacity: 0.6, side: THREE.DoubleSide }),
  );
  stage.rotation.x = -Math.PI / 2;
  stage.position.y = -0.006;
  scene.add(stage);

  camera = new THREE.PerspectiveCamera(38, 1, 0.05, 60);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 2.15;
  controls.maxDistance = 8;
  controls.minPolarAngle = 0.13;
  controls.maxPolarAngle = Math.PI * 0.49;
  setCameraView('reset');
}

function resize() {
  if (!renderer || !camera || !viewport) return;
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function loadGltf(url, onProgress) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, onProgress, reject);
  });
}

function neutralizeSourceColors(root) {
  root.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;

    const colorAttribute = object.geometry?.getAttribute('color');
    if (colorAttribute) {
      const color = NEUTRAL_MODEL_COLOR;
      for (let index = 0; index < colorAttribute.count; index += 1) {
        colorAttribute.setXYZ(index, color.r, color.g, color.b);
      }
      colorAttribute.needsUpdate = true;
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      material.color.set(colorAttribute ? 0xffffff : NEUTRAL_MODEL_COLOR);
      material.vertexColors = Boolean(colorAttribute);
      material.needsUpdate = true;
    }
  });
}

function disposeObjectTree(root) {
  root.traverse(object => {
    if (object.geometry) object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if (value?.isTexture) value.dispose();
      }
      material.dispose();
    }
  });
}

function removeCurrentModel() {
  if (mixer) {
    mixer.stopAllAction();
    if (modelRoot) mixer.uncacheRoot(modelRoot);
    mixer = null;
  }
  if (modelRoot) {
    scene.remove(modelRoot);
    disposeObjectTree(modelRoot);
    modelRoot = null;
  }
}

function setCameraView(requestedView) {
  if (!camera || !controls) return;
  const preferred = currentExercise?.camera === 'side' ? 'side' : 'front';
  const view = requestedView === 'reset' ? preferred : requestedView;
  const target = new THREE.Vector3(0, 0.86, 0);
  const offset = view === 'side'
    ? new THREE.Vector3(3.55, 0.18, 0.28)
    : new THREE.Vector3(0.03, 0.2, 3.65);
  camera.position.copy(target).add(offset);
  controls.target.copy(target);
  camera.lookAt(target);
  controls.update();
  currentView = view;
  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
}

function renderExerciseCards() {
  exerciseGrid.replaceChildren();
  for (const exercise of EXERCISES_3D) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'exercise-card';
    button.dataset.exercise = exercise.id;
    button.setAttribute('aria-pressed', String(exercise.id === currentExercise?.id));
    button.setAttribute('aria-label', `${exercise.number} ${exercise.name}. Primary focus: ${exercise.primary.map(labelForMuscle).join(', ')}.`);

    const image = document.createElement('img');
    image.className = 'card-thumb';
    image.src = exercise.thumbnail;
    image.alt = `${exercise.name} motion preview`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => image.classList.add('thumb-unavailable'), { once: true });

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const top = document.createElement('div');
    top.className = 'card-top';
    const number = document.createElement('span');
    number.className = 'card-number';
    number.textContent = `MOVE / ${exercise.number}`;
    const category = document.createElement('span');
    category.className = 'card-category';
    category.textContent = exercise.category;
    top.append(number, category);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = exercise.name;
    const focus = document.createElement('div');
    focus.className = 'card-focus';
    const primary = document.createElement('span');
    primary.className = 'primary-focus';
    primary.textContent = exercise.primary.map(labelForMuscle).join(' · ');
    focus.append(primary);
    const supporting = document.createElement('span');
    supporting.textContent = `+ ${exercise.secondary.map(labelForMuscle).join(' · ')}`;
    focus.append(supporting);

    const motionBadge = document.createElement('span');
    motionBadge.className = 'card-motion-badge';
    motionBadge.textContent = '3D CLIP';
    meta.append(top, title, focus);
    button.append(image, motionBadge, meta);
    exerciseGrid.append(button);
  }
}

function updateSelectedCard() {
  document.querySelectorAll('[data-exercise]').forEach(card => {
    card.setAttribute('aria-pressed', String(card.dataset.exercise === currentExercise?.id));
  });
}

function renderMuscleList(container, groups, kind) {
  container.replaceChildren();
  if (!groups.length) {
    const empty = document.createElement('span');
    empty.className = 'group-empty';
    empty.textContent = 'None listed';
    container.append(empty);
    return;
  }
  for (const group of groups) {
    const chip = document.createElement('span');
    chip.className = `group-chip${kind === 'secondary' ? ' secondary' : ''}`;
    chip.textContent = labelForMuscle(group);
    container.append(chip);
  }
}

function renderSelectedExercise(exercise) {
  currentExercise = exercise;
  document.querySelector('#exercise-number').textContent = exercise.number;
  document.querySelector('#exercise-title').textContent = exercise.name;
  document.querySelector('#exercise-meta').textContent = `${exercise.category} · ${exercise.level}`;
  document.querySelector('#exercise-description').textContent = exercise.description;
  const sourcePill = document.querySelector('#motion-source');
  sourcePill.textContent = exercise.motion.source;
  sourcePill.title = `Motion asset license: ${exercise.motion.license}`;
  sourcePill.classList.toggle('remote-only', !exercise.motion.locallyBundled);
  document.querySelector('#steps').replaceChildren(...exercise.steps.map(step => {
    const item = document.createElement('li');
    item.textContent = step;
    return item;
  }));
  renderMuscleList(document.querySelector('#primary-groups'), exercise.primary, 'primary');
  renderMuscleList(document.querySelector('#secondary-groups'), exercise.secondary, 'secondary');
  renderBodymap(document.querySelector('#bodymap'), exercise);
  stageTitle.textContent = `${exercise.name.toUpperCase()} · SOURCE 3D MOTION`;
  phaseIndex = -1;
  updatePhase(true);
  updateSelectedCard();
}

async function selectExercise(exercise) {
  if (exercise.id === currentExercise?.id && motionReady) {
    elapsed = 0;
    mixer?.setTime(0);
    playing = !REDUCED_MOTION;
    lastFrame = 0;
    updateReadout();
    updatePhase(true);
    updatePlayButton();
    return;
  }

  const token = ++selectionToken;
  renderSelectedExercise(exercise);
  elapsed = 0;
  duration = 1;
  playing = false;
  motionReady = false;
  lastFrame = 0;
  setCameraView('reset');
  updatePlayButton();
  updateReadout();
  setStatus('Loading motion clip');
  showLoading(`Loading ${exercise.name}…`, 'The original 3D model and animation are being loaded.');
  removeCurrentModel();

  try {
    const gltf = await loadGltf(exercise.motion.url, event => {
      if (token !== selectionToken || !event.lengthComputable || event.total <= 0) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      showLoading(`Loading ${exercise.name}… ${percent}%`, 'The original 3D model and animation are being loaded.');
    });
    if (token !== selectionToken) {
      disposeObjectTree(gltf.scene);
      return;
    }
    if (!gltf.animations?.length) throw new Error('This GLB does not contain an animation clip.');

    modelRoot = gltf.scene;
    modelRoot.name = `${exercise.name} · OpenGym3D source model`;
    neutralizeSourceColors(modelRoot);
    scene.add(modelRoot);

    mixer = new THREE.AnimationMixer(modelRoot);
    duration = Math.max(...gltf.animations.map(animation => animation.duration));
    for (const animation of gltf.animations) {
      mixer.clipAction(animation).setLoop(THREE.LoopRepeat, Infinity).play();
    }
    mixer.setTime(0);

    if (token !== selectionToken) return;
    motionReady = true;
    playing = !REDUCED_MOTION;
    updatePlayButton();
    updateReadout();
    updatePhase(true);
    setStatus('Original 3D clip ready', 'ready');
    hideLoading();
  } catch (error) {
    console.error(`Could not load ${exercise.name}:`, error);
    if (token !== selectionToken) return;
    removeCurrentModel();
    motionReady = false;
    playing = false;
    updatePlayButton();
    setStatus('Motion load failed', 'error');
    showLoading('This motion could not be loaded.', 'Check the connection, then select the exercise again. Remote source clips need internet access.');
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  if (!renderer || !scene || !camera) return;
  if (!lastFrame) lastFrame = now;
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (playing && motionReady && mixer) {
    elapsed = (elapsed + delta * speed) % duration;
    mixer.update(delta * speed);
    updateReadout();
    updatePhase();
  }
  controls?.update();
  renderer.render(scene, camera);
}

function bindControls() {
  playButton.addEventListener('click', () => {
    if (!motionReady) return;
    playing = !playing;
    if (playing && elapsed >= duration) elapsed = 0;
    lastFrame = 0;
    updatePlayButton();
  });

  scrub.addEventListener('input', () => {
    if (!motionReady) return;
    elapsed = (Number(scrub.value) / 1000) * duration;
    playing = false;
    lastFrame = 0;
    mixer?.setTime(elapsed);
    updatePlayButton();
    updateReadout();
    updatePhase(true);
  });

  speedSelect.addEventListener('change', () => {
    speed = Number(speedSelect.value);
  });

  exerciseGrid.addEventListener('click', event => {
    const card = event.target.closest('[data-exercise]');
    const exercise = EXERCISES_3D.find(item => item.id === card?.dataset.exercise);
    if (exercise) void selectExercise(exercise);
  });

  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => setCameraView(button.dataset.view));
  });

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      playing = false;
      updatePlayButton();
    }
  });
}

function makeRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio <= 1.5, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor('#141c18', 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive three-dimensional exercise character');
  renderer.domElement.setAttribute('role', 'img');
  viewport.prepend(renderer.domElement);
  loader = new GLTFLoader();
  loader.setCrossOrigin('anonymous');
  makeScene();
  resize();
}

function renderError(error) {
  console.error('Unable to initialize 3D exercise library:', error);
  setStatus('3D unavailable', 'error');
  showLoading('Could not start the 3D viewer.', 'This browser may not support WebGL. Try a recent browser with hardware acceleration enabled.');
}

try {
  makeRenderer();
  bindControls();
  renderExerciseCards();
  requestAnimationFrame(animate);
  void selectExercise(selectedDefault);
} catch (error) {
  renderError(error);
}

updatePlayButton();
