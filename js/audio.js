// Audio: mowa (Web Speech API) + proste efekty dźwiękowe (Web Audio API).
// Głos esperancki jest rzadki, więc wybieramy najlepszy dostępny:
// eo > pl (fonetyka bardzo zbliżona do esperanta) > domyślny głos systemu.

let voice = null;
let ctx = null;

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  voice =
    voices.find((v) => v.lang.toLowerCase().startsWith("eo")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("pl")) ||
    voices[0] ||
    null;
}

export function initAudio() {
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (AudioCtx && !ctx) ctx = new AudioCtx();
  if (ctx?.state === "suspended") ctx.resume();
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "eo";
  u.rate = 0.85;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

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
