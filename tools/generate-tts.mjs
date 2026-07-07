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

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const AUDIO_DIR = path.join(ROOT, "assets", "audio");
const MANIFEST_PATH = path.join(ROOT, "js", "data", "audioManifest.js");

const MODEL = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
const API_URL = "https://api.openai.com/v1/audio/speech";

// Trzy głosy zweryfikowane ręcznie (patrz README, Faza 2) jako poprawnie
// wymawiające esperanckie testowe słowa (sciuro, birdo, hundino) bez żadnej
// transliteracji-obejścia. Sześciu NPC + narrator + słówka-nagrody dzielą
// te same trzy głosy — różnicowane tempem (speed) i stylem (instructions,
// działa tylko z modelem gpt-4o-mini-tts).
const ROLES = {
  narrator: { voice: "marin", speed: 0.95, instructions: "Warm, clear, neutral storyteller voice for a children's language-learning app." },
  reward: { voice: "marin", speed: 0.7, instructions: "Speak the single word slowly and very clearly, like teaching pronunciation to a young child." },
  vulpo: { voice: "nova", speed: 1.15, instructions: "Quick, bright, playful young fox — high energy and friendly." },
  urso: { voice: "cedar", speed: 0.75, instructions: "Slow, warm, deep, gentle bear — sleepy and kind." },
  papago: { voice: "nova", speed: 1.1, instructions: "Squawky, high-pitched, cheerful parrot — slightly repetitive and theatrical." },
  strigo: { voice: "cedar", speed: 0.9, instructions: "Calm, wise, thoughtful owl speaking softly and deliberately." },
  kankro: { voice: "marin", speed: 1.05, instructions: "Lively, upbeat, energetic crab at the beach." },
  drako: { voice: "cedar", speed: 0.7, instructions: "Deep, dramatic, booming ancient dragon guardian — slow and powerful." },
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

  return [...phrases.values()];
}

function hashFileName(role, text) {
  const hash = createHash("sha256").update(`${role}:${text}`).digest("hex").slice(0, 12);
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

  const body = { model: MODEL, voice: cfg.voice, input: text, response_format: "mp3", speed: cfg.speed };
  if (MODEL === "gpt-4o-mini-tts") body.instructions = cfg.instructions;

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

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { text, role, profile } of phrases) {
    const key = profileKey(text, profile);
    const fileName = hashFileName(role, text);
    const filePath = path.join(AUDIO_DIR, fileName);
    const relPath = `assets/audio/${fileName}`;

    if (manifest[key] && (await fileExists(path.join(ROOT, manifest[key])))) {
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
