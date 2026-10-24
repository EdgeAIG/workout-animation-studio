# Asset guide

## Current ten-exercise 3D library

`index.html` uses original OpenGym3D skinned GLB motion clips. Four CC0-listed clips are bundled locally; the other source clips are requested from the original OpenGym3D host at runtime. The Mixamo-tagged clips are marked `pack: false` by the source catalog and are not redistributed here.

The source model's permanent red vertex colors are replaced with neutral gray when a clip loads. Exercise focus is shown in a separate front/back schematic body map: **red = source-listed primary groups; amber = source-listed supporting groups; gray = other mapped regions.** These group labels are not measurements of muscle activity or clinical findings.

| # | Movement | Primary groups | Supporting groups | Clip delivery / catalog license |
|---:|---|---|---|---|
| 01 | Jumping Jack | Shoulders | Calves, Core | Local CC0-1.0 |
| 02 | Bodyweight Squat | Quads, Glutes | Hamstrings, Core | OpenGym3D-hosted Mixamo; not bundled |
| 03 | Push-Up | Chest | Triceps, Core | Local CC0-1.0 |
| 04 | Bear Crawl | Core, Shoulders | Quads, Triceps, Glutes | Local CC0-1.0 |
| 05 | Crunch | Abs | Core | OpenGym3D-hosted Mixamo; not bundled |
| 06 | Bicycle Crunch | Abs | Core | OpenGym3D-hosted Mixamo; not bundled |
| 07 | Burpee | Quads, Chest | Core, Shoulders, Glutes | OpenGym3D-hosted Mixamo; not bundled |
| 08 | Sit-Up | Abs | Core | OpenGym3D-hosted Mixamo; not bundled |
| 09 | Jog in Place | Quads, Calves | Glutes, Hamstrings, Core | Local CC0-1.0 |
| 10 | Run / Sprint | Quads, Glutes | Hamstrings, Calves, Core | OpenGym3D-hosted CC0-1.0 |

Motion URLs, the four bundled-file hashes, catalog source, and packaging limitations are recorded in [`assets/3d/NOTICE.md`](assets/3d/NOTICE.md). The local Three.js version and loader/control files are listed under `vendor/three/` and use the included MIT license. The copied/adapted body-map code is attributed in `THIRD_PARTY_NOTICES.md`.

The source catalog has no neck-rotation clip; the rejected custom neck draft was removed rather than counted as an equivalent source motion. No assets were extracted from the referenced workout app.

## Preserved 2D prototype

`prototype.html` and `assets/*.svg` retain eight earlier original, approximate SVG loops. These 2D examples are separate from the current 3D viewer and are not represented as the source-quality 3D motions.

| File | Exercise | Category |
|---|---|---|
| `jumping-jacks.svg` | Jumping jacks | Cardio |
| `bodyweight-squat.svg` | Bodyweight squat | Strength |
| `push-up.svg` | Push-up | Strength |
| `reverse-lunge.svg` | Reverse lunge | Lower body |
| `mountain-climber.svg` | Mountain climber | Cardio |
| `glute-bridge.svg` | Glute bridge | Core |
| `crunch.svg` | Crunch | Core |
| `calf-raise.svg` | Calf raise | Lower body |

These SVGs contain self-contained vector paths and animation timing; they do not require external images, fonts, scripts, or network access. All exercise content is illustrative and should not be presented as clinically validated coaching.
