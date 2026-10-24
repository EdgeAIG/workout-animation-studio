# Workout Motion — 10 source-animated 3D exercises

The main page is a ten-movement 3D viewer. It now plays the original skinned GLB animation for each exercise from the OpenGym3D library rather than the improvised hand-keyframed loops that were rejected for weak motion quality.

1. Jumping Jack
2. Bodyweight Squat
3. Push-Up
4. Bear Crawl
5. Crunch
6. Bicycle Crunch
7. Burpee
8. Sit-Up
9. Jog in Place
10. Run / Sprint

Choose a card to load the source animation, follow a loop-phase cue, inspect the exercise instructions, and view the catalog-listed primary and supporting muscle groups on front/back body maps. The animated 3D character is kept neutral: fixed red patches in the GLBs are overwritten at runtime, so they are not misrepresented as exercise-specific activity. The red/amber body maps are schematic indications of catalog target groups—not measured activation or clinical guidance.

## Run locally

The viewer uses local Three.js files, four locally bundled CC0 motion files, and some source-hosted OpenGym3D clips and thumbnails. Internet access is therefore required for the hosted clips and thumbnails; the Mixamo-tagged clips are streamed from the source project and are not included in this repository.

```bash
npm test
npm run build
npm start
```

Open `http://localhost:4173`. The selected motion starts automatically unless the browser requests reduced motion. Controls include play/pause, timeline scrubbing, speed, orbit/zoom, and front/side/reset views. The source catalog camera angle is used as the initial view for each exercise.

## Publish with GitHub Pages

A ready-to-run workflow is included at `.github/workflows/pages.yml`. To publish this folder as the repository root:

1. Create a GitHub repository and upload/push the contents of `workout-animation-studio/` to its `main` (or `master`) branch.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build/deployment source.
3. The workflow runs the tests and asset build, then deploys the static site. Its URL appears in the workflow run and the Pages settings.

The site is static; no build framework or package installation is needed. Six of the ten motion files and the thumbnails load from OpenGym3D, so those previews require internet access. Check `assets/3d/NOTICE.md` before redistributing or shipping any source motion files.

## Asset and license notes

- Four CC0-1.0 GLBs are bundled locally: jumping jack, push-up, bear crawl, and jog in place. Their source URLs and checksums are in [`assets/3d/NOTICE.md`](assets/3d/NOTICE.md).
- Squat, crunch, bicycle crunch, burpee, and sit-up are marked Mixamo with `pack: false` in the OpenGym3D catalog. This project does not bundle or redistribute those GLBs; the preview loads them from the source host on demand. Do not package them without obtaining the applicable rights.
- Run/sprint is cataloged as CC0-1.0 and is streamed from OpenGym3D because it is not one of the four local copies.
- The OpenGym3D body-map implementation used in `src/bodymap.js` is MIT-licensed; attribution and license text are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
- Three.js r170 and its GLTF/OrbitControls modules are in `vendor/three/`, under the included MIT notice.
- No character, animation, or other asset was extracted from the referenced Leap Fitness app. The project does not claim to match that app.

The source catalog does not include a neck-rotation animation. The earlier custom neck draft is intentionally not counted as one of these ten because its motion quality did not meet the requested bar.

## Project pages

- `index.html` — the current ten-exercise 3D viewer.
- `opengym3d.html` — retained link/embed to the original, separately hosted OpenGym3D viewer.
- `prototype.html` and `assets/*.svg` — preserved earlier 2D SVG prototype assets, separate from the current 3D exercise clips.
- `src/exercises-3d.mjs` — exercise order, motion URLs, source metadata, phases, cues, and muscle-group labels.
- `src/exercise-library.mjs` — Three.js loading, source GLB playback, color neutralization, UI, and controls.
- `src/bodymap.js` — front/back schematic maps driven by per-exercise primary/supporting metadata.

## Limitations

The movement cues and exercise steps are explanatory aids, not validated coaching. The muscle indicators are broad catalog labels shown on a schematic body map, not a biomechanical estimate, medical assessment, or claim of isolated muscle activation. The hosted clips and thumbnails depend on the upstream OpenGym3D service remaining available.
