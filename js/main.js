import { initAudio, speak, stopSpeech, getVoiceChoices, setVoiceOverride } from "./audio.js";
import { Game } from "./game.js";
import { renderMap } from "./map.js";
import { runIntro } from "./story.js";

const el = (id) => document.getElementById(id);
const SCREENS = ["start-screen", "story-screen", "map-screen", "game-screen", "win-screen"];

const game = new Game();

function showScreen(name) {
  for (const s of SCREENS) el(s).classList.toggle("hidden", s !== name);
  const bareScreen = name === "start-screen" || name === "story-screen";
  el("topbar").classList.toggle("hidden", bareScreen);
  el("btn-map").classList.toggle("hidden", name === "map-screen");
}

function goToMap() {
  game.deactivate();
  stopSpeech();
  renderMap(game.save, enterZone);
  showScreen("map-screen");
}

function enterZone(zone) {
  game.loadZone(zone);
  showScreen("game-screen");
  game.intro();
}

function startStory() {
  showScreen("story-screen");
  runIntro(game, goToMap);
}

game.onWin = () => showScreen("win-screen");

// Start wymaga gestu użytkownika — to odblokowuje audio na urządzeniach mobilnych.
el("btn-start").addEventListener("click", () => {
  initAudio();
  if (game.save.avatar) goToMap();
  else startStory();
});

el("btn-map").addEventListener("click", goToMap);
el("btn-map-win").addEventListener("click", goToMap);
el("btn-story-replay").addEventListener("click", () => {
  game.deactivate();
  stopSpeech();
  startStory();
});

el("btn-replay").addEventListener("click", () => {
  showScreen("game-screen");
  game.replay();
});

el("btn-speak").addEventListener("pointerdown", () => {
  if (game.task && !game.locked) speak(game.task.instruction, game.voice);
});

const VOICE_SAMPLE = "Saluton! Mi estas Vulpo! Ni ludu kune!";

function renderVoiceList() {
  const { voices, current, saved } = getVoiceChoices();
  const list = el("voice-list");
  list.innerHTML = "";

  const addItem = (label, id, active) => {
    const btn = document.createElement("button");
    btn.className = "voice-item" + (active ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", () => {
      setVoiceOverride(id);
      speak(VOICE_SAMPLE);
      renderVoiceList();
    });
    list.appendChild(btn);
  };

  addItem(
    `🔄 Automatycznie${!saved && current ? ` — ${current.name}` : ""}`,
    null,
    !saved,
  );
  for (const v of voices) {
    const id = v.voiceURI ?? v.name;
    addItem(`${v.name} — ${v.lang}`, id, saved === id);
  }
  if (!voices.length) {
    list.innerHTML = `<p class="vortaro-empty">Ta przeglądarka nie udostępnia żadnych głosów 😢</p>`;
  }
}

el("btn-voice").addEventListener("click", () => {
  renderVoiceList();
  el("voice-screen").classList.remove("hidden");
});

el("btn-close-voice").addEventListener("click", () => {
  stopSpeech();
  el("voice-screen").classList.add("hidden");
});

el("btn-vortaro").addEventListener("click", () => {
  el("vortaro-screen").classList.remove("hidden");
});

el("btn-close-vortaro").addEventListener("click", () => {
  el("vortaro-screen").classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
