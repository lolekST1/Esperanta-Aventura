// Audio: mowa (Web Speech API) + proste efekty dźwiękowe (Web Audio API).
//
// Dobór głosu: esperancki jest rzadki, więc szukamy w kolejności języków
// o fonetyce najbliższej esperantu. Angielski tylko w ostateczności.
// Gdy jednak zostaje angielski (lub polski), tekst jest transliterowany
// na ortografię tego języka, żeby wymowa była poprawna — np. dla
// angielskiego "birdon" → "beerdohn" (inaczej lektor czyta "berdon").
//
// speak() zwraca Promise kończącą się wraz z mową — całe tempo gry
// (pauzy, przejścia) jest sterowane faktyczną długością wypowiedzi.
//
// Nagrania lektorskie: jeśli dla danej (tekst, profil) pary istnieje wpis
// w AUDIO_MANIFEST (wygenerowany przez tools/generate-tts.mjs z OpenAI TTS),
// speak() odtwarza GOTOWY plik mp3 zamiast syntezy Web Speech — lepsza,
// spójna wymowa esperanta bez transliteracji-obejść poniżej. Cokolwiek
// jeszcze nie zostało nagrane (albo odtwarzanie się nie uda) spada na
// dotychczasową syntezę, więc funkcja tego pliku działa identycznie nawet
// przy pustym manifeście.

import { AUDIO_MANIFEST } from "./data/audioManifest.js";

let voice = null;
let ctx = null;
let currentAudio = null;

const VOICE_KEY = "esperanta-aventuro-voice";
const VOICE_LANG_PREFS = ["eo", "pl", "hr", "sk", "cs", "it", "es", "pt", "ro"];

function allVoices() {
  return window.speechSynthesis?.getVoices?.() ?? [];
}

function voiceId(v) {
  return v.voiceURI ?? v.name;
}

// Głosy lokalne są niezawodne; sieciowe potrafią milczeć bez błędu.
function preferLocal(list) {
  return list.find((v) => v.localService !== false) ?? list[0];
}

function pickVoice() {
  const voices = allVoices();

  // Głos wybrany ręcznie przez rodzica (ekran ⚙️) wygrywa ze wszystkim.
  const saved = localStorage.getItem(VOICE_KEY);
  if (saved) {
    const v = voices.find((v) => voiceId(v) === saved);
    if (v) {
      voice = v;
      return;
    }
  }

  const byName = voices.filter((v) => /esperant/i.test(v.name ?? ""));
  if (byName.length) {
    voice = preferLocal(byName);
    return;
  }
  for (const lang of VOICE_LANG_PREFS) {
    const m = voices.filter((v) => v.lang?.toLowerCase().replace("_", "-").startsWith(lang));
    if (m.length) {
      voice = preferLocal(m);
      return;
    }
  }
  const nonEn = voices.filter((v) => !v.lang?.toLowerCase().startsWith("en"));
  voice = preferLocal(nonEn.length ? nonEn : voices) ?? null;
}

// Dla ekranu wyboru głosu (⚙️ na mapie).
export function getVoiceChoices() {
  pickVoice();
  return {
    voices: allVoices(),
    current: voice,
    saved: localStorage.getItem(VOICE_KEY),
  };
}

export function setVoiceOverride(id) {
  if (id) localStorage.setItem(VOICE_KEY, id);
  else localStorage.removeItem(VOICE_KEY);
  pickVoice();
}

// Głos i język, którymi faktycznie odezwie się gra. Gdy nie ma wybranego
// głosu, używamy domyślnego głosu systemu w języku systemu — NIGDY nie
// wymuszamy lang="eo" bez głosu eo, bo Android wtedy potrafi milczeć.
function resolveSpeech() {
  if (!voice) pickVoice();
  if (voice) return { voice, lang: voice.lang || navigator.language || "en" };
  return { voice: null, lang: navigator.language || "en" };
}

