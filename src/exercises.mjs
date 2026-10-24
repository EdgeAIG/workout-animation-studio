const copyPose = (base, overrides = {}) => {
  const pose = Object.fromEntries(Object.entries(base).map(([key, point]) => [key, [...point]]));
  for (const [key, point] of Object.entries(overrides)) pose[key] = [...point];
  return pose;
};

const frontBase = {
  head: [110, 42], neck: [110, 61], shoulderL: [93, 68], shoulderR: [127, 68],
  elbowL: [77, 88], wristL: [72, 111], elbowR: [143, 88], wristR: [148, 111],
  hip: [110, 117], kneeL: [94, 151], ankleL: [92, 182], toeL: [79, 188],
  kneeR: [126, 151], ankleR: [128, 182], toeR: [141, 188],
};
const front = (overrides) => copyPose(frontBase, overrides);

const sideBase = {
  head: [42, 112], neck: [58, 120], shoulderL: [68, 124], shoulderR: [72, 128],
  elbowL: [78, 147], wristL: [60, 169], elbowR: [83, 151], wristR: [66, 174],
  hip: [120, 138], kneeL: [151, 145], ankleL: [184, 153], toeL: [198, 155],
  kneeR: [154, 151], ankleR: [186, 160], toeR: [199, 162],
};
const side = (overrides) => copyPose(sideBase, overrides);

const lyingBase = {
  head: [43, 171], neck: [59, 165], shoulderL: [67, 161], shoulderR: [72, 164],
  elbowL: [78, 176], wristL: [96, 182], elbowR: [81, 179], wristR: [99, 185],
  hip: [117, 174], kneeL: [149, 153], ankleL: [171, 177], toeL: [184, 181],
  kneeR: [155, 159], ankleR: [177, 181], toeR: [190, 184],
};
const lying = (overrides) => copyPose(lyingBase, overrides);

const frame = (t, pose) => ({ t, pose });

