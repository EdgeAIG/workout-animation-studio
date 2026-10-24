import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { EXERCISES } from "../src/exercises.mjs";
import { buildExerciseSvg } from "../src/svg.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(here, "../assets");
await mkdir(output, { recursive: true });
for (const exercise of EXERCISES) {
  const svg = buildExerciseSvg(exercise, { title: `${exercise.name} — workout animation` });
  await writeFile(path.join(output, `${exercise.id}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`, "utf8");
}
const manifest = {
  title: "Motion Library — original workout loops",
  format: "self-contained animated SVG (SMIL)",
  generated: new Date().toISOString().slice(0, 10),
  count: EXERCISES.length,
  assets: EXERCISES.map(({ id, name, category, muscle, level, accent, cue }) => ({ id, name, file: `${id}.svg`, category, muscle, level, accent, cue })),
};
await writeFile(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Exported ${EXERCISES.length} standalone SVG animations to ${output}`);