// Polski głos czyta esperanto niemal poprawnie, jeśli zapisać tekst
// polską ortografią (ŝ→sz, ĝ→dż, v→w, ŭ→ł...). Zwykłe "c" ZOSTAWIAMY
// bez zmian — próba jawnego zapisu jako "ts" (sciuro→stsiuro) brzmiała
// gorzej niż oryginał (jak "stiuro"); wystarczy sam rozdział sylab
// z reguły hiatusu niżej (sciuro→sci-uro).
const PL_MAP = {
  "ĉ": "cz", "Ĉ": "Cz",
  "ĝ": "dż", "Ĝ": "Dż",
  "ĥ": "h", "Ĥ": "H",
  "ĵ": "ż", "Ĵ": "Ż",
  "ŝ": "sz", "Ŝ": "Sz",
  "ŭ": "ł", "Ŭ": "Ł",
  "v": "w", "V": "W",
};

function toPolish(text) {
  const mapped = text.replace(/[ĉĈĝĜĥĤĵĴŝŜŭŬvV]/g, (ch) => PL_MAP[ch] ?? ch);
  // W esperanto każda samogłoska jest osobną sylabą — nie ma dyftongów
  // ani zmiękczeń. Polski czyta "i" przed samogłoską jako zmiękczenie
  // poprzedniej spółgłoski + zlanie w jedną sylabę (radio→"radjo"), więc
  // "papilio" wychodziłoby jako "papiljo" zamiast pa-pi-li-o. Wymuszamy
  // rozdzielenie łącznikiem: papilio→papili-o, sciuro→sci-uro.
  return mapped.replace(/i([aeou])/gi, "i-$1");
}

// Niektóre neuronowe silniki TTS (zaobserwowane na Androidzie) wykrywają
// pojedyncze słowa "wyglądające" jak angielskie w środku obcojęzycznego
// zdania i przełączają się w ich trakcie na angielską wymowę — np.
// "birdon" czytane jak angielskie "bird". Rozbijamy znane w grze słowa
// na sylaby łącznikiem (zgodna z esperancką sylabizacją: bir-do,
// dor-mi, sal-ti) — usuwa to przypadkowe dopasowanie, nie zmieniając
// wymowy (łącznik brzmi co najwyżej jak mikropauza między sylabami).
const SYLLABLE_BREAKS = {
  birdon: "bir-don", birdo: "bir-do",
  saltantan: "sal-tan-tan", salti: "sal-ti",
  dormantan: "dor-man-tan", dormi: "dor-mi",
};

function breakKnownLookalikes(text) {
  let out = text;
  for (const [word, safe] of Object.entries(SYLLABLE_BREAKS)) {
    out = out.replace(new RegExp(`\\b${word}\\b`, "gi"), safe);
  }
  return out;
}

// Angielski głos stosuje angielskie reguły czytania ("bird", "science"),
// więc zapisujemy każdą głoskę tak, jak Anglik by ją przeczytał.
// Jedno przejście po tekście (najdłuższe dopasowanie najpierw) — bez
// ryzyka ponownego podstawiania we wstawionych fragmentach.
const EN_MAP = {
  "aŭ": "ow", "eŭ": "ehw",
  "ĉ": "ch", "ĝ": "j", "ĵ": "zh", "ŝ": "sh", "ĥ": "h", "ŭ": "w",
  "c": "ts", "j": "y",
  "a": "ah", "e": "eh", "i": "ee", "o": "oh", "u": "oo",
};

function toEnglishPhonetic(text) {
  const lower = text.toLowerCase();
  let out = "";
  let i = 0;
  while (i < lower.length) {
    const two = lower.slice(i, i + 2);
    if (EN_MAP[two]) {
      out += EN_MAP[two];
      i += 2;
      continue;
    }
    out += EN_MAP[lower[i]] ?? lower[i];
    i++;
  }
  return out;
}

function prepareText(text, lang) {
  const l = (lang || "").toLowerCase();
  if (l.startsWith("pl")) return breakKnownLookalikes(toPolish(text));
  if (l.startsWith("en")) return toEnglishPhonetic(text); // już w pełni odpisane fonetycznie
  return breakKnownLookalikes(text);
}

