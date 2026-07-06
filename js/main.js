import { ZONES, START_ZONE } from "./data/zones.js";
import { initAudio, speak } from "./audio.js";
import { Game } from "./game.js";

const el = (id) => document.getElementById(id);

const game = new Game(ZONES[START_ZONE]);

// Start wymaga gestu użytkownika — to odblokowuje audio na urządzeniach mobilnych.
el("btn-start").addEventListener("click", () => {
  initAudio();
  el("start-screen").classList.add("hidden");
  el("game-screen").classList.remove("hidden");
  speak(`Saluton! Mi estas ${game.zone.npc.name}!`);
  setTimeout(() => game.start(), 1600);
});

el("btn-speak").addEventListener("pointerdown", () => {
  if (game.task) speak(game.task.instruction);
});

el("btn-replay").addEventListener("click", () => game.replay());

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
