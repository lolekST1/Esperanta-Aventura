import {
  initAudio,
  speak,
  stopSpeech,
  getVoiceChoices,
  setVoiceOverride,
  setContentLang,
  diagnostics,
  testVoice,
  previewSpeech,
} from "./audio.js";
import { Game } from "./game.js";
import { renderMap } from "./map.js";
import { runIntro } from "./story.js";
import { loadContent, getLang, setLang } from "./data/content.js";
import { UI_STRINGS, CONTENT_STRINGS, LANGS } from "./data/i18n.js";
import { npcArt, avatarArt, starIcon, uiIcon } from "./art.js";

const el = (id) => document.getElementById(id);

const lang = getLang();
const ui = UI_STRINGS[lang] ?? UI_STRINGS.eo;
const strings = CONTENT_STRINGS[lang] ?? CONTENT_STRINGS.eo;
setContentLang(lang);

// Wczytanie właściwej wersji językowej treści PRZED zbudowaniem reszty
// interfejsu — top-level await jest tu bezpieczny, bo to jedyny <script
// type="module"> strony i nic nie czeka na main.js poza przeglądarką.
const { ZONES, ZONE_ORDER, STORY } = await loadContent(lang);

// Statyczne ozdobniki interfejsu w stylu gry (zamiast emoji).
el("start-npc").innerHTML = npcArt("vulpo");
el("star-icon").innerHTML = starIcon(22);
el("btn-map").innerHTML = uiIcon("island", 32);
el("btn-vortaro").innerHTML = uiIcon("book", 30);
el("btn-story-replay").innerHTML = uiIcon("scroll", 30);
el("btn-voice").innerHTML = uiIcon("gear", 30);
el("btn-speak").innerHTML = uiIcon("speaker", 28);
el("ghost-hand").innerHTML = uiIcon("hand", 56);
el("btn-start").innerHTML = `${uiIcon("play", 26)} ${strings.play}`;
el("btn-map-win").innerHTML = `${uiIcon("island", 26)} ${strings.map}`;
el("btn-replay").innerHTML = `${uiIcon("replay", 24)} ${strings.replay}`;
el("btn-island-continue").innerHTML = `${uiIcon("island", 26)} ${strings.islandContinue}`;
el("vortaro-title").innerHTML = `${uiIcon("book", 26)} ${strings.vortaroTitle}`;
el("voice-title").innerHTML = `${uiIcon("gear", 24)} ${ui.voiceTitle}`;
el("voice-hint-1").textContent = ui.voiceHint;
el("voice-hint-2").textContent = ui.trickyHint;
el("btn-toggle-diagnostics").textContent = ui.diagToggle;
el("btn-close-voice").textContent = ui.voiceClose;
el("btn-close-vortaro").textContent = strings.vortaroClose;
el("island-win-title").textContent = strings.islandWinTitle;
el("island-win-text").innerHTML = strings.islandWinText;
const SCREENS = ["start-screen", "story-screen", "map-screen", "game-screen", "win-screen", "island-win-screen"];

renderLangSwitch();

const game = new Game(lang);

function renderLangSwitch() {
  const box = el("lang-switch");
  box.innerHTML = "";
  const LABELS = { eo: "EO", pl: "PL", en: "EN" };
  for (const l of LANGS) {
    const btn = document.createElement("button");
    btn.className = "lang-button" + (l === lang ? " active" : "");
    btn.textContent = LABELS[l];
    btn.addEventListener("click", () => {
      if (l === lang) return;
      setLang(l);
      location.reload();
    });
    box.appendChild(btn);
  }
}

function showScreen(name) {
  for (const s of SCREENS) el(s).classList.toggle("hidden", s !== name);
  const bareScreen = name === "start-screen" || name === "story-screen";
  el("topbar").classList.toggle("hidden", bareScreen);
  el("btn-map").classList.toggle("hidden", name === "map-screen");
}

function allZonesDone(save) {
  return ZONE_ORDER.every((id) => save.zones[id]?.done);
}