// Do diagnostyki i testów: jak dokładnie zostanie przeczytany dany tekst.
export function previewSpeech(text) {
  const { voice: v, lang } = resolveSpeech();
  return { voice: v ? `${v.name} (${v.lang})` : `(domyślny, ${lang})`, text: prepareText(text, lang) };
}

// Profil narratora; NPC mają własne profile w zones.js.
export const NARRATOR = { rate: 0.85, pitch: 1.0 };

// Profil wypowiadania POJEDYNCZEGO słówka-nagrody (wolno i wyraźnie) —
// używany w grze przy zdobyciu nagrody i przy odtwarzaniu z Vortaro.
export const REWARD_VOICE = { rate: 0.7, pitch: 1.15 };

// Musi dawać IDENTYCZNY wynik co profileKey() w tools/generate-tts.mjs —
// to ten sam klucz z dwóch stron (generator zapisuje, runtime odczytuje).
function manifestKey(text, profile) {
  const rate = profile.rate ?? NARRATOR.rate;
  const pitch = profile.pitch ?? NARRATOR.pitch;
  return `${rate}|${pitch}|${text}`;
}

// Telefony blokują TTS, dopóki pierwsze speak() nie padnie SYNCHRONICZNIE
// w geście użytkownika. initAudio() jest wołane w handlerze kliknięcia
// „Ludi!", więc odblokowujemy tu silnik cichą wypowiedzią.
export function initAudio() {
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    try {
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(warm);
    } catch {}
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (AudioCtx && !ctx) ctx = new AudioCtx();
  if (ctx?.state === "suspended") ctx.resume();

  // Analogiczne odblokowanie dla odtwarzania nagrań mp3 (osobny mechanizm
  // przeglądarki niż speechSynthesis) — bez tego pierwsze Audio().play()
  // poza gestem użytkownika mogłoby zostać zablokowane na iOS Safari.
  try {
    new Audio().play().catch(() => {});
  } catch {}
}

// Gotowe nagranie (jeśli istnieje w manifeście) zamiast syntezy. Błąd
// odtwarzania (plik brakuje, sieć padła) przezroczyście spada na syntezę —
// dziecko nigdy nie zostaje bez żadnej mowy z powodu jednego złego pliku.
function playRecording(src, text, profile) {
  currentAudio?.pause();
  return new Promise((resolve) => {
    const audio = new Audio(src);
    currentAudio = audio;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const fallback = () => {
      if (settled) return;
      settled = true;
      speakSynthesized(text, profile).then(resolve);
    };
    audio.addEventListener("ended", finish);
    audio.addEventListener("error", fallback);
    audio.play().catch(fallback);
  });
}

export function speak(text, profile = NARRATOR) {
  const recorded = AUDIO_MANIFEST[manifestKey(text, profile)];
  if (recorded) return playRecording(recorded, text, profile);
  return speakSynthesized(text, profile);
}

function speakSynthesized(text, profile = NARRATOR) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
    };

    if (!("speechSynthesis" in window)) {
      setTimeout(finish, Math.min(400 + text.length * 70, 2600));
      return;
    }

    const synth = window.speechSynthesis;
    const { voice: v, lang } = resolveSpeech();
    const u = new SpeechSynthesisUtterance(prepareText(text, lang));
    if (v) u.voice = v;
    if (lang) u.lang = lang;
    u.rate = profile.rate ?? NARRATOR.rate;
    u.pitch = profile.pitch ?? NARRATOR.pitch;
    u.onend = finish;
    u.onerror = finish; // "canceled"/"interrupted" z naszego cancel() też ląduje tu — to nie awaria

    // KLUCZOWE: speak() synchronicznie w geście użytkownika — inaczej
    // telefony blokują mowę. Żadnego setTimeout przed speak().
    synth.cancel();
    synth.speak(u);
    try { synth.resume(); } catch {}

    // UWAGA: niektóre silniki TTS (zaobserwowane na Androidzie) nigdy nie
    // odpalają onstart, a mowa i tak leci — dlatego NIE anulujemy na
    // podstawie "cisza po X ms" (wcześniejsza wersja to robiła i przez to
    // ucinała działającą, tylko wolno startującą mowę, w praktyce
    // wyciszając grę całkowicie). Ten timeout to wyłącznie siatka
    // bezpieczeństwa dla PRZEPŁYWU gry — synteza może grać dalej w tle.
    setTimeout(finish, 3500 + text.length * 130);
  });
}

