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

let voice = null;
let ctx = null;

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

function effectiveLang() {
  return voice?.lang?.toLowerCase().slice(0, 2) ?? "";
}

// Polski głos czyta esperanto niemal poprawnie, jeśli zapisać tekst
// polską ortografią (ŝ→sz, ĝ→dż, v→w, ŭ→ł...).
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
  return text.replace(/[ĉĈĝĜĥĤĵĴŝŜŭŬvV]/g, (ch) => PL_MAP[ch] ?? ch);
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

function prepareText(text) {
  const lang = effectiveLang();
  if (lang === "pl") return toPolish(text);
  if (lang === "en") return toEnglishPhonetic(text);
  return text;
}

// Do diagnostyki i testów: jak dokładnie zostanie przeczytany dany tekst.
export function previewSpeech(text) {
  if (!voice) pickVoice();
  return { voice: voice ? `${voice.name} (${voice.lang})` : null, text: prepareText(text) };
}

// Profil narratora; NPC mają własne profile w zones.js.
export const NARRATOR = { rate: 0.85, pitch: 1.0 };

export function initAudio() {
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (AudioCtx && !ctx) ctx = new AudioCtx();
  if (ctx?.state === "suspended") ctx.resume();
}

export function speak(text, profile = NARRATOR) {
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
    // Lista głosów potrafi załadować się po starcie — dobieraj do skutku.
    if (!voice) pickVoice();

    let started = false;
    let retried = false;

    const makeUtterance = (t, v, lang) => {
      const u = new SpeechSynthesisUtterance(t);
      if (v) u.voice = v;
      u.lang = lang;
      u.rate = profile.rate ?? NARRATOR.rate;
      u.pitch = profile.pitch ?? NARRATOR.pitch;
      u.onstart = () => {
        started = true;
      };
      u.onend = finish;
      return u;
    };

    // Plan B: wybrany głos milczy (uszkodzony/sieciowy) — mów domyślnym
    // głosem systemu, z transliteracją dopasowaną do języka systemu.
    const retry = () => {
      if (retried || done) return;
      retried = true;
      synth.cancel();
      const sysLang = (navigator.language || "en").toLowerCase();
      const t = sysLang.startsWith("pl")
        ? toPolish(text)
        : sysLang.startsWith("en")
          ? toEnglishPhonetic(text)
          : text;
      const u2 = makeUtterance(t, null, navigator.language || "en-US");
      u2.onerror = finish;
      setTimeout(() => synth.speak(u2), 60);
    };

    const u = makeUtterance(prepareText(text), voice, voice?.lang ?? "eo");
    u.onerror = (e) => {
      // Nasze własne cancel() (wyjście do mapy) nie jest awarią.
      if (e?.error === "canceled" || e?.error === "interrupted") finish();
      else retry();
    };

    synth.cancel();
    // Chrome potrafi zgubić utterance wysłane tuż po cancel() —
    // krótka przerwa omija ten bug.
    setTimeout(() => synth.speak(u), 60);
    setTimeout(() => {
      if (!started && !done) retry();
    }, 2000);

    // Awaria TTS nigdy nie może zawiesić gry.
    setTimeout(finish, 1600 + text.length * 130);
  });
}

export function stopSpeech() {
  window.speechSynthesis?.cancel();
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