function showRealMap(arrival = false) {
  renderMap(game, ZONES, ZONE_ORDER, strings.lockedZone, enterZone, arrival);
  showScreen("map-screen");
}

// arrival=true tylko po bajce wprowadzającej: balon z awatarem
// ląduje na wyspie, zanim postać stanie na drodze.
function goToMap(arrival = false) {
  game.deactivate();
  stopSpeech();

  // Pierwszy raz, gdy dziecko ukończy WSZYSTKIE obecne strefy — wspólne
  // świętowanie całej wyspy, zamiast po prostu wracać na mapę.
  if (allZonesDone(game.save) && !game.save.islandCelebrated) {
    showIslandCelebration();
    return;
  }
  showRealMap(arrival);
}

function showIslandCelebration() {
  game.markIslandCelebrated();
  const npcs = el("island-win-npcs");
  npcs.innerHTML = `<span>${avatarArt(game.save.avatar)}</span>` +
    ZONE_ORDER.map((id) => `<span>${npcArt(ZONES[id].npc.id)}</span>`).join("");
  el("island-win-stars").innerHTML = `${starIcon(28)} ${game.save.stars}`;
  showScreen("island-win-screen");
  speak(strings.islandWinSpoken);
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
  runIntro(game, STORY, strings, () => goToMap(true));
}

game.onWin = () => showScreen("win-screen");

// Start wymaga gestu użytkownika — to odblokowuje audio na urządzeniach mobilnych.
el("btn-start").addEventListener("click", () => {
  initAudio();
  if (game.save.avatar) goToMap();
  else startStory();
});

// Uwaga: nie podpinamy goToMap bezpośrednio — handler dostałby obiekt
// zdarzenia jako (truthy) argument `arrival` i balon lądowałby co kliknięcie.
el("btn-map").addEventListener("click", () => goToMap());
el("btn-map-win").addEventListener("click", () => goToMap());
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
  const t = ui.diag;
  box.innerHTML = `
    ${t.version}: ${d.version}<br>
    ${t.synthLabel}: ${d.hasSynth ? t.synthYes : t.synthNo}<br>
    ${t.voiceCount}: ${d.voiceCount}<br>
    ${t.browserLang}: ${d.lang}<br>
    ${t.pwaMode}: ${d.standalone ? t.yes : t.no}<br>
    ${t.audioCtx}: ${d.audioCtxState ?? t.none}
    ${d.likelyInAppBrowser ? `<br><strong>${t.inAppWarning}</strong>` : ""}
  `;
}

// Podgląd fonetycznych obejść (transliteracja esperanta) ma sens tylko
// w trybie "eo" — w pl/en treść jest już naturalnym tekstem tego języka,
// więc test "trudnych słówek" nic ciekawego by nie pokazał.
const TRICKY_WORDS = lang === "eo" ? [
  "Trovu la birdon!",
  "Trovu la sciuron!",
  "Tuŝu la dormantan beston!",
  "Tuŝu la saltantan beston!",
  "Donu la akvon al Strigo!",
  "Unue tuŝu la sunon, poste la lunon!",
  "Trovu la ĉielarkon!",
  "Tuŝu la feliĉan vizaĝon!",
  "Trovu la ŝlosilon!",
  "Unue tuŝu la ŝlosilon, poste la pordon, fine la kronon!",
  "Trovu la aviadilon!",
  "Memoru, kie estas la fulmo!",
] : [];

function renderTrickyWords() {
  const box = el("tricky-words");
  box.innerHTML = "";
  el("tricky-words-section").classList.toggle("hidden", TRICKY_WORDS.length === 0);
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

const VOICE_SAMPLE = ZONES[ZONE_ORDER[0]].npc.greeting;

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
    `🔄 ${ui.autoVoice}${!saved && current ? ` — ${current.name}` : ""}`,
    null,
    current,
    !saved,
  );
  for (const v of voices) {
    const id = v.voiceURI ?? v.name;
    addItem(`${v.name} — ${v.lang}`, id, v, saved === id);
  }
  if (!voices.length) {
    list.innerHTML = `<p class="vortaro-empty">${ui.noVoices}</p>`;
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
