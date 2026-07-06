// Audio: mowa (Web Speech API) + proste efekty dźwiękowe (Web Audio API).
//
// Dobór głosu: esperancki jest rzadki, więc szukamy w kolejności języków
// o fonetyce najbliższej esperantu. Angielski tylko w ostateczności —
// czyta esperanto fatalnie.
//
// speak() zwraca Promise kończącą się wraz z mową — całe tempo gry
// (pauzy, przejścia) jest sterowane faktyczną długością wypowiedzi.

let voice = null;
let ctx = null;

const VOICE_LANG_PREFS = ["eo", "pl", "hr", "sk", "cs", "it", "es", "pt", "ro"];

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  for (const lang of VOICE_LANG_PREFS) {
    const v = voices.find((v) => v.lang?.toLowerCase().startsWith(lang));
    if (v) {
      voice = v;
      return;
    }
  }
  voice = voices.find((v) => !v.lang?.toLowerCase().startsWith("en")) || voices[0] || null;
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

function prepareText(text) {
  if (!voice?.lang?.toLowerCase().startsWith("pl")) return text;
  return text.replace(/[ĉĈĝĜĥĤĵĴŝŜŭŬvV]/g, (ch) => PL_MAP[ch] ?? ch);
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

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(prepareText(text));
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "eo";
    u.rate = profile.rate ?? NARRATOR.rate;
    u.pitch = profile.pitch ?? NARRATOR.pitch;
    u.onend = finish;
    u.onerror = finish;
    // Awaria TTS nigdy nie może zawiesić gry.
    setTimeout(finish, 1200 + text.length * 130);
    window.speechSynthesis.speak(u);
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