export function stopSpeech() {
  window.speechSynthesis?.cancel();
  currentAudio?.pause();
}

// Diagnostyka na żywo dla ekranu ⚙️ — gdy nawet ręczny wybór głosu milczy,
// to nie jest już kwestia doboru głosu. Te fakty (bez devtools na
// telefonie) pokazują, co dokładnie się dzieje.
// Bumpowane ręcznie przy każdej zmianie wymowy/audio — widoczne na ⚙️,
// żeby łatwo sprawdzić, czy przeglądarka na pewno wczytała najnowszą
// wersję (PWA potrafi trzymać starą do czasu pełnego zamknięcia+otwarcia).
export const GAME_VERSION = "v24-tts-fluo";

export function diagnostics() {
  const ua = navigator.userAgent || "";
  return {
    version: GAME_VERSION,
    hasSynth: "speechSynthesis" in window,
    voiceCount: allVoices().length,
    lang: navigator.language,
    userAgent: ua,
    standalone: window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true,
    // "; wv)" w UA to oficjalny znacznik Android WebView — przeglądarki
    // wbudowane w aplikacje (Messenger, Instagram...) często blokują TTS.
    likelyInAppBrowser: /; ?wv\)/i.test(ua) || /\b(FBAN|FBAV|Instagram|MicroMessenger|Line\/)\b/i.test(ua),
    audioCtxState: ctx?.state ?? null,
  };
}

// Wypowiedź testowa z pełnym śladem zdarzeń — do ekranu ⚙️. Nie używa
// żadnych fallbacków/retry z speak(), żeby log pokazywał surowy wynik
// dla DOKŁADNIE wybranego głosu.
export function testVoice(v, text, onEvent) {
  const synth = window.speechSynthesis;
  if (!synth) {
    onEvent("brak-api", "speechSynthesis niedostępne w tej przeglądarce");
    return;
  }
  const lang = v?.lang || navigator.language || "en";
  const u = new SpeechSynthesisUtterance(prepareText(text, lang));
  if (v) u.voice = v;
  u.lang = lang;
  u.onstart = () => onEvent("onstart", "mowa wystartowała");
  u.onend = () => onEvent("onend", "mowa zakończona normalnie");
  u.onerror = (e) => onEvent("onerror", e?.error ?? "nieznany błąd");
  onEvent("wywołanie", `speak() z głosem: ${v ? v.name : "(domyślny systemowy)"}`);
  synth.cancel();
  synth.speak(u);
  try {
    synth.resume();
  } catch {}
  setTimeout(() => {
    if (synth.speaking || synth.pending) onEvent("status", "wciąż w kolejce po 3s");
    else onEvent("status", "kolejka pusta po 3s (jeśli nie było onend/onerror — cisza bez zdarzenia)");
  }, 3000);
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function tone(freq, start, duration, type = "sine", gainValue = 0.25) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

export function playSuccess() {
  if (!ctx) return;
  tone(523.25, 0, 0.15);      // C5
  tone(659.25, 0.12, 0.15);   // E5
  tone(783.99, 0.24, 0.3);    // G5
}

export function playRetry() {
  if (!ctx) return;
  tone(330, 0, 0.2, "triangle", 0.15);
  tone(294, 0.18, 0.25, "triangle", 0.15);
}

export function playTap() {
  if (!ctx) return;
  tone(440, 0, 0.08, "sine", 0.1);
}
