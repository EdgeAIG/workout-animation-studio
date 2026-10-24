import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { EXERCISES_3D, MUSCLE_GROUPS } from '../src/exercises-3d.mjs';

const root = new URL('../', import.meta.url);
const file = relative => new URL(relative, root);

function parseGlbJson(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'glTF', 'GLB magic header');
  assert.equal(buffer.readUInt32LE(4), 2, 'GLB version 2');
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'GLB declared file length');
  const chunkLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), 0x4e4f534a, 'first GLB chunk is JSON');
  return JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength).trim());
}

test('ten ordered exercises use source GLB clips, phases, steps, and mapped catalog groups', () => {
  assert.equal(EXERCISES_3D.length, 10);
  assert.deepEqual(
    EXERCISES_3D.map(exercise => exercise.number),
    Array.from({ length: 10 }, (_, index) => String(index + 1).padStart(2, '0')),
  );
  assert.equal(new Set(EXERCISES_3D.map(exercise => exercise.id)).size, 10);
  assert.deepEqual(EXERCISES_3D.map(exercise => exercise.id), [
    'jumping_jack', 'squat', 'push_up', 'bear_crawl', 'crunch',
    'bicycle_crunch', 'burpee', 'situp', 'jog', 'run',
  ]);
  for (const exercise of EXERCISES_3D) {
    assert.ok(exercise.name && exercise.category && exercise.description);
    assert.ok(exercise.steps.length >= 3, `${exercise.name} has steps`);
    assert.ok(exercise.phases.length >= 3, `${exercise.name} has phase cues`);
    assert.equal(exercise.phases[0].at, 0);
    assert.ok(exercise.motion.kind === 'gltf', `${exercise.name} uses a source GLB`);
    assert.match(exercise.motion.sourceUrl, /^https:\/\/assiamahs\.github\.io\/opengym3d\/assets\/.+\.glb$/);
    assert.match(exercise.thumbnail, /^https:\/\/assiamahs\.github\.io\/opengym3d\/assets\/.+\.png$/);
    for (const phase of exercise.phases) {
      assert.ok(phase.title && phase.cue);
      assert.ok(phase.at >= 0 && phase.at < 1);
    }
    for (const group of [...exercise.primary, ...exercise.secondary]) {
      assert.ok(MUSCLE_GROUPS[group.toLowerCase()], `${exercise.name} uses mapped group ${group}`);
    }
  }
});

test('only four CC0 GLBs are bundled; Mixamo catalog assets remain remote-only', () => {
  const local = EXERCISES_3D.filter(exercise => exercise.motion.locallyBundled);
  assert.deepEqual(local.map(exercise => exercise.id), ['jumping_jack', 'push_up', 'bear_crawl', 'jog']);
  assert.ok(local.every(exercise => exercise.license.license === 'CC0-1.0' && exercise.license.pack));

  const mixamo = EXERCISES_3D.filter(exercise => exercise.license.license === 'Mixamo');
  assert.deepEqual(mixamo.map(exercise => exercise.id), ['squat', 'crunch', 'bicycle_crunch', 'burpee', 'situp']);
  assert.ok(mixamo.every(exercise => !exercise.license.pack && !exercise.motion.locallyBundled));
  assert.ok(mixamo.every(exercise => exercise.motion.url.startsWith('https://')));
});

test('bundled CC0 GLBs match the recorded hashes and contain the OpenGym3D rig clips', async () => {
  const expected = [
    ['opengym3d-jumping-jack-cc0.glb', '94aa534eded3272a61f775d3a7067a9093df97c99f5505d64e39251c46697a0e'],
    ['opengym3d-push-up-cc0.glb', '67bfd1bf9c9c679dfd81f34202c661f954ce0ec4b15baac56a5781a372d11326'],
    ['opengym3d-bear-crawl-cc0.glb', 'c0dbaeef8a181f8f23803815de7836a6b18795668d73443b28284aa887285378'],
    ['opengym3d-jog-cc0.glb', '3e20fe0299cd78c9534f4c1320a4e2e4f31f8b4ae51598a69065f93a43a0c020'],
  ];
  const notice = await readFile(file('assets/3d/NOTICE.md'), 'utf8');
  for (const [name, hash] of expected) {
    const buffer = await readFile(file(`assets/3d/${name}`));
    assert.equal(createHash('sha256').update(buffer).digest('hex'), hash, `${name} checksum`);
    const glb = parseGlbJson(buffer);
    assert.ok(glb.animations.some(animation => animation.name === 'Human.rig'), `${name} contains the rig animation`);
    assert.ok(notice.includes(hash), `${name} checksum is recorded in NOTICE.md`);
  }
  assert.match(notice, /CC0-1\.0/);
  assert.match(notice, /pack: false/);
  assert.match(notice, /not.*bundle/i);
});

test('viewer neutralizes fixed GLB vertex colors and uses exercise-specific front/back body maps', async () => {
  const [page, script, bodymap] = await Promise.all([
    readFile(file('index.html'), 'utf8'),
    readFile(file('src/exercise-library.mjs'), 'utf8'),
    readFile(file('src/bodymap.js'), 'utf8'),
  ]);
  assert.match(page, /source 3D clips/i);
  assert.match(page, /primary group/i);
  assert.match(page, /supporting/i);
  assert.match(page, /id="bodymap"/);
  assert.match(script, /neutralizeSourceColors/);
  assert.match(script, /renderBodymap/);
  assert.match(script, /AnimationMixer/);
  assert.match(script, /LoopRepeat/);
  assert.match(script, /OpenGym3D/);
  assert.match(bodymap, /export function renderBodymap/);
  assert.match(bodymap, /primary/);
  assert.match(bodymap, /secondary/);
});
