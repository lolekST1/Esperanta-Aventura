// Audio: mowa + proste efekty dźwiękowe (Web Audio API).
//
// Mowa ma dwa tory:
//   1. Nagrane lektorskie mp3 (OpenAI TTS, wygenerowane offline przez
//      scripts/generate-tts.mjs, mapowane w AUDIO_MANIFEST) — pierwszy
//      wybór, gdy fraza + głos NPC mają gotowe nagranie.
//   2. Web Speech API — fallback, gdy nagrania nie ma albo się nie
//      odtworzyło (np. brak sieci przy pierwszym, nieocache'owanym
//      uruchomieniu). Esperancki jest rzadki jako głos systemowy, więc
//      szukamy w kolejności języków o fonetyce najbliższej esperantu;
//      angielski tylko w ostateczności, i wtedy tekst jest transliterowany
//      na jego ortografię, żeby wymowa była poprawna — np. dla angielskiego
//      "birdon" → "beerdohn" (inaczej lektor czyta "berdon").
//
// speak() zwraca Promise kończącą się wraz z mową — całe tempo gry
// (pauzy, przejścia) jest sterowane faktyczną długością wypowiedzi.

import { AUDIO_MANIFEST } from "./data/audioManifest.js";

let voice = null;
let ctx = null;
let audioEl = null;

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

// Profil narratora; NPC mają własne profile w zones.js. `id` łączy profil
// z lektorskim nagraniem OpenAI TTS w AUDIO_MANIFEST (patrz niżej) —
// profile bez id (ad-hoc obiekty {rate,pitch}) zawsze idą przez Web Speech.
export const NARRATOR = { rate: 0.85, pitch: 1.0, id: "narrator" };

// Profil do pojedynczych słówek (nagroda po zadaniu, klik w Vortaro) —
// wolno i wyraźnie, jak nauczyciel powtarzający nowe słowo.
export const VOCAB = { rate: 0.7, pitch: 1.15, id: "vocab" };

// Cichy plik używany wyłącznie do odblokowania odtwarzania <audio> —
// telefony blokują je tak samo jak speechSynthesis, dopóki nie padnie
// odtworzenie SYNCHRONICZNIE w geście użytkownika.
const UNLOCK_SRC = "assets/audio/_unlock.mp3";

// Telefony blokują TTS, dopóki pierwsze speak() nie padnie SYNCHRONICZNIE
// w geście użytkownika. initAudio() jest wołane w handlerze kliknięcia
// „Ludi!", więc odblokowujemy tu silnik cichą wypowiedzią — zarówno Web
// Speech, jak i (osobno) HTMLAudioElement używany do nagranych mp3.
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

  if (!audioEl) audioEl = new Audio();
  try {
    audioEl.src = UNLOCK_SRC;
    audioEl.volume = 0;
    const p = audioEl.play();
    if (p?.then) {
      p.then(() => {
        // Do chwili, gdy ta obietnica się rozstrzygnie, mogła już ruszyć
        // prawdziwa kwestia NPC (współdzielimy audioEl) — pauzujemy TYLKO
        // jeśli wciąż gra plik rozgrzewkowy, żeby nie ucinać właściwego
        // odtwarzania.
        if (audioEl.currentSrc.endsWith(UNLOCK_SRC)) audioEl.pause();
        audioEl.volume = 1;
      }).catch(() => { audioEl.volume = 1; });
    }
  } catch {}
}

// Nagrane lektorskie mp3 (OpenAI TTS, wygenerowane offline przez
// scripts/generate-tts.mjs) — mapowane po (id profilu głosu, dokładny
// tekst) w AUDIO_MANIFEST. Profile bez `id` (ad-hoc {rate,pitch}) zawsze
// idą przez Web Speech.
function findRecording(text, profile) {
  const id = profile?.id;
  return id ? AUDIO_MANIFEST[`${id}::${text}`] ?? null : null;
}

let pendingRecordingFinish = null;

// Rozstrzyga się statusem: "ok" (odegrało do końca), "error" (nie dało
// się odtworzyć — speak() spada wtedy na Web Speech) albo "stopped"
// (przerwane przez stopSpeech(), NIE powinno wywoływać fallbacku).
function playRecording(src) {
  return new Promise((resolve) => {
    if (!audioEl) audioEl = new Audio();
    let done = false;
    const finish = (status) => {
      if (done) return;
      done = true;
      audioEl.onended = null;
      audioEl.onerror = null;
      pendingRecordingFinish = null;
      resolve(status);
    };
    pendingRecordingFinish = finish;
    audioEl.onended = () => finish("ok");
    audioEl.onerror = () => finish("error");
    audioEl.volume = 1;
    audioEl.currentTime = 0;
    audioEl.src = src;
    const p = audioEl.play();
    if (p?.catch) p.catch(() => finish("error"));
  });
}

export async function speak(text, profile = NARRATOR) {
  const recording = findRecording(text, profile);
  if (recording) {
    const status = await playRecording(recording);
    if (status !== "error") return;
  }
  return speakSynth(text, profile);
}

function speakSynth(text, profile) {
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
  audioEl?.pause();
  pendingRecordingFinish?.("stopped");
}

// Diagnostyka na żywo dla ekranu ⚙️ — gdy nawet ręczny wybór głosu milczy,
// to nie jest już kwestia doboru głosu. Te fakty (bez devtools na
// telefonie) pokazują, co dokładnie się dzieje.
// Bumpowane ręcznie przy każdej zmianie wymowy/audio — widoczne na ⚙️,
// żeby łatwo sprawdzić, czy przeglądarka na pewno wczytała najnowszą
// wersję (PWA potrafi trzymać starą do czasu pełnego zamknięcia+otwarcia).
export const GAME_VERSION = "v17-openai-tts";

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
