const SOURCE_ASSETS = 'https://assiamahs.github.io/opengym3d/assets/';

const muscleLabels = [
  'Abs', 'Calves', 'Chest', 'Core', 'Glutes', 'Hamstrings',
  'Quads', 'Shoulders', 'Triceps',
];

export const MUSCLE_GROUPS = Object.freeze(Object.fromEntries(
  muscleLabels.map(label => [label.toLowerCase(), Object.freeze({ label })]),
));

const localCc0 = {
  jumping_jack: './assets/3d/opengym3d-jumping-jack-cc0.glb',
  push_up: './assets/3d/opengym3d-push-up-cc0.glb',
  bear_crawl: './assets/3d/opengym3d-bear-crawl-cc0.glb',
  jog: './assets/3d/opengym3d-jog-cc0.glb',
};

const catalog = [
  {
    id: 'jumping_jack', name: 'Jumping Jack', category: 'Cardio', level: 'Beginner',
    primary: ['Shoulders'], secondary: ['Calves', 'Core'], camera: 'front',
    description: 'A complete jumping-jack cycle: arms and feet open together, then return to the start.',
    steps: [
      'Stand tall with your arms at your sides.',
      'Jump your feet apart as your arms sweep overhead.',
      'Land softly with your knees relaxed.',
      'Jump back to the start and repeat rhythmically.',
    ],
    phases: [
      { at: 0, title: 'Start', cue: 'Feet together; arms rest by your sides.' },
      { at: 0.2, title: 'Open', cue: 'Sweep the arms up as the feet move apart.' },
      { at: 0.52, title: 'Return', cue: 'Bring arms and legs back toward the start.' },
      { at: 0.8, title: 'Land softly', cue: 'Keep the landing light and controlled.' },
    ],
    license: { lane: 'cc0', license: 'CC0-1.0', pack: true },
  },
  {
    id: 'squat', name: 'Bodyweight Squat', category: 'Lower body', level: 'Beginner',
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'], camera: 'front',
    description: 'A full squat repetition from standing through the bottom and back to standing.',
    steps: [
      'Stand with feet about shoulder-width apart and toes slightly out.',
      'Send the hips back and bend the knees under control.',
      'Keep the heels grounded and the knees tracking over the feet.',
      'Press through the floor to stand tall again.',
    ],
    phases: [
      { at: 0, title: 'Stand tall', cue: 'Set your stance and brace gently.' },
      { at: 0.2, title: 'Lower', cue: 'Bend at the hips and knees together.' },
      { at: 0.5, title: 'Bottom', cue: 'Pause briefly without losing balance.' },
      { at: 0.68, title: 'Rise', cue: 'Press through the feet to stand.' },
    ],
    license: { lane: 'mixamo', license: 'Mixamo', pack: false },
  },
  {
    id: 'push_up', name: 'Push-Up', category: 'Upper body', level: 'Beginner',
    primary: ['Chest'], secondary: ['Triceps', 'Core'], camera: 'side',
    description: 'A complete push-up loop, showing the body lowering and pressing back from a plank.',
    steps: [
      'Start in a high plank with hands just outside shoulder-width.',
      'Keep the head, ribs, hips, and legs in one line.',
      'Bend the elbows and lower the chest toward the floor.',
      'Press the floor away to return to the top.',
    ],
    phases: [
      { at: 0, title: 'High plank', cue: 'Set hands under or just outside the shoulders.' },
      { at: 0.22, title: 'Lower', cue: 'Bend the elbows while keeping the body aligned.' },
      { at: 0.5, title: 'Bottom', cue: 'Pause near the floor with control.' },
      { at: 0.72, title: 'Press', cue: 'Push the floor away to rise.' },
    ],
    license: { lane: 'cc0', license: 'CC0-1.0', pack: true },
  },
  {
    id: 'bear_crawl', name: 'Bear Crawl', category: 'Full body', level: 'Intermediate',
    primary: ['Core', 'Shoulders'], secondary: ['Quads', 'Triceps', 'Glutes'], camera: 'side',
    description: 'An alternating quadruped crawl cycle with short hand-and-foot steps.',
    steps: [
      'Start on your hands and toes with your knees hovering above the floor.',
      'Move one hand and the opposite foot forward together.',
      'Keep your hips low and your back steady.',
      'Continue with small, controlled alternating steps.',
    ],
    phases: [
      { at: 0, title: 'Set', cue: 'Hover the knees; keep the trunk steady.' },
      { at: 0.24, title: 'Step', cue: 'Move an opposite hand and foot together.' },
      { at: 0.52, title: 'Switch sides', cue: 'Keep the hips low as the limbs alternate.' },
      { at: 0.78, title: 'Continue', cue: 'Use short, controlled steps.' },
    ],
    license: { lane: 'cc0', license: 'CC0-1.0', pack: true },
  },
  {
    id: 'crunch', name: 'Crunch', category: 'Core', level: 'Beginner',
    primary: ['Abs'], secondary: ['Core'], camera: 'front',
    description: 'A floor-based abdominal curl loop: lift the shoulder blades, then lower with control.',
    steps: [
      'Lie on your back with knees bent and hands by your temples.',
      'Curl your ribcage toward your pelvis, lifting the shoulder blades.',
      'Pause at the top without pulling on your neck.',
      'Lower slowly and repeat.',
    ],
    phases: [
      { at: 0, title: 'Set', cue: 'Knees bent; hands rest lightly by the head.' },
      { at: 0.24, title: 'Curl', cue: 'Lift the shoulder blades toward the pelvis.' },
      { at: 0.51, title: 'Top', cue: 'Pause; keep the neck relaxed.' },
      { at: 0.76, title: 'Lower', cue: 'Return to the floor with control.' },
    ],
    license: { lane: 'mixamo', license: 'Mixamo', pack: false },
  },
  {
    id: 'bicycle_crunch', name: 'Bicycle Crunch', category: 'Core', level: 'Beginner',
    primary: ['Abs'], secondary: ['Core'], camera: 'front',
    description: 'An alternating bicycle-crunch cycle with opposing elbow-and-knee rotation.',
    steps: [
      'Lie on your back with legs lifted and hands by your temples.',
      'Bring one knee in as the opposite elbow rotates toward it.',
      'Extend the other leg while keeping it above the floor.',
      'Alternate sides in a smooth pedalling rhythm.',
    ],
    phases: [
      { at: 0, title: 'Set', cue: 'Brace gently with both legs lifted.' },
      { at: 0.2, title: 'Rotate', cue: 'Bring the opposite elbow toward the bent knee.' },
      { at: 0.5, title: 'Switch', cue: 'Alternate sides in a steady pedal.' },
      { at: 0.78, title: 'Extend', cue: 'Reach the other leg long, hovering above the floor.' },
    ],
    license: { lane: 'mixamo', license: 'Mixamo', pack: false },
  },
  {
    id: 'burpee', name: 'Burpee', category: 'Full body', level: 'Intermediate',
    primary: ['Quads', 'Chest'], secondary: ['Core', 'Shoulders', 'Glutes'], camera: 'front',
    description: 'A full burpee sequence from standing down to the floor and back to a soft landing.',
    steps: [
      'From standing, squat down and place both hands on the floor.',
      'Jump or step the feet back into a plank and lower the chest.',
      'Press up and bring the feet back under the hips.',
      'Rise into a small jump and land softly.',
    ],
    phases: [
      { at: 0, title: 'Stand', cue: 'Start tall with a steady stance.' },
      { at: 0.17, title: 'Squat down', cue: 'Bend the knees and place the hands down.' },
      { at: 0.36, title: 'Plank', cue: 'Move the feet back and lower toward the floor.' },
      { at: 0.55, title: 'Return', cue: 'Press up and bring the feet under the hips.' },
      { at: 0.78, title: 'Rise', cue: 'Finish tall; land softly before repeating.' },
    ],
    license: { lane: 'mixamo', license: 'Mixamo', pack: false },
  },
  {
    id: 'situp', name: 'Sit-Up', category: 'Core', level: 'Beginner',
    primary: ['Abs'], secondary: ['Core'], camera: 'front',
    description: 'A complete sit-up cycle from lying to seated and back down under control.',
    steps: [
      'Lie on your back with knees bent and feet flat.',
      'Brace and curl your torso up toward your knees.',
      'Keep your chin relaxed and avoid pulling on your neck.',
      'Lower back down with control.',
    ],
    phases: [
      { at: 0, title: 'Start', cue: 'Lie back with knees bent and feet planted.' },
      { at: 0.24, title: 'Curl up', cue: 'Brace and bring the torso toward the knees.' },
      { at: 0.52, title: 'Top', cue: 'Pause without tucking the chin hard.' },
      { at: 0.76, title: 'Lower', cue: 'Return to the floor with control.' },
    ],
    license: { lane: 'mixamo', license: 'Mixamo', pack: false },
  },
  {
    id: 'jog', name: 'Jog in Place', category: 'Cardio', level: 'Beginner',
    primary: ['Quads', 'Calves'], secondary: ['Glutes', 'Hamstrings', 'Core'], camera: 'front',
    description: 'A light in-place running cycle with alternating arm swing and foot lift.',
    steps: [
      'Stand tall with elbows bent and shoulders relaxed.',
      'Lift one foot and then the other in a light running rhythm.',
      'Land softly, keeping your steps quiet.',
      'Swing the arms opposite to the legs.',
    ],
    phases: [
      { at: 0, title: 'Ready', cue: 'Stay tall with relaxed shoulders.' },
      { at: 0.23, title: 'Lift', cue: 'Alternate the feet with a light rhythm.' },
      { at: 0.5, title: 'Land', cue: 'Touch down softly and quietly.' },
      { at: 0.77, title: 'Switch', cue: 'Let the arms swing opposite to the legs.' },
    ],
    license: { lane: 'cc0', license: 'CC0-1.0', pack: true },
  },
  {
    id: 'run', name: 'Run / Sprint', category: 'Cardio', level: 'Intermediate',
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Calves', 'Core'], camera: 'front',
    description: 'A faster running stride loop; switch to the side view to inspect the leg drive.',
    steps: [
      'Drive the knees forward with a slight forward lean.',
      'Push off the ball of the foot as the hip extends.',
      'Pump the arms from the shoulders with hands relaxed.',
      'Keep the stride smooth and the footfalls quiet.',
    ],
    phases: [
      { at: 0, title: 'Drive', cue: 'Lift the knee while the opposite arm comes forward.' },
      { at: 0.23, title: 'Push off', cue: 'Extend through the hip and foot.' },
      { at: 0.52, title: 'Recover', cue: 'Bring the leg through under the body.' },
      { at: 0.77, title: 'Cycle', cue: 'Keep the arm swing relaxed and rhythmic.' },
    ],
    license: { lane: 'cc0', license: 'CC0-1.0', pack: true },
  },
];

export const EXERCISES_3D = Object.freeze(catalog.map((exercise, index) => {
  const localUrl = localCc0[exercise.id];
  const sourceUrl = `${SOURCE_ASSETS}${exercise.id}.glb`;
  const thumbnailUrl = `${SOURCE_ASSETS}${exercise.id}.png`;
  const localAsset = Boolean(localUrl);
  return Object.freeze({
    ...exercise,
    number: String(index + 1).padStart(2, '0'),
    thumbnail: thumbnailUrl,
    motion: Object.freeze({
      kind: 'gltf',
      url: localUrl ?? sourceUrl,
      sourceUrl,
      source: localAsset
        ? 'OpenGym3D · CC0-1.0 · local clip'
        : exercise.license.license === 'Mixamo'
          ? 'OpenGym3D-hosted Mixamo clip · remote preview only'
          : 'OpenGym3D · CC0-1.0 · hosted clip',
      license: exercise.license.license,
      locallyBundled: localAsset,
    }),
  });
}));
