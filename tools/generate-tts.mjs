#!/usr/bin/env node
// Generuje nagrania lektorskie (mp3) przez OpenAI TTS dla wszystkich kwestii
// gry i zapisuje js/data/audioManifest.js, którą js/audio.js odczytuje
// w runtime: jeśli dla danej pary (tekst, profil głosu) istnieje nagranie,
// gra odtwarza JE zamiast syntezy Web Speech — Web Speech zostaje jako
// fallback dla wszystkiego, co nie zostało (jeszcze) nagrane.
//
// Użycie:
//   OPENAI_API_KEY=sk-... node tools/generate-tts.mjs
//   node tools/generate-tts.mjs --dry-run   # lista fraz, bez wywołań API
//   node tools/generate-tts.mjs --regen "ĵ|sciur|donaco"
//     # wymuś PONOWNE nagranie fraz pasujących do regexa (np. po poprawie
//     # reguł wymowy niżej stare pliki mają starą, złą wymowę)
//
// Bezpieczne do przerwania i ponownego uruchomienia — pomija kwestie, dla
// których plik mp3 już istnieje na dysku i jest wpisany w manifeście.

import { writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { ZONES } from "../js/data/zones.js";
import { STORY } from "../js/data/story.js";
import { NARRATOR, REWARD_VOICE } from "../js/audio.js";
import { AVATAR_TYPES, AVATAR_COLORS } from "../js/art.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const AUDIO_DIR = path.join(ROOT, "assets", "audio");
const MANIFEST_PATH = path.join(ROOT, "js", "data", "audioManifest.js");

const MODEL = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const API_URL = "https://api.openai.com/v1/audio/speech";

// Głosy zweryfikowane ręcznie na próbkach "Trovu la sciuron!" (patrz
// README, Faza 2): dobre — marin, nova, sage, coral; ZAKAZANE — shimmer,
// cedar, verse (gorsza wymowa esperanckich skupisk spółgłosek, np.
// "sciuro" czytane jak angielskie "sh..."). Ośmiu ról dzieli te cztery
// zweryfikowane głosy — różnicowane tempem (speed) i stylem (instructions,
// działa tylko z modelem gpt-4o-mini-tts). Wyjątek: drako dostał "onyx"
// (żaden ze sprawdzonych głosów nie brzmi jak głęboki, dramatyczny smok) —
// NIEZWERYFIKOWANY jeszcze przez odsłuch, do potwierdzenia.
const ROLES = {
  narrator: { voice: "marin", speed: 0.95, instructions: "Warm, clear, neutral storyteller voice for a children's language-learning app." },
  reward: { voice: "marin", speed: 0.7, instructions: "Speak the single word slowly and very clearly, like teaching pronunciation to a young child." },
  vulpo: { voice: "nova", speed: 1.15, instructions: "Quick, bright, playful young fox — high energy and friendly." },
  urso: { voice: "sage", speed: 0.75, instructions: "Slow, warm, deep, gentle bear — sleepy and kind." },
  papago: { voice: "coral", speed: 1.1, instructions: "Squawky, high-pitched, cheerful parrot — slightly repetitive and theatrical." },
  strigo: { voice: "sage", speed: 0.9, instructions: "Calm, wise, thoughtful owl speaking softly and deliberately." },
  kankro: { voice: "coral", speed: 1.05, instructions: "Lively, upbeat, energetic crab at the beach." },
  drako: { voice: "onyx", speed: 0.7, instructions: "Deep, dramatic, booming ancient dragon guardian — slow and powerful." },
};

// Kilka stałych kwestii interfejsu, których nie ma w zones.js/story.js —
// żyją wprost w kodzie (main.js/map.js/story.js). Trzymane tu ręcznie
// w synchronizacji; jeśli ten tekst się zmieni w kodzie, zmień go i tutaj.
const NARRATOR_UI_LINES = [
  "Ankoraŭ ne! Unue finu la alian lokon!", // map.js — kliknięcie zablokowanej strefy
  "Vi esploris la tutan Esperantion! Ĉiuj estas dankemaj al vi!", // main.js — finał wyspy
  "Kiu vi estas? Elektu!", // story.js — wybór awatara
  "Bonege! Ek al la aventuro!", // story.js — start po wyborze awatara
];

// Rozbija trudne skupiska spółgłosek i ziew samogłoskowy myślnikiem, żeby
// model nie zlewał ich w jeden obcy dźwięk (np. "sciuro" czytane jak
// angielskie "sh...", "papilio" jak jedna sklejona sylaba zamiast
// papili-o). Działa WYŁĄCZNIE na tekst wysyłany do OpenAI — manifest
// nadal jest kluczowany oryginalnym tekstem z zones.js/story.js.
// Całe słowa, które model skłonny jest odczytać jak identycznie/podobnie
// zapisane słowo angielskie zamiast esperanckiej fonetyki (ten sam problem
// co "birdon"→angielskie "bird" udokumentowany w js/audio.js). Rozbicie
// myślnikiem łamie dopasowanie do angielskiego słowa, nie zmieniając
// esperanckiej wymowy (myślnik brzmi co najwyżej jak mikropauza).
const LOOKALIKE_WORDS = {
  Brave: "Bra-ve",
  brave: "bra-ve",
};

// Słowa złożone, gdzie granica członów musi zostać słyszalna, bo inaczej
// spółgłoska zlewa się z kolejnym członem w obcy dźwięk (np. "ĉielarko"
// czytane jakby zaczynało się od "larko" zamiast ĉiel+arko). Klucze to
// forma PO regule ziewu samogłoskowego niżej (i([aeou])→i-$1) — bez tego
// "ĉielarko" najpierw stałoby się "ĉi-elarko" i nie dopasowałoby się tu.
// Wartość to ostateczna, pożądana forma "ĉiel-arko" (jeden wyraźny podział
// na granicy członów, bez dodatkowego rozbicia ĉi-el).
const COMPOUND_BREAKS = {
  "ĉi-elarko": "ĉiel-arko",
  "ĉi-elarkon": "ĉiel-arkon",
};

function preprocessEsperantoForTTS(text) {
  let out = text;
  for (const [word, safe] of Object.entries(LOOKALIKE_WORDS)) {
    out = out.replace(new RegExp(`\\b${word}\\b`, "g"), safe);
  }
  out = out
    .replace(/SC/g, "S-TS")
    .replace(/Sc/g, "S-ts")
    .replace(/sc/g, "s-ts")
    .replace(/kn/g, "k-n")
    .replace(/Kn/g, "K-n")
    .replace(/gn/g, "g-n")
    .replace(/Gn/g, "G-n")
    .replace(/pn/g, "p-n")
    .replace(/Pn/g, "P-n")
    .replace(/ps/g, "p-s")
    .replace(/Ps/g, "P-s")
    .replace(/mn/g, "m-n")
    .replace(/Mn/g, "M-n")
    // W esperanto każda samogłoska jest osobną sylabą — nie ma dyftongów.
    .replace(/i([aeou])/gi, "i-$1")
    // Osobne "c" (poza "sc", już rozbite wyżej) = zawsze "ts" — bez tego
    // model bywa skłonny czytać je jak angielskie "k" albo "s" (np.
    // "donaco" jak angielskie "donako").
    .replace(/C/g, "Ts")
    .replace(/c/g, "ts")
    // "ĵ" (dźwięk "ż"/ʒ) model czytał jak zwykłe "j" mimo instrukcji
    // (usłyszane w praktyce: "manĝaĵojn" → "mandżajojn"). Zapis "zh" to
    // standardowa angielska transkrypcja tego dźwięku ("measure") — model
    // czyta ją poprawnie.
    .replace(/Ĵ/g, "Zh")
    .replace(/ĵ/g, "zh");
  for (const [word, safe] of Object.entries(COMPOUND_BREAKS)) {
    // Bez \b: \b w JS opiera się na \w (ASCII), więc nie rozpoznaje granicy
    // przed "ĉ" — zwykłe globalne podstawienie działa poprawnie i jest
    // bezpieczne dla tych konkretnych, unikalnych słów złożonych.
    out = out.split(word).join(safe);
  }
  return out;
}

const PRONUNCIATION_RULES = `You are reading text written in Esperanto.

Follow official Esperanto pronunciation strictly.

General rules:
* Pronounce every letter consistently according to Esperanto phonetics.
* Every letter always has exactly one sound.
* Stress always falls on the penultimate syllable.
* Never apply English, Polish, Italian, Spanish, French or other language pronunciation rules.
* Read naturally but articulate clearly, as if teaching beginners.

Consonants:
* c = "ts" (as in "cats")
* ĉ = "ch" (as in "church")
* ĝ = "j" (as in "judge")
* ĥ = voiceless velar fricative (similar to the "ch" in German "Bach")
* ĵ = "s" in "measure"
* ŝ = "sh"
* j = consonantal "y"
* ŭ = "w"-like glide, only in diphthongs (aŭ, eŭ)

Important consonant clusters:
* Pronounce every consonant separately. Never merge or soften consonant clusters.
* The sequence "sc" is ALWAYS pronounced as "s" followed by "c" ("sts"), never as "sh", "sj", "sch" or any similar sound.

Reading style:
* Speak slowly and articulate each consonant clearly.
* Make short natural pauses after commas and full stops.
* Prioritize pronunciation accuracy over conversational speed.`;

// Musi dawać IDENTYCZNY wynik co manifestKey() w js/audio.js.
function profileKey(text, profile) {
  const rate = profile.rate ?? NARRATOR.rate;
  const pitch = profile.pitch ?? NARRATOR.pitch;
  return `${rate}|${pitch}|${text}`;
}

// Slajd bajki może pożyczać głos któregoś NPC (np. Vulpo w intro) —
// dopasowanie po rate+pitch, żeby użyć TEGO SAMEGO głosu co w grze
// właściwej, zamiast generować osobne, niespójne nagranie.
function matchNpcRole(voice) {
  if (!voice) return null;
  for (const zone of Object.values(ZONES)) {
    if (zone.npc.voice.rate === voice.rate && zone.npc.voice.pitch === voice.pitch) {
      return zone.npc.id;
    }
  }
  return null;
}

// Zbiera WSZYSTKIE unikalne (tekst, rola, profil) wypowiadane w grze.
function collectPhrases() {
  const phrases = new Map(); // key -> { text, role, profile }
  const add = (text, role, profile) => {
    if (!text) return;
    const key = profileKey(text, profile);
    if (!phrases.has(key)) phrases.set(key, { text, role, profile });
  };

  for (const zone of Object.values(ZONES)) {
    const role = zone.npc.id;
    const voice = zone.npc.voice;
    add(zone.npc.greeting, role, voice);
    for (const line of zone.story ?? []) add(line, role, voice);
    add(`Bonege! ${zone.winText}`, role, voice); // dokładnie tak, jak woła finishZone()
    for (const phrase of zone.retryPhrases ?? []) add(phrase, role, voice);
    for (const phrase of zone.successPhrases ?? []) add(phrase, role, voice);
    for (const task of zone.tasks) {
      add(task.instruction, role, voice);
      if (task.reward?.word) add(task.reward.word, "reward", REWARD_VOICE);
    }
    if (zone.skill) {
      add(zone.skill.line, role, voice);
      add(zone.skill.praise, role, voice);
      add(zone.skill.lockedLine, role, voice);
      if (zone.skill.reward?.word) add(zone.skill.reward.word, "reward", REWARD_VOICE);
    }
  }

  for (const slide of STORY) {
    const role = matchNpcRole(slide.voice) ?? "narrator";
    add(slide.text, role, slide.voice ?? NARRATOR);
  }

  for (const line of NARRATOR_UI_LINES) add(line, "narrator", NARRATOR);

  // Kreator postaci wypowiada nazwy typów i kolorów jak słówka-nagrody
  // (wolno i wyraźnie) — patrz story.js.
  for (const t of AVATAR_TYPES) add(t.name, "reward", REWARD_VOICE);
  for (const c of AVATAR_COLORS) add(c.id, "reward", REWARD_VOICE);

  return [...phrases.values()];
}

// Hash liczony z tekstu PO preprocesingu: gdy poprawimy reguły wymowy,
// fraza dostaje NOWĄ nazwę pliku — PWA nie może podetknąć starego,
// źle wymówionego mp3 z cache (cache'owanie nagrań jest wieczne per URL).
function hashFileName(role, text) {
  const hash = createHash("sha256")
    .update(`${role}:${preprocessEsperantoForTTS(text)}`)
    .digest("hex")
    .slice(0, 12);
  return `${role}-${hash}.mp3`;
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function loadExistingManifest() {
  if (!(await fileExists(MANIFEST_PATH))) return {};
  const mod = await import(`${pathToFileURL(MANIFEST_PATH).href}?t=${Date.now()}`);
  return { ...mod.AUDIO_MANIFEST };
}

async function generateOne(apiKey, text, role) {
  const cfg = ROLES[role];
  if (!cfg) throw new Error(`Nieznana rola głosu: "${role}" (dodaj ją do ROLES w tym skrypcie)`);

  const body = {
    model: MODEL,
    voice: cfg.voice,
    input: preprocessEsperantoForTTS(text),
    response_format: "mp3",
    speed: cfg.speed,
  };
  if (MODEL === "gpt-4o-mini-tts") {
    body.instructions = `${PRONUNCIATION_RULES}\n\nCharacter voice: ${cfg.instructions}`;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI TTS ${res.status}: ${errText.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  const dryRun = process.argv.includes("--dry-run");
  const regenIdx = process.argv.indexOf("--regen");
  const regenRe = regenIdx > -1 && process.argv[regenIdx + 1]
    ? new RegExp(process.argv[regenIdx + 1], "i")
    : null;
  if (!apiKey && !dryRun) {
    console.error(
      "Brak OPENAI_API_KEY. Ustaw zmienną środowiskową albo uruchom z --dry-run,\n" +
        "żeby zobaczyć listę fraz bez wywoływania API.",
    );
    process.exit(1);
  }

  const phrases = collectPhrases();
  console.log(`Znaleziono ${phrases.length} unikalnych kwestii do nagrania (model: ${MODEL}).\n`);

  await mkdir(AUDIO_DIR, { recursive: true });
  const manifest = await loadExistingManifest();

  // Cichy plik do odblokowania odtwarzania <audio> na telefonach —
  // patrz initAudio() w js/audio.js. Nie trafia do AUDIO_MANIFEST
  // (ścieżka jest tam wpisana na sztywno), tylko na dysk.
  const unlockPath = path.join(AUDIO_DIR, "_unlock.mp3");
  if (!dryRun && !(await fileExists(unlockPath))) {
    console.log("Generuję assets/audio/_unlock.mp3 (odblokowanie <audio> na telefonach)...");
    const silent = await generateOne(apiKey, ".", "narrator");
    await writeFile(unlockPath, silent);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { text, role, profile } of phrases) {
    const key = profileKey(text, profile);
    const fileName = hashFileName(role, text);
    const filePath = path.join(AUDIO_DIR, fileName);
    const relPath = `assets/audio/${fileName}`;

    const forceRegen = regenRe?.test(text) ?? false;
    if (!forceRegen && manifest[key] && (await fileExists(path.join(ROOT, manifest[key])))) {
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${role.padEnd(8)} ${JSON.stringify(text)}`);
      generated++;
      continue;
    }

    try {
      console.log(`Generuję (${role}): ${text}`);
      const mp3 = await generateOne(apiKey, text, role);
      await writeFile(filePath, mp3);
      manifest[key] = relPath;
      generated++;
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
      failed++;
    }
  }

  if (!dryRun) {
    const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
    const contents =
      `// WYGENEROWANE przez tools/generate-tts.mjs — nie edytuj ręcznie.\n` +
      `//\n` +
      `// Klucz: "<rate>|<pitch>|<tekst>" — dokładnie tak, jak js/audio.js buduje go\n` +
      `// w runtime z argumentów speak(text, profile). Wartość: ścieżka do pliku mp3\n` +
      `// (względem katalogu głównego gry).\n` +
      `export const AUDIO_MANIFEST = ${JSON.stringify(sorted, null, 2)};\n`;
    await writeFile(MANIFEST_PATH, contents);
    console.log(`\nZapisano ${MANIFEST_PATH}`);
  }

  console.log(`\nGotowe: ${generated} wygenerowane${dryRun ? "/zaplanowane" : ""}, ${skipped} pominięte (już istnieją), ${failed} błędów.`);
  if (failed) process.exitCode = 1;
}

main();