export const EXERCISES = [
  {
    id: "jumping-jacks", name: "Jumping jacks", category: "Cardio", muscle: "Full body", level: "Beginner",
    duration: 2.25, tempo: "Steady rhythm", accent: "#8b7cff", cue: "Land softly; keep your ribs stacked over your hips.",
    frames: [
      frame(0, frontBase),
      frame(0.42, front({
        elbowL: [68, 55], wristL: [43, 34], elbowR: [152, 55], wristR: [177, 34],
        kneeL: [82, 148], ankleL: [60, 178], toeL: [47, 183], kneeR: [138, 148], ankleR: [160, 178], toeR: [173, 183],
      })),
      frame(0.58, front({
        elbowL: [68, 55], wristL: [43, 34], elbowR: [152, 55], wristR: [177, 34],
        kneeL: [82, 148], ankleL: [60, 178], toeL: [47, 183], kneeR: [138, 148], ankleR: [160, 178], toeR: [173, 183],
      })),
      frame(1, frontBase),
    ],
  },
  {
    id: "bodyweight-squat", name: "Bodyweight squat", category: "Strength", muscle: "Quads · glutes", level: "Beginner",
    duration: 2.7, tempo: "Control the descent", accent: "#ff8569", cue: "Press through the whole foot; let your knees track over your toes.",
    frames: [
      frame(0, frontBase),
      frame(0.34, front({ head: [110, 49], neck: [110, 67], shoulderL: [93, 74], shoulderR: [127, 74], elbowL: [77, 95], wristL: [89, 104], elbowR: [143, 95], wristR: [131, 104], hip: [110, 125], kneeL: [84, 151], ankleL: [91, 182], toeL: [78, 188], kneeR: [136, 151], ankleR: [129, 182], toeR: [142, 188] })),
      frame(0.52, front({ head: [110, 59], neck: [110, 77], shoulderL: [93, 83], shoulderR: [127, 83], elbowL: [76, 103], wristL: [90, 112], elbowR: [144, 103], wristR: [130, 112], hip: [110, 133], kneeL: [80, 158], ankleL: [91, 183], toeL: [77, 188], kneeR: [140, 158], ankleR: [129, 183], toeR: [143, 188] })),
      frame(0.68, front({ head: [110, 59], neck: [110, 77], shoulderL: [93, 83], shoulderR: [127, 83], elbowL: [76, 103], wristL: [90, 112], elbowR: [144, 103], wristR: [130, 112], hip: [110, 133], kneeL: [80, 158], ankleL: [91, 183], toeL: [77, 188], kneeR: [140, 158], ankleR: [129, 183], toeR: [143, 188] })),
      frame(1, frontBase),
    ],
  },
  {
    id: "push-up", name: "Push-up", category: "Strength", muscle: "Chest · arms", level: "Intermediate",
    duration: 2.4, tempo: "Smooth, no bounce", accent: "#51b8a6", cue: "Keep your body in one long line from shoulders to heels.",
    frames: [
      frame(0, sideBase),
      frame(0.36, side({ head: [43, 130], neck: [59, 136], shoulderL: [68, 139], shoulderR: [72, 142], elbowL: [78, 155], wristL: [60, 174], elbowR: [84, 158], wristR: [65, 178], hip: [121, 143], kneeL: [151, 150], ankleL: [184, 157], toeL: [198, 159], kneeR: [154, 156], ankleR: [186, 164], toeR: [199, 166] })),
      frame(0.52, side({ head: [43, 130], neck: [59, 136], shoulderL: [68, 139], shoulderR: [72, 142], elbowL: [78, 155], wristL: [60, 174], elbowR: [84, 158], wristR: [65, 178], hip: [121, 143], kneeL: [151, 150], ankleL: [184, 157], toeL: [198, 159], kneeR: [154, 156], ankleR: [186, 164], toeR: [199, 166] })),
      frame(1, sideBase),
    ],
  },
  {
    id: "reverse-lunge", name: "Reverse lunge", category: "Lower body", muscle: "Glutes · legs", level: "Beginner",
    duration: 3.1, tempo: "Alternate sides", accent: "#f3b94f", cue: "Step back quietly; keep your front knee comfortably aligned.",
    frames: [
      frame(0, frontBase),
      frame(0.2, front({ elbowL: [80, 95], wristL: [88, 112], elbowR: [140, 95], wristR: [132, 112], hip: [110, 119], kneeL: [93, 151], ankleL: [92, 182], toeL: [79, 188], kneeR: [137, 145], ankleR: [157, 172], toeR: [170, 177] })),
      frame(0.39, front({ elbowL: [80, 95], wristL: [88, 112], elbowR: [140, 95], wristR: [132, 112], hip: [110, 119], kneeL: [93, 151], ankleL: [92, 182], toeL: [79, 188], kneeR: [137, 145], ankleR: [157, 172], toeR: [170, 177] })),
      frame(0.51, frontBase),
      frame(0.71, front({ elbowL: [80, 95], wristL: [88, 112], elbowR: [140, 95], wristR: [132, 112], hip: [110, 119], kneeL: [83, 145], ankleL: [63, 172], toeL: [50, 177], kneeR: [127, 151], ankleR: [128, 182], toeR: [141, 188] })),
      frame(0.89, front({ elbowL: [80, 95], wristL: [88, 112], elbowR: [140, 95], wristR: [132, 112], hip: [110, 119], kneeL: [83, 145], ankleL: [63, 172], toeL: [50, 177], kneeR: [127, 151], ankleR: [128, 182], toeR: [141, 188] })),
      frame(1, frontBase),
    ],
  },
  {
    id: "mountain-climber", name: "Mountain climber", category: "Cardio", muscle: "Core · shoulders", level: "Intermediate",
    duration: 2.2, tempo: "Alternate knees", accent: "#78a9ff", cue: "Brace your core and keep your shoulders over your hands.",
    frames: [
      frame(0, sideBase),
      frame(0.24, side({ head: [42, 112], neck: [58, 120], shoulderL: [68, 124], shoulderR: [72, 128], elbowL: [78, 147], wristL: [60, 169], elbowR: [83, 151], wristR: [66, 174], hip: [120, 138], kneeL: [112, 143], ankleL: [98, 162], toeL: [84, 166], kneeR: [154, 151], ankleR: [186, 160], toeR: [199, 162] })),
      frame(0.49, sideBase),
      frame(0.74, side({ head: [42, 112], neck: [58, 120], shoulderL: [68, 124], shoulderR: [72, 128], elbowL: [78, 147], wristL: [60, 169], elbowR: [83, 151], wristR: [66, 174], hip: [120, 138], kneeL: [151, 145], ankleL: [184, 153], toeL: [198, 155], kneeR: [114, 144], ankleR: [99, 163], toeR: [85, 167] })),
      frame(1, sideBase),
    ],
  },
  {
    id: "glute-bridge", name: "Glute bridge", category: "Core", muscle: "Glutes · core", level: "Beginner",
    duration: 2.8, tempo: "Pause at the top", accent: "#ed83b8", cue: "Lift from your hips; keep your ribs relaxed and feet grounded.",
    frames: [
      frame(0, lying({ hip: [117, 170], kneeL: [149, 153], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 159], ankleR: [177, 181], toeR: [190, 184] })),
      frame(0.36, lying({ head: [43, 171], neck: [59, 165], shoulderL: [67, 161], shoulderR: [72, 164], elbowL: [78, 176], wristL: [96, 182], elbowR: [81, 179], wristR: [99, 185], hip: [116, 132], kneeL: [149, 145], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 151], ankleR: [177, 181], toeR: [190, 184] })),
      frame(0.61, lying({ head: [43, 171], neck: [59, 165], shoulderL: [67, 161], shoulderR: [72, 164], elbowL: [78, 176], wristL: [96, 182], elbowR: [81, 179], wristR: [99, 185], hip: [116, 132], kneeL: [149, 145], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 151], ankleR: [177, 181], toeR: [190, 184] })),
      frame(1, lying({ hip: [117, 170], kneeL: [149, 153], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 159], ankleR: [177, 181], toeR: [190, 184] })),
    ],
  },
  {
    id: "crunch", name: "Crunch", category: "Core", muscle: "Abdominals", level: "Beginner",
    duration: 2.5, tempo: "Exhale on the lift", accent: "#ff8569", cue: "Curl your shoulders up; avoid pulling on your neck.",
    frames: [
      frame(0, lyingBase),
      frame(0.34, lying({ head: [54, 124], neck: [68, 132], shoulderL: [76, 137], shoulderR: [80, 141], elbowL: [58, 143], wristL: [49, 151], elbowR: [91, 144], wristR: [101, 151], hip: [117, 174], kneeL: [149, 153], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 159], ankleR: [177, 181], toeR: [190, 184] })),
      frame(0.53, lying({ head: [54, 124], neck: [68, 132], shoulderL: [76, 137], shoulderR: [80, 141], elbowL: [58, 143], wristL: [49, 151], elbowR: [91, 144], wristR: [101, 151], hip: [117, 174], kneeL: [149, 153], ankleL: [171, 177], toeL: [184, 181], kneeR: [155, 159], ankleR: [177, 181], toeR: [190, 184] })),
      frame(1, lyingBase),
    ],
  },
  {
    id: "calf-raise", name: "Calf raise", category: "Lower body", muscle: "Calves", level: "Beginner",
    duration: 2.0, tempo: "Lift and lower", accent: "#51b8a6", cue: "Rise through the balls of your feet; lower with control.",
    frames: [
      frame(0, frontBase),
      frame(0.4, front({ ankleL: [92, 174], toeL: [79, 188], ankleR: [128, 174], toeR: [141, 188] })),
      frame(0.6, front({ ankleL: [92, 174], toeL: [79, 188], ankleR: [128, 174], toeR: [141, 188] })),
      frame(1, frontBase),
    ],
  },
];

export const CATEGORIES = ["All moves", "Cardio", "Strength", "Lower body", "Core"];
