# 3D motion and asset provenance

## Locally bundled CC0 files

These four self-contained GLBs are exact copies of OpenGym3D exercise files listed as CC0-1.0 in the source catalog. Their SHA-256 checksums are included for verification.

| Local file | OpenGym3D source | Registry motion entry | SHA-256 |
|---|---|---|---|
| `opengym3d-jumping-jack-cc0.glb` | <https://assiamahs.github.io/opengym3d/assets/jumping_jack.glb> | `motion/cc0/jumping-jacks` | `94aa534eded3272a61f775d3a7067a9093df97c99f5505d64e39251c46697a0e` |
| `opengym3d-push-up-cc0.glb` | <https://assiamahs.github.io/opengym3d/assets/push_up.glb> | `motion/cc0/pushup` | `67bfd1bf9c9c679dfd81f34202c661f954ce0ec4b15baac56a5781a372d11326` |
| `opengym3d-bear-crawl-cc0.glb` | <https://assiamahs.github.io/opengym3d/assets/bear_crawl.glb> | `motion/cc0/crawl` | `c0dbaeef8a181f8f23803815de7836a6b18795668d73443b28284aa887285378` |
| `opengym3d-jog-cc0.glb` | <https://assiamahs.github.io/opengym3d/assets/jog.glb> | `motion/cc0/jog` | `3e20fe0299cd78c9534f4c1320a4e2e4f31f8b4ae51598a69065f93a43a0c020` |

OpenGym3D's asset registry identifies the source character/rig as CC0-1.0 and lists these motion files individually. See <https://github.com/AssiamahS/opengym3d/blob/main/assets/ASSET_LIBRARY.json> and the exercise catalog at <https://assiamahs.github.io/opengym3d/exercises.json>. The bundled clips contain the same rig and animation track structure; the viewer plays the GLB clips directly.

## Ten-exercise viewer sources

The ten exercise records and their primary/supporting muscle labels are curated from the OpenGym3D exercise catalog. Motion GLBs are played as source animations; no hand-keyframed substitute loops are used in the ten-exercise viewer.

| Exercise | Source ID | Catalog license | Delivery in this project |
|---|---|---|---|
| Jumping Jack | `jumping_jack` | CC0-1.0 | Local bundled GLB |
| Bodyweight Squat | `squat` | Mixamo | Loaded remotely from OpenGym3D; not bundled |
| Push-Up | `push_up` | CC0-1.0 | Local bundled GLB |
| Bear Crawl | `bear_crawl` | CC0-1.0 | Local bundled GLB |
| Crunch | `crunch` | Mixamo | Loaded remotely from OpenGym3D; not bundled |
| Bicycle Crunch | `bicycle_crunch` | Mixamo | Loaded remotely from OpenGym3D; not bundled |
| Burpee | `burpee` | Mixamo | Loaded remotely from OpenGym3D; not bundled |
| Sit-Up | `situp` | Mixamo | Loaded remotely from OpenGym3D; not bundled |
| Jog in Place | `jog` | CC0-1.0 | Local bundled GLB |
| Run / Sprint | `run` | CC0-1.0 | Loaded remotely from OpenGym3D |

The five Mixamo-tagged GLBs are marked `pack: false` in OpenGym3D's catalog. This project does **not** copy or redistribute those files; the browser requests them from OpenGym3D's hosted viewer origin when selected. Internet access is required for these five clips, the hosted run clip, and the remote card thumbnails. Availability and source-host terms can change. Obtain the applicable asset rights before repackaging or shipping any motion file.

## Runtime color handling and muscle maps

The source GLBs include fixed vertex colors, including red patches. The viewer replaces those vertex colors with one neutral gray at runtime so the model's old paint cannot be mistaken for exercise-specific muscle activation. Per-exercise red (primary) and amber (supporting) indications are shown on separate front/back schematic body maps using the source catalog's metadata. They are broad catalog labels—not measured activation, isolated anatomy, or clinical guidance.

No asset from the referenced Leap Fitness workout app was extracted or copied. The ten examples are not claimed to reproduce that app. The selected OpenGym3D catalog does not provide a neck-rotation clip, so the rejected custom neck draft is not presented as one of the source-quality ten.

Three.js r170 and the loader/control modules in `vendor/three/` are distributed under the MIT license included at `vendor/three/LICENSE`. The OpenGym3D body-map code and license attribution are documented in `THIRD_PARTY_NOTICES.md`.
