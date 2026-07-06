import { initAudio, speak } from "./audio.js";
import { Game } from "./game.js";
import { renderMap } from "./map.js";

const el = (id) => document.getElementById(id);
const SCREENS = ["start-screen", "map-screen", "game-screen", "win-screen"];

const game = new Game();

function showScreen(name) {
  for (const s of SCREENS) el(s).classList.toggle("hidden", s !== name);
  el("topbar").classList.toggle("hidden", name === "start-screen");
  el("btn-map").classList.toggle("hidden", name === "map-screen");
}

function goToMap() {
  game.deactivate();
  window.speechSynthesis?.cancel();
  renderMap(game.save, enterZone);
  showScreen("map-screen");
}

function enterZone(zone) {
  game.loadZone(zone);
  showScreen("game-screen");
  speak(`Saluton! Mi estas ${zone.npc.name}!`);
  setTimeout(() => game.showTask(), 1600);
}

game.onWin = () => showScreen("win-screen");

// Start wymaga gestu użytkownika — to odblokowuje audio na urządzeniach mobilnych.
el("btn-start").addEventListener("click", () => {
  initAudio();
  goToMap();
});

el("btn-map").addEventListener("click", goToMap);
el("btn-map-win").addEventListener("click", goToMap);

el("btn-replay").addEventListener("click", () => {
  showScreen("game-screen");
  game.replay();
});

el("btn-speak").addEventListener("pointerdown", () => {
  if (game.task) speak(game.task.instruction);
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
