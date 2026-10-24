import { EXERCISES, CATEGORIES } from "./exercises.mjs";
import { buildExerciseSvg } from "./svg.mjs";

const grid = document.querySelector("#exercise-grid");
const filterRoot = document.querySelector("#filters");
const searchInput = document.querySelector("#search");
const speedInput = document.querySelector("#speed");
const motionToggle = document.querySelector("#motion-toggle");
const heroStage = document.querySelector("#hero-stage");
const toast = document.querySelector("#toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const state = { category: "All moves", query: "", speed: 1, paused: reducedMotion.matches };

const icon = {
  download: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.4v7.2m0 0 2.7-2.7M8 9.6 5.3 6.9M3 10.6v2.2h10v-2.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  copy: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.2" y="5" width="7.6" height="8" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3H4a1.5 1.5 0 0 0-1.5 1.5V11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 3.5v9m5-9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(announce.timer);
  announce.timer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
}

function makeCard(exercise, index) {
  const stage = buildExerciseSvg(exercise, { staticMode: reducedMotion.matches || state.paused, speed: state.speed, instanceId: `card-${exercise.id}` });
  const stageStyle = `--wash:${exercise.accent}26;--wash2:#f5f5ef`;
  const svgStage = stage.replace('<svg ', '<svg class="motion-svg" ');
  return `<article class="exercise-card" data-exercise="${exercise.id}">
    <div class="card-top"><span class="card-index">MOVE / ${String(index + 1).padStart(2, "0")}</span><span class="card-tag">${exercise.category}</span></div>
    <div class="card-stage" style="${stageStyle}" aria-label="${exercise.name} animation preview">
      <span class="card-watermark" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      ${svgStage}
    </div>
    <div class="card-body">
      <div class="card-title-row"><h3 class="card-title">${exercise.name}</h3><span class="card-level">${exercise.level}</span></div>
      <div class="card-meta"><span>${exercise.muscle}</span><span>${exercise.tempo}</span></div>
      <p class="card-cue">${exercise.cue}</p>
      <div class="card-actions">
        <a class="action-button" href="./assets/${exercise.id}.svg" download="${exercise.id}.svg" aria-label="Download ${exercise.name} SVG">${icon.download} Download SVG</a>
        <button class="action-button" type="button" data-action="copy" data-id="${exercise.id}" aria-label="Copy embed for ${exercise.name}">${icon.copy} Copy embed</button>
      </div>
    </div>
  </article>`;
}

function renderFilters() {
  filterRoot.innerHTML = CATEGORIES.map((category) => `<button class="filter-chip" type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>`).join("");
}

function getVisibleExercises() {
  const query = state.query.trim().toLowerCase();
  return EXERCISES.filter((exercise) => {
    const matchesCategory = state.category === "All moves" || exercise.category === state.category;
    const matchesSearch = !query || `${exercise.name} ${exercise.muscle} ${exercise.category} ${exercise.level}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

function render() {
  renderFilters();
  const visible = getVisibleExercises();
  grid.innerHTML = visible.length ? visible.map(makeCard).join("") : '<div class="empty-state">No moves match that search. Try another name or category.</div>';
  motionToggle.textContent = reducedMotion.matches ? "Reduced motion on" : (state.paused ? "Play motion" : "Pause motion");
  motionToggle.setAttribute("aria-pressed", String(state.paused));
  motionToggle.disabled = reducedMotion.matches;
}

function renderHero() {
  const svg = buildExerciseSvg(EXERCISES[0], { staticMode: reducedMotion.matches, speed: 0.9, title: "Looping jumping jacks" });
  heroStage.innerHTML = svg.replace('<svg ', '<svg class="motion-svg" ');
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    announce("Embed snippet copied");
  } catch {
    const temp = document.createElement("textarea");
    temp.value = value;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.append(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    announce("Embed snippet copied");
  }
}

filterRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

searchInput.addEventListener("input", () => { state.query = searchInput.value; render(); });
speedInput.addEventListener("change", () => { state.speed = Number(speedInput.value); render(); });
motionToggle.addEventListener("click", () => {
  if (reducedMotion.matches) return;
  state.paused = !state.paused;
  document.querySelectorAll(".motion-svg").forEach((svg) => {
    try { state.paused ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch { /* static SVG or unsupported SMIL */ }
  });
  motionToggle.textContent = state.paused ? "Play motion" : "Pause motion";
  motionToggle.setAttribute("aria-pressed", String(state.paused));
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="copy"]');
  if (!button) return;
  const exercise = EXERCISES.find((item) => item.id === button.dataset.id);
  if (!exercise) return;
  const alt = `Simplified ${exercise.name.toLowerCase()} animation prototype`;
  copyText(`<img src="./assets/${exercise.id}.svg" alt="${alt}" width="220" height="220" loading="lazy">`);
});

document.querySelector("#copy-example").addEventListener("click", () => {
  copyText('<img src="./assets/jumping-jacks.svg" alt="Simplified jumping-jacks animation prototype" width="220" height="220" loading="lazy">');
});

reducedMotion.addEventListener?.("change", () => {
  state.paused = reducedMotion.matches;
  renderHero();
  render();
});

renderHero();
render();
