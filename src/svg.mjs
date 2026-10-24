const BONES = [
  ["neck", "shoulderL", false], ["neck", "shoulderR", false], ["shoulderL", "shoulderR", false],
  ["neck", "hip", true],
  ["shoulderL", "elbowL", true], ["elbowL", "wristL", true],
  ["shoulderR", "elbowR", true], ["elbowR", "wristR", true],
  ["hip", "kneeL", true], ["kneeL", "ankleL", true], ["ankleL", "toeL", false],
  ["hip", "kneeR", true], ["kneeR", "ankleR", true], ["ankleR", "toeR", false],
];

const JOINTS = ["head", "elbowL", "elbowR", "wristL", "wristR", "hip", "kneeL", "kneeR", "ankleL", "ankleR"];
const fmt = (n) => Number(n).toFixed(1).replace(/\.0$/, "");
const slug = (value) => String(value).replace(/[^a-z0-9-]/gi, "-").toLowerCase();
const xmlEscape = (value) => String(value).replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[char]);

function animationTag(attribute, values, frames, duration, staticMode) {
  if (staticMode || frames.length < 2) return "";
  const times = frames.map((item) => item.t);
  const keySplines = times.slice(1).map(() => "0.42 0 0.58 1").join(";");
  return `<animate attributeName="${attribute}" values="${values.join(";")}" keyTimes="${times.join(";")}" keySplines="${keySplines}" calcMode="spline" dur="${fmt(duration)}s" repeatCount="indefinite"/>`;
}

function lineForBone([start, end, highlight], frames, duration, staticMode, accent) {
  const first = frames[0].pose;
  const [x1, y1] = first[start];
  const [x2, y2] = first[end];
  const anim = (attr, joint, axis) => animationTag(
    attr,
    frames.map((item) => fmt(item.pose[joint][axis === "x" ? 0 : 1])),
    frames,
    duration,
    staticMode,
  );
  const common = `x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}"`;
  const motion = `${anim("x1", start, "x")}${anim("y1", start, "y")}${anim("x2", end, "x")}${anim("y2", end, "y")}`;
  const dark = `<line ${common} stroke="#233d36" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">${motion}</line>`;
  if (!highlight) return dark;
  return `${dark}<line ${common} stroke="${accent}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".94">${motion}</line>`;
}

function jointCircle(joint, frames, duration, staticMode, radius = 4.8) {
  const [cx, cy] = frames[0].pose[joint];
  const anim = `${animationTag("cx", frames.map((item) => fmt(item.pose[joint][0])), frames, duration, staticMode)}${animationTag("cy", frames.map((item) => fmt(item.pose[joint][1])), frames, duration, staticMode)}`;
  return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${radius}" fill="#fffaf2" stroke="#233d36" stroke-width="2.2">${anim}</circle>`;
}

export function buildExerciseSvg(exercise, { staticMode = false, speed = 1, title = exercise.name, instanceId = exercise.id } = {}) {
  const frames = exercise.frames;
  const first = frames[0].pose;
  const [headX, headY] = first.head;
  const duration = exercise.duration / Math.max(0.5, Math.min(1.5, Number(speed) || 1));
  const instanceSlug = slug(instanceId);
  const gradientId = `halo-${instanceSlug}`;
  const headMotion = `${animationTag("cx", frames.map((item) => fmt(item.pose.head[0])), frames, duration, staticMode)}${animationTag("cy", frames.map((item) => fmt(item.pose.head[1])), frames, duration, staticMode)}`;
  const hairPath = (point) => `M${fmt(point[0] - 8)} ${fmt(point[1] - 7)} Q${fmt(point[0])} ${fmt(point[1] - 14)} ${fmt(point[0] + 8)} ${fmt(point[1] - 7)}`;
  const hairMotion = animationTag("d", frames.map((item) => hairPath(item.pose.head)), frames, duration, staticMode);
  const bones = BONES.map((bone) => lineForBone(bone, frames, duration, staticMode, exercise.accent)).join("");
  const joints = JOINTS.filter((joint) => joint !== "head").map((joint) => jointCircle(joint, frames, duration, staticMode)).join("");
  const description = `${exercise.name} demonstration, original vector loop. ${exercise.cue}`;
  const safeTitle = xmlEscape(title);
  const safeDescription = xmlEscape(description);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="440" height="440" role="img" aria-label="${safeTitle}" focusable="false">
  <title>${safeTitle} — original exercise motion</title>
  <desc>${safeDescription}</desc>
  <defs>
    <radialGradient id="${gradientId}" cx="50%" cy="45%" r="58%"><stop offset="0" stop-color="${exercise.accent}" stop-opacity=".26"/><stop offset="1" stop-color="${exercise.accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="skin-${instanceSlug}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7d2b5"/><stop offset="1" stop-color="#e9aa88"/></linearGradient>
  </defs>
  <circle cx="110" cy="110" r="78" fill="url(#${gradientId})"/>
  <circle cx="110" cy="112" r="69" fill="none" stroke="#355249" stroke-opacity=".12" stroke-width="1" stroke-dasharray="2 7"/>
  <path d="M28 191.5H192" fill="none" stroke="#355249" stroke-opacity=".2" stroke-width="1.4" stroke-linecap="round"/>
  <ellipse cx="110" cy="190" rx="37" ry="5.5" fill="#233d36" opacity=".1"/>
  <g aria-hidden="true">${bones}</g>
  <g aria-hidden="true">${joints}</g>
  <circle cx="${fmt(headX)}" cy="${fmt(headY)}" r="11.7" fill="url(#skin-${instanceSlug})" stroke="#233d36" stroke-width="2.6">${headMotion}</circle>
  <path d="${hairPath([headX, headY])}" fill="none" stroke="#233d36" stroke-width="2.2" stroke-linecap="round" opacity=".66">${hairMotion}</path>
</svg>`;
}
