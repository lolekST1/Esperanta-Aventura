import { initAudio, speak, stopSpeech, getVoiceChoices, setVoiceOverride, diagnostics, testVoice, previewSpeech } from "./audio.js";
import { Game } from "./game.js";
import { renderMap } from "./map.js";
import { runIntro } from "./story.js";
import { ZONES, ZONE_ORDER } from "./data/zones.js";

const el = (id) => document.getElementById(id);
const SCREENS = ["start-screen", "story-screen", "map-screen", "game-screen", "win-screen", "island-win-screen"];

const game = new Game();

function showScreen(name) {
  for (const s of SCREENS) el(s).classList.toggle("hidden", s !== name);
  const bareScreen = name === "start-screen" || name === "story-screen";
  el("topbar").classList.toggle("hidden", bareScreen);
  el("btn-map").classList.toggle("hidden", name === "map-screen");
}

function allZonesDone(save) {
  return ZONE_ORDER.every((id) => save.zones[id]?.done);
}

function showRealMap() {
  renderMap(game, enterZone);
  showScreen("map-screen");
}

function goToMap() {
  game.deactivate();
  stopSpeech();

  // Pierwszy raz, gdy dziecko ukończy WSZYSTKIE obecne strefy — wspólne
  // świętowanie całej wyspy, zamiast po prostu wracać na mapę.
  if (allZonesDone(game.save) && !game.save.islandCelebrated) {
    showIslandCelebration();
    return;
  }
  showRealMap();
}

function showIslandCelebration() {
  game.markIslandCelebrated();
  const npcs = el("island-win-npcs");
  npcs.innerHTML = `<span>${game.save.avatar ?? "🧒"}</span>` +
    ZONE_ORDER.map((id) => `<span>${ZONES[id].npc.emoji}</span>`).join("");
  el("island-win-stars").textContent = `⭐ ${game.save.stars}`;
  showScreen("island-win-screen");
  speak("Vi esploris la tutan Esperantion! Ĉiuj estas dankemaj al vi!");
}

el("btn-island-continue").addEventListener("click", () => {
  stopSpeech();
  showRealMap();
});

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

function logVoiceEvent(kind, detail) {
  const log = el("voice-log");
  log.classList.remove("hidden");
  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.className = "voice-log-line";
  line.textContent = `${time} — ${kind}: ${detail}`;
  log.prepend(line);
  while (log.children.length > 8) log.removeChild(log.lastChild);
}

function renderDiagnostics() {
  const d = diagnostics();
  const box = el("voice-diagnostics");
  box.innerHTML = `
    Wersja gry: ${d.version}<br>
    speechSynthesis: ${d.hasSynth ? "✅ dostępne" : "❌ NIEDOSTĘPNE"}<br>
    Liczba głosów: ${d.voiceCount}<br>
    Język przeglądarki: ${d.lang}<br>
    Tryb PWA (standalone): ${d.standalone ? "tak" : "nie"}<br>
    Dźwięk (AudioContext): ${d.audioCtxState ?? "brak"}
    ${d.likelyInAppBrowser ? `<br><strong>⚠️ To może być przeglądarka wbudowana w aplikację (np. Messenger/Instagram) — takie przeglądarki często blokują mowę. Spróbuj otworzyć link w Chrome lub Safari.</strong>` : ""}
  `;
}

const TRICKY_WORDS = [
  "Trovu la birdon!",
  "Trovu la sciuron!",
  "Tuŝu la dormantan beston!",
  "Tuŝu la saltantan beston!",
  "Donu la akvon al Strigo!",
  "Unue tuŝu la sunon, poste la lunon!",
];

function renderTrickyWords() {
  const box = el("tricky-words");
  box.innerHTML = "";
  for (const phrase of TRICKY_WORDS) {
    const { text } = previewSpeech(phrase);
    const btn = document.createElement("button");
    btn.className = "tricky-item";
    btn.innerHTML = `${phrase} <span class="voice-item-sub">→ „${text}"</span>`;
    btn.addEventListener("click", () => {
      const { current } = getVoiceChoices();
      testVoice(current, phrase, logVoiceEvent);
    });
    box.appendChild(btn);
  }
}

function renderVoiceList() {
  renderDiagnostics();
  const { voices, current, saved } = getVoiceChoices();
  const list = el("voice-list");
  list.innerHTML = "";

  const addItem = (label, id, voiceObj, active) => {
    const btn = document.createElement("button");
    btn.className = "voice-item" + (active ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", () => {
      setVoiceOverride(id);
      testVoice(voiceObj, VOICE_SAMPLE, logVoiceEvent);
      renderVoiceList(); // odśwież zaznaczenie aktywnego głosu, log zostaje
    });
    list.appendChild(btn);
  };

  addItem(
    `🔄 Automatycznie${!saved && current ? ` — ${current.name}` : ""}`,
    null,
    current,
    !saved,
  );
  for (const v of voices) {
    const id = v.voiceURI ?? v.name;
    addItem(`${v.name} — ${v.lang}`, id, v, saved === id);
  }
  if (!voices.length) {
    list.innerHTML = `<p class="vortaro-empty">Ta przeglądarka nie udostępnia żadnych głosów 😢</p>`;
  }
}

el("btn-voice").addEventListener("click", () => {
  el("voice-log").innerHTML = "";
  el("voice-log").classList.add("hidden");
  el("voice-diagnostics").classList.add("hidden");
  renderVoiceList();
  renderTrickyWords();
  el("voice-screen").classList.remove("hidden");
});

el("btn-toggle-diagnostics").addEventListener("click", () => {
  el("voice-diagnostics").classList.toggle("hidden");
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
