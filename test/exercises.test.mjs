import test from "node:test";
import assert from "node:assert/strict";
import { EXERCISES } from "../src/exercises.mjs";
import { buildExerciseSvg } from "../src/svg.mjs";

const joints = ["head", "neck", "shoulderL", "shoulderR", "elbowL", "elbowR", "wristL", "wristR", "hip", "kneeL", "kneeR", "ankleL", "ankleR", "toeL", "toeR"];

test("exercise collection has eight uniquely named, categorized loops", () => {
  assert.equal(EXERCISES.length, 8);
  assert.equal(new Set(EXERCISES.map((exercise) => exercise.id)).size, EXERCISES.length);
  for (const exercise of EXERCISES) {
    assert.match(exercise.id, /^[a-z0-9-]+$/);
    assert.ok(exercise.name && exercise.category && exercise.cue);
    assert.ok(Number.isFinite(exercise.duration) && exercise.duration > 0);
  }
});

test("all pose keyframes are complete, ordered, and within the SVG viewBox", () => {
  for (const exercise of EXERCISES) {
    assert.ok(exercise.frames.length >= 3, `${exercise.id} should have at least three poses`);
    assert.equal(exercise.frames[0].t, 0, `${exercise.id} starts at zero`);
    assert.equal(exercise.frames.at(-1).t, 1, `${exercise.id} ends at one`);
    for (let i = 1; i < exercise.frames.length; i++) {
      assert.ok(exercise.frames[i].t > exercise.frames[i - 1].t, `${exercise.id} frame times increase`);
    }
    for (const { pose } of exercise.frames) {
      for (const joint of joints) {
        assert.ok(Array.isArray(pose[joint]) && pose[joint].length === 2, `${exercise.id} missing ${joint}`);
        assert.ok(pose[joint].every((value) => Number.isFinite(value) && value >= 0 && value <= 220), `${exercise.id} has an off-canvas ${joint}`);
      }
    }
  }
});

test("renderer produces standalone animated and reduced-motion SVG", () => {
  for (const exercise of EXERCISES) {
    const animated = buildExerciseSvg(exercise);
    const still = buildExerciseSvg(exercise, { staticMode: true });
    assert.match(animated, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(animated, /<title>/);
    assert.match(animated, /<desc>/);
    assert.match(animated, /repeatCount="indefinite"/);
    assert.doesNotMatch(animated, /undefined|NaN/);
    assert.doesNotMatch(animated, /https?:\/\/(?!www\.w3\.org)/);
    assert.doesNotMatch(still, /<animate\b/);
  }
});

test("renderer keeps SVG instance IDs unique and escapes accessible text", () => {
  const example = { ...EXERCISES[0], name: "Stretch & reset", cue: "Stay <steady> & breathe." };
  const first = buildExerciseSvg(example, { title: 'Move "one" & go', instanceId: "example-one" });
  const second = buildExerciseSvg(example, { title: "Second instance", instanceId: "example-two" });
  assert.match(first, /aria-label="Move &quot;one&quot; &amp; go"/);
  assert.match(first, /Stretch &amp; reset demonstration, original vector loop\. Stay &lt;steady&gt; &amp; breathe\./);
  assert.match(first, /id="halo-example-one"/);
  assert.match(second, /id="halo-example-two"/);
});
